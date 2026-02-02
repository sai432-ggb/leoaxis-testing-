const express = require('express');
const router = express.Router();
const { authUser, registerUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/login', authUser);

// Example of a protected route (Use this structure for your Quiz/AI routes later)
// router.route('/profile').get(protect, getUserProfile); 

module.exports = router;