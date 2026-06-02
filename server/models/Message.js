import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['user', 'bot'], required: true },
    type: { type: String, enum: ['text', 'card', 'answer', 'error'], required: true },
    content: { type: String },
    transaction: { type: Object },
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);