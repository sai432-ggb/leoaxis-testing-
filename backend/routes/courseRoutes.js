const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseById,
  enrollInCourse,
  getCourseTopics,
  getTopicQuiz,
  submitQuiz,
  getMyEnrolledCourses
} = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourseById);

// Protected routes
router.post('/:id/enroll', protect, enrollInCourse);
router.get('/my-courses/enrolled', protect, getMyEnrolledCourses);
router.get('/:id/topics', protect, getCourseTopics);
router.get('/:courseId/topics/:topicId/quiz', protect, getTopicQuiz);
router.post('/:courseId/topics/:topicId/quiz/submit', protect, submitQuiz);

module.exports = router;
