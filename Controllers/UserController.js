import User from '../models/userModel.js'; // Import user model
import Recipe from '../models/recipesModel.js'; // Import recipe model
import { asyncHandler } from '../middleware/index.js'; // Import async handler middleware
import { handleError } from '../Middleware/HandleError.js';
import generateToken from '../utils/generateToken.js'; // Import token generator utility


// @desc   Fetch all users
// @route  GET /api/users
// @access Admin
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.status(200).json(users);
});

// @desc   Fetch a single user by ID
// @route  GET /api/users/:id
// @access Admin/User
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc   Register a new user
// @route  POST /api/users/register
// @access Public
const createUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Ensure password is provided
    if (!password) {
        return handleError(res, 400, 'Password is required');
    }

    // Create the user
    const user = await User.create({
        name,
        email,
        password,  // Assuming password hashing is handled in the model
    });

    if (user) {
        // Generate token and send it as a response
        const token = generateToken(user._id, res);
        res.status(201).json({
            success: true,
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,  // Token included in response
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc   Handle user login & get token
// @route  POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        // Generate token and send it as a response
        const token = generateToken(user._id, res);

        // Return user details along with token
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.role === 'admin',
            profileImage: user.profileImage || null,
            token,  // Include token in response
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});



// @desc   Update user details
// @route  PUT /api/users/:id
// @access Admin/User
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        // Update password if provided
        if (req.body.password) {
            user.password = await bcrypt.hash(req.body.password, 10); // Hash the new password
        }

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc   Delete a user
// @route  DELETE /api/users/:id
// @access Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.remove();
        res.status(200).json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc   Add a recipe to a user's favorites
// @route  POST /api/users/:userId/favorites/:recipeId
// @access User
const addFavoriteRecipe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userId);
    const recipe = await Recipe.findById(req.params.recipeId);

    if (user && recipe) {
        if (!user.favorites.includes(recipe._id)) {
            user.favorites.push(recipe._id);
            await user.save();
            res.status(200).json({ message: 'Recipe added to favorites' });
        } else {
            res.status(400).json({ message: 'Recipe is already in favorites' });
        }
    } else {
        res.status(404).json({ message: 'User or Recipe not found' });
    }
});

// @desc   Remove a recipe from a user's favorites
// @route  DELETE /api/users/:userId/favorites/:recipeId
// @access User
const removeFavoriteRecipe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userId);
    const recipe = await Recipe.findById(req.params.recipeId);

    if (user && recipe) {
        if (user.favorites.includes(recipe._id)) {
            user.favorites = user.favorites.filter(
                (favoriteId) => favoriteId.toString() !== recipe._id.toString()
            );
            await user.save();
            res.status(200).json({ message: 'Recipe removed from favorites' });
        } else {
            res.status(400).json({ message: 'Recipe not in favorites' });
        }
    } else {
        res.status(404).json({ message: 'User or Recipe not found' });
    }
});

export default {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    loginUser,
    addFavoriteRecipe,
    removeFavoriteRecipe,
};
