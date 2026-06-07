import Message from '../models/Message.js';

const MAX_MESSAGES = 100;

async function saveMessage(userId, role, type, content, transaction = null) {
    await Message.create({
        userId,
        role,
        type,
        content,
        transaction,
        transactionId: transaction ? transaction._id : null
    });

    // Enforce the cap — delete oldest if over limit
    const count = await Message.countDocuments({ userId });
    if (count > MAX_MESSAGES) {
        const excess = count - MAX_MESSAGES;
        const oldest = await Message.find({ userId })
            .sort({ createdAt: 1 })
            .limit(excess);
        const idsToDelete = oldest.map(m => m._id);
        await Message.deleteMany({ _id: { $in: idsToDelete } });
    }
}

export default saveMessage;