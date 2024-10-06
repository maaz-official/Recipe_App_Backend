// models/Recipe.js
import mongoose from 'mongoose';

// Ingredient sub-schema for structured ingredient information
const IngredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    quantity: {
        type: String,
        required: true,
        trim: true,
    },
}, { _id: false }); // Disable automatic generation of _id for sub-documents

// Nutrition sub-schema for structured nutrition information
const NutritionSchema = new mongoose.Schema({
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    fat: { type: Number, required: true },
    carbs: { type: Number, required: true },
}, { _id: false }); // Disable automatic generation of _id for sub-documents

// Main Recipe schema
const RecipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Reference to Category model
        required: true,
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag', // Reference to Tag model
    }],
    ingredients: [IngredientSchema], // Array of ingredients using the Ingredient sub-schema
    instructions: {
        type: [String], // Array of steps/instructions
        required: true,
    },
    cookingTime: {
        type: Number, // Cooking time in minutes
        required: true,
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Easy',
    },
    servings: {
        type: Number, // Number of servings
        required: true,
    },
    image: {
        type: String, // URL to the recipe image
        default: 'https://defaultimage.com/recipe.png', // Default image URL
    },
    nutrition: NutritionSchema, // Nutrition information structured using NutritionSchema
    author: {
        type: mongoose.Schema.Types.ObjectId, // The user who created the recipe
        ref: 'User', // Reference to User model
        required: true,
    },
    isPublished: {
        type: Boolean,
        default: false, // Recipes are unpublished by default until reviewed or approved
    },
}, { timestamps: true });

const Recipe = mongoose.model('Recipe', RecipeSchema);
export default Recipe;
