import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50,
        minLength: 3
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50,
        minLength: 3
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Email must be valid']
    },
    dni: {
        type: String,
        unique: true,
        required: true,
        match: [/^\d{7,8}$/, 'DNI must be 7-8 digits']
    },
    phone: {
        type: String,
        required: true,
        match: [/^\d{7,15}$/, 'Phone must be 7-15 digits']
    },

    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan'
    },

    membershipStart: Date,
    membershipEnd: Date,

    status: {
        type: String,
        enum: ['active', 'expired'],
        default: 'expired'
    }

}, {
    timestamps: true
});

clientSchema.methods.updateStatus = function () {
    if (!this.membershipEnd || this.membershipEnd < new Date()) {
        this.status = 'expired';
    } else {
        this.status = 'active';
    }
};



export default mongoose.model('Client', clientSchema);