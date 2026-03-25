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
        enum: ['activo', 'vencido', 'vence_pronto', 'sin_plan'],
        default: 'sin_plan'
    },
    delete: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

clientSchema.methods.updateStatus = function () {
    if (!this.membershipEnd || this.membershipEnd < new Date()) {
        this.status = 'vencido';
    } else if (this.membershipEnd < new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)) {
        this.status = 'vence_pronto';
    } else {
        this.status = 'activo';
    }
};



export default mongoose.model('Client', clientSchema);