// models/Like.js
import mongoose from 'mongoose';

const LikeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to User model
        required: true,
    },
    recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe', // Reference to Recipe model
        required: true,
    },
}, { timestamps: true });

const Like = mongoose.model('Like', LikeSchema);
export default Like;
