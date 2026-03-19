import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true
    },

    durationDays: {
        type: Number,
        required: true
    },

    description: {
        type: String,
        minlength: 10,
        maxlength: 200
    },

    isActive: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

export default mongoose.model('Plan', planSchema);