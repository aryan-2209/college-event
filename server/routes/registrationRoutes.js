const express = require('express');
const { registerForEvent, cancelRegistration, getUserRegistrations, getEventRegistrations } = require('../controllers/registrationController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, registerForEvent);
router.patch('/:registrationId/cancel', protect, cancelRegistration); // Using PATCH for status update
router.get('/my-registrations', protect, getUserRegistrations);
router.get('/event/:eventId', protect, authorize('club', 'tnp', 'admin'), getEventRegistrations);

module.exports = router;
