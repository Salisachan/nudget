import express from 'express';
import Groq from 'groq-sdk';
import Transaction from '../models/Transaction.js';
import auth from '../middleware/auth.js';
import saveMessage from '../utils/saveMessage.js';
import Message from '../models/Message.js';

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Parse and create transaction
router.post('/parse', auth, async (req, res) => {
    try {
        const { input } = req.body;

        // Save the user's message first
        await saveMessage(req.userId, 'user', 'text', input)

        // Step 1 — classify input as transaction or question
        const classifyCompletion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                {
                    role: 'system',
                    content: `You are a classifier. Determine if the user input is a financial transaction to log or a question about their finances.
          Return ONLY one word: "transaction" or "question".
          Examples:
          "coffee 6 bucks" → transaction
          "uber 15" → transaction
          "got paid 2800" → transaction
          "how much did I spend on food this month?" → question
          "am I over budget?" → question
          "what did I spend the most on?" → question
          "how much did I save this month?" → question`
                },
                { role: 'user', content: input }
            ]
        })

        const inputType = classifyCompletion.choices[0].message.content.trim().toLowerCase()

        if (inputType === 'transaction') {
            const today = new Date().toLocaleDateString('en-CA')
            const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('en-CA')

            const parseCompletion = await groq.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: `You are a financial transaction parser. Extract transaction details from natural language input.
        Return ONLY a valid JSON object with no extra text, no markdown, no backticks.
        The JSON must have exactly these fields:
        - type: either "expense" or "income"
        - amount: a number (no currency symbols)
        - category: one of these expense categories: "Food & Drink", "Transport", "Shopping", "Entertainment", "Health", "Housing", "Education", "Other"
        or one of these income categories: "Salary", "Freelance", "Investment", "Gift", "Other Income"
        - description: a short description of the transaction
        - date: today's date is ${today}. You MUST detect any date references in the input and return the correct date. "yesterday" means ${yesterday}. "today" means ${today}. For other relative dates like "last friday" or "2 days ago", calculate the correct date from today's date ${today} and return it in YYYY-MM-DD format. If no date is mentioned, return today's date ${today}.
        Example input: "coffee 6 bucks"
        Example output: {"type":"expense","amount":6,"category":"Food & Drink","description":"Coffee","date":"${today}"}
        Example input: "yesterday lunch 12"
        Example output: {"type":"expense","amount":12,"category":"Food & Drink","description":"Lunch","date":"${yesterday}"}`
                    },
                    { role: 'user', content: input }
                ]
            })

            const parsed = JSON.parse(parseCompletion.choices[0].message.content)

            const transaction = new Transaction({
                userId: req.userId,
                type: parsed.type,
                amount: parsed.amount,
                category: parsed.category,
                description: parsed.description,
                input: input,
                date: parsed.date ? new Date(parsed.date + 'T12:00:00') : new Date()
            })

            await transaction.save()

            await saveMessage(req.userId, 'bot', 'card', null, transaction)

            return res.status(201).json({ responseType: 'transaction', transaction })
        }

        // Step 2b — if question, fetch user data and answer it
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

        const transactions = await Transaction.find({
            userId: req.userId,
            date: { $gte: startOfMonth }
        })

        const summary = {
            totalIncome: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
            totalExpenses: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
            byCategory: transactions.filter(t => t.type === 'expense').reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount
                return acc
            }, {})
        }

        const answerCompletion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                {
                    role: 'system',
                    content: `You are a helpful personal finance assistant. Answer the user's question based on their financial data for this month. Be concise and friendly. Use dollar amounts where relevant.
          
          Their financial data this month:
          - Total Income: $${summary.totalIncome}
          - Total Expenses: $${summary.totalExpenses}
          - Net Balance: $${summary.totalIncome - summary.totalExpenses}
          - Spending by category: ${JSON.stringify(summary.byCategory)}`
                },
                { role: 'user', content: input }
            ]
        })

        const answer = answerCompletion.choices[0].message.content

        // Save the bot's answer message
        await saveMessage(req.userId, 'bot', 'answer', answer)

        return res.json({ responseType: 'answer', answer })

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
})

// Manual transaction entry
router.post('/manual', auth, async (req, res) => {
    try {
        const { type, amount, category, description, date } = req.body

        const transaction = new Transaction({
            userId: req.userId,
            type,
            amount: parseFloat(amount),
            category,
            description,
            date: new Date(date),
            input: `Manual entry: ${description}`
        })

        await transaction.save()

        // Save bot card message
        await saveMessage(req.userId, 'bot', 'card', null, transaction)

        res.status(201).json({ message: 'Transaction saved', transaction })
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
})

// Get chat history (last 30 messages)
router.get('/messages', auth, async (req, res) => {
    try {
        const messages = await Message.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .limit(30)
        res.json(messages.reverse())
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
})

// Get all transactions for logged in user
router.get('/', auth, async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.userId })
            .sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get monthly summary
router.get('/summary', auth, async (req, res) => {
    try {
        const now = new Date()
        const month = parseInt(req.query.month) || now.getMonth() + 1
        const year = parseInt(req.query.year) || now.getFullYear()

        const startOfMonth = new Date(year, month - 1, 1)
        const endOfMonth = new Date(year, month, 1)

        const transactions = await Transaction.find({
            userId: req.userId,
            date: { $gte: startOfMonth, $lt: endOfMonth }
        })
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0)
        const expenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0)
        const byCategory = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount
                return acc
            }, {})
        res.json({ income, expenses, net: income - expenses, byCategory })
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
})

// Get the date range of user's transactions
router.get('/range', auth, async (req, res) => {
    try {
        const earliest = await Transaction.findOne({ userId: req.userId })
            .sort({ date: 1 })

        if (!earliest) {
            const now = new Date()
            return res.json({ firstMonth: now.getMonth() + 1, firstYear: now.getFullYear() })
        }

        const date = new Date(earliest.date)
        res.json({ firstMonth: date.getMonth() + 1, firstYear: date.getFullYear() })
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
})

// Get single transaction
router.get('/:id', auth, async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            userId: req.userId
        })
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' })
        }
        res.json(transaction)
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
})

// Edit a transaction
router.put('/:id', auth, async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            req.body,
            { returnDocument: 'after' }
        );

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Update the message snapshot too
        await Message.findOneAndUpdate(
            { transactionId: transaction._id, userId: req.userId },
            { transaction: transaction.toObject() }
        )

        res.json(transaction);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Delete a transaction
router.delete('/:id', auth, async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        // Also delete the message snapshot
        await Message.findOneAndDelete({
            transactionId: req.params.id,
            userId: req.userId
        })

        res.json({ message: 'Transaction deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

export default router;