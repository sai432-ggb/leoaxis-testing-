const express = require('express');
const router = express.Router();
const {
  analyzeQuizPerformance,
  getPersonalizedLearningPath,
  resolveDoubt
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// All AI routes require authentication
router.post('/analyze-quiz', protect, analyzeQuizPerformance);
router.get('/learning-path', protect, getPersonalizedLearningPath);
router.post('/doubt', protect, resolveDoubt);

module.exports = router;
