const userController = require('../controllers/userController');
const router = require('express').Router();
const { authenticateToken } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', userController.register);
router.post('/signin', userController.signIn);

// Admin routes (Protected)
router.get('/alluser', authenticateToken, userController.getAllUsers); // Admin dashboard
router.put('/promote/:id', authenticateToken, userController.promoteToAdmin); // Promote to admin
router.put('/block/:id', authenticateToken, userController.toggleBlockUser); // Block/unblock user
router.delete('/delete/:id', authenticateToken, userController.deleteUser); // Delete user

module.exports = router;

