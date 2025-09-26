import mongoose, { Schema } from "mongoose";

const sweetSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: false,
            trim: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        quantity: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },
        
        image: {
            type: String,
            default: "https://via.placeholder.com/300x200/6366f1/ffffff?text=No+Image"
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);


sweetSchema.index({ name: 'text', category: 'text' });

export const Sweet = mongoose.model("Sweet", sweetSchema);