import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },

    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    paymentDate: {
        type: Date,
        default: Date.now
    },

    method: {
        type: String,
        enum: ['efectivo', 'transferencia', 'tarjeta'],
        default: 'efectivo'
    }

}, {
    timestamps: true
});

export default mongoose.model('Payment', paymentSchema);