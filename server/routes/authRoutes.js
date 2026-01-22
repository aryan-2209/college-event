const express = require('express');
const { register, login, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

const router = express.Router();

router.post('/register', upload.single('photo'), register);
router.post('/login', login);
router.put('/profile', protect, upload.single('photo'), updateProfile);

module.exports = router;
