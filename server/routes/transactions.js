router.post('/parse', auth, async (req, res) => {
    try {
        const { input } = req.body;

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

        // Step 2a — if transaction, parse and save it
        if (inputType === 'transaction') {
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
            Example input: "coffee 6 bucks"
            Example output: {"type":"expense","amount":6,"category":"Food & Drink","description":"Coffee"}
            Example input: "got paid 2800"
            Example output: {"type":"income","amount":2800,"category":"Salary","description":"Monthly pay"}`
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
            })

            await transaction.save()
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

        return res.json({ responseType: 'answer', answer })

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
})