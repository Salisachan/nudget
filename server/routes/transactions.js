import express from 'express';
import Groq from 'groq-sdk';
import Transaction from '../models/Transaction.js';
import auth from '../middleware/auth.js';

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Parse and create transaction
router.post('/parse', auth, async (req, res) => {
    try {
        const { input } = req.body;

        const completion = await groq.chat.completions.create({
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
          Example input: "coffee 6 bucks"
          Example output: {"type":"expense","amount":6,"category":"Food & Drink","description":"Coffee"}
          Example input: "got paid 2800"
          Example output: {"type":"income","amount":2800,"category":"Salary","description":"Monthly pay"}`
                },
                {
                    role: 'user',
                    content: input
                }
            ]
        });

        const parsed = JSON.parse(completion.choices[0].message.content);

        const transaction = new Transaction({
            userId: req.userId,
            type: parsed.type,
            amount: parsed.amount,
            category: parsed.category,
            description: parsed.description,
            input: input,
        });

        await transaction.save();

        res.status(201).json({ message: 'Transaction saved', transaction });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

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

// Edit a transaction
router.put('/:id', auth, async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            req.body,
            { new: true }
        );

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

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

        res.json({ message: 'Transaction deleted' });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

export default router;