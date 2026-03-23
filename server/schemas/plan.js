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
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

planSchema.virtual('typePlan').get(function() {
    const days = this.durationDays;
    
    if (days === 1) return "Por día";
    if (days >= 7 && days <= 8) return "Semanal";
    if (days >= 14 && days <= 16) return "Quincenal";
    if (days >= 28 && days <= 31) return "Mensual";
    if (days >= 58 && days <= 62) return "Bimestral";
    if (days >= 88 && days <= 93) return "Trimestral";
    if (days >= 178 && days <= 183) return "Semestral";
    if (days >= 360 && days <= 366) return "Anual";
    
    return `Por ${days} días`;
});

export default mongoose.model('Plan', planSchema);