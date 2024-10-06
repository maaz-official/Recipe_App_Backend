import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // Import bcrypt for password hashing

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure emails are unique
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Determines if a user is an admin
        default: 'user',
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe', // List of favorited recipes
    }],
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Method to compare plain password with hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save hook to hash the password before saving the user
UserSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified or is new
    if (!this.isModified('password')) {
        return next(); // If password is not modified, skip this hook
    }

    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next(); // Proceed to save the user
});

// Export the User model
const User = mongoose.model('User', UserSchema);

export default User;
