const express = require('express');
const { createEvent, getEvents, getEventById } = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

const router = express.Router();

router.post('/', protect, authorize('club', 'tnp', 'admin'), upload.single('image'), createEvent);
router.get('/', getEvents); // Public or Protected? Let's make it public for now or protect? "Student can visit" -> Public view is better for landing.
router.get('/:id', getEventById);

module.exports = router;
