const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = db.users;

// Register a new user
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the default admin exists
        const isDefaultAdmin = email === 'mmm@g.com' && password === '123456789';

        const info = {
            username,
            email,
            password: await bcrypt.hash(password, 10), // Hash password
            isAdmin: isDefaultAdmin, // Make default admin user
            isBlocked: false, // Default: users are not blocked
        };

        const user = await User.create(info);

        // Respond without sending the password
        res.status(201).send({
            id: user.id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } catch (error) {
        console.error(error);
        res.status(400).send({ message: 'Error registering user', error: error.message });
    }
};

// Sign in
const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user in the database
        const user = await User.findOne({ where: { email } });
        if (!user) {
            // User not found
            return res.status(404).send({ message: 'User not found' });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({ message: 'Invalid credentials' });
        }

        // Generate JWT token and send response
        const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).send({
            message: 'Sign in successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
                isBlocked: user.isBlocked // Add this to prevent blocked users from logging in
            },
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error signing in', error: error.message });
    }
};

// Promote a user to admin
const promoteToAdmin = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        user.isAdmin = true;
        await user.save();

        res.status(200).send({ message: 'User promoted to admin successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error promoting user', error: error.message });
    }
};

// Toggle block/unblock user
const toggleBlockUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        user.isBlocked = !user.isBlocked;
        await user.save();

        res.status(200).send({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error toggling user block status', error: error.message });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        await user.destroy();

        res.status(200).send({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error deleting user', error: error.message });
    }
};

// Get all users for admin dashboard (exclude password)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'email', 'isAdmin', 'isBlocked'],
        });
        res.status(200).send(users);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error fetching users', error: error.message });
    }
};

module.exports = {
    register,
    getAllUsers,
    signIn,
    promoteToAdmin,
    toggleBlockUser,
    deleteUser,
};
