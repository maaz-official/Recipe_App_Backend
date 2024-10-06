// models/Comment.js
import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
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
    content: {
        type: String,
        required: true,
        trim: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true, // Optionally include a star rating for each comment
    },
}, { timestamps: true });

const Comment = mongoose.model('Comment', CommentSchema);
export default Comment;
