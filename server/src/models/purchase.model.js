import mongoose, { Schema } from "mongoose";

const purchaseSchema = new mongoose.Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        sweet: {
            type: Schema.Types.ObjectId,
            ref: 'Sweet',
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        unitPrice: {
            type: Number,
            required: true,
            min: 0
        },

        totalPrice: {
            type: Number,
            required: true,
            min: 0
        },
        
        status: {
            type: String,
            enum: ['pending', 'completed', 'cancelled'],
            default: 'completed'
        },

        comment: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

// Calculate total price before saving
purchaseSchema.pre('save', function(next) {
    this.totalPrice = this.quantity * this.unitPrice;
    next();
});

export const Purchase = mongoose.model("Purchase", purchaseSchema);