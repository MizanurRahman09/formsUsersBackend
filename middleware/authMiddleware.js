// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const db = require('../models');

const User = db.users;

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from the authorization header

    if (!token) return res.sendStatus(401); // No token, return 401 (Unauthorized)

    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) return res.sendStatus(403); // Invalid token, return 403 (Forbidden)

        try {
            // Check if the user exists and is an admin
            const user = await User.findByPk(decodedToken.id);
            if (!user) return res.status(404).send({ message: 'User not found' });

            req.user = user; // Attach user data to the request

            next(); // Proceed to the next middleware/route handler
        } catch (error) {
            res.status(500).send({ message: 'Server error', error: error.message });
        }
    });
};

module.exports = { authenticateToken };
