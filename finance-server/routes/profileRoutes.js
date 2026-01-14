const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const profileController = require('../controllers/profileController');

// קבלת המשתמש המחובר
router.get('/me', authMiddleware, profileController.getMe);

// עדכון פרופיל
router.put('/update', authMiddleware, profileController.updateProfile);

module.exports = router;

