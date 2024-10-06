// seeder.js
import mongoose from 'mongoose';
import connectDB from './config/db.js'; // Import your DB connection
import User from './models/userModel.js'; // Import your User model
import Recipe from './models/recipesModel.js'; // Import your Recipe model
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

// Sample user data to seed
const users = [
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456', // In production, hash the password
    },
    {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: '123456',
    },
];

// Sample recipe data to seed
const recipes = [
    {
        name: 'Spaghetti Carbonara',
        description: 'A classic Italian pasta dish made with eggs, cheese, pancetta, and pepper.',
        category: '603d4e87c09f5a001f8e9d0b', // Replace with actual ObjectId from your Category collection
        ingredients: [
            { name: 'Spaghetti', quantity: '200g' },
            { name: 'Eggs', quantity: '2 large' },
            { name: 'Parmesan cheese', quantity: '50g' },
            { name: 'Pancetta', quantity: '100g' },
            { name: 'Black pepper', quantity: 'to taste' },
        ],
        instructions: [
            'Cook spaghetti according to package instructions.',
            'In a bowl, mix eggs and grated Parmesan cheese.',
            'Combine drained spaghetti with egg mixture and cooked pancetta.',
            'Serve with freshly cracked black pepper.',
        ],
        cookingTime: 20,
        difficulty: 'Easy',
        servings: 2,
        nutrition: {
            calories: 600,
            protein: 25,
            fat: 30,
            carbs: 60,
        },
        author: '603d4e87c09f5a001f8e9d0a', // Replace with actual ObjectId from your User collection
    },
    {
        name: 'Chicken Tikka Masala',
        description: 'A flavorful dish with marinated chicken cooked in a spiced tomato sauce.',
        category: '603d4e87c09f5a001f8e9d0b', // Replace with actual ObjectId from your Category collection
        ingredients: [
            { name: 'Chicken', quantity: '300g' },
            { name: 'Yogurt', quantity: '100g' },
            { name: 'Tomato sauce', quantity: '200g' },
            { name: 'Spices', quantity: 'to taste' },
            { name: 'Rice', quantity: '1 cup' },
        ],
        instructions: [
            'Marinate chicken in yogurt and spices for at least 30 minutes.',
            'Cook marinated chicken in a pan until golden brown.',
            'Add tomato sauce and simmer for 15 minutes.',
            'Serve with steamed rice.',
        ],
        cookingTime: 40,
        difficulty: 'Medium',
        servings: 4,
        nutrition: {
            calories: 500,
            protein: 40,
            fat: 20,
            carbs: 45,
        },
        author: '603d4e87c09f5a001f8e9d0a', // Replace with actual ObjectId from your User collection
    },
];

// Function to clear existing data
const destroyData = async () => {
    try {
        await User.deleteMany();
        await Recipe.deleteMany();
        console.log('Existing data destroyed');
    } catch (error) {
        console.error('Error destroying data:', error.message);
    }
};

// Function to import data
const importData = async () => {
    try {
        const createdUsers = await User.insertMany(users);
        const createdRecipes = await Recipe.insertMany(recipes);

        console.log('Data imported successfully:');
        console.log(`Users: ${createdUsers.length}, Recipes: ${createdRecipes.length}`);
    } catch (error) {
        console.error('Error importing data:', error.message);
    }
};

// Main function to run the seeder
const seedDatabase = async (action) => {
    try {
        await connectDB(); // Connect to the database
        
        if (action === 'destroy') {
            await destroyData(); // Destroy existing data
        } else if (action === 'import') {
            await destroyData(); // Optionally clear existing data before importing
            await importData(); // Import new data
        } else {
            console.error('Invalid action specified. Use "import" or "destroy".');
        }
    } catch (error) {
        console.error('Error during seeding process:', error.message);
    } finally {
        // Close the database connection
        mongoose.connection.close();
    }
};

// Get the action from the command line arguments
const action = process.argv[2]; // Example: "node seeder.js import" or "node seeder.js destroy"

// Run the seeding function
seedDatabase(action);
