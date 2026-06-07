import express from 'express';
import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all budgets with current spending for this month
router.get('/', auth, async (req, res) => {
    try {
        const now = new Date()
        const month = now.getMonth() + 1
        const year = now.getFullYear()

        const budgets = await Budget.find({ userId: req.userId, month, year })

        const startOfMonth = new Date(year, month - 1, 1)
        const transactions = await Transaction.find({
            userId: req.userId,
            type: 'expense',
            date: { $gte: startOfMonth }
        })

        const spending = transactions.reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount
            return acc
        }, {})

        const result = budgets.map(b => ({
            ...b.toObject(),
            spent: spending[b.category] || 0
        }))

        res.json(result)
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
})

// Set or update a budget
router.post('/', auth, async (req, res) => {
    try {
        const { category, limit } = req.body
        const now = new Date()
        const month = now.getMonth() + 1
        const year = now.getFullYear()

        const budget = await Budget.findOneAndUpdate(
            { userId: req.userId, category, month, year },
            { limit },
            { upsert: true, returnDocument: 'after' }
        )

        res.status(201).json(budget)
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
})

// Delete a budget
router.delete('/:id', auth, async (req, res) => {
    try {
        await Budget.findOneAndDelete({ _id: req.params.id, userId: req.userId })
        res.json({ message: 'Budget deleted' })
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message })
    }
})

export default router;