const asyncHandler = require('express-async-handler');
const Course = require('../models/courseModel');
const User = require('../models/userModel');

// @desc    Get all published courses
// @route   GET /api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
  const { category, level, language, search } = req.query;

  let query = { isPublished: true };

  // Apply filters
  if (category) query.category = category;
  if (level) query.level = level;
  if (language) query.language = language;
  
  // Search functionality
  if (search) {
    query.$text = { $search: search };
  }

  const courses = await Course.find(query)
    .select('-topics.quiz.questions.correctAnswer -topics.practiceProblems.solution')
    .populate('instructor', 'name avatar')
    .sort({ isFeatured: -1, createdAt: -1 });

  res.json({
    success: true,
    count: courses.length,
    data: courses
  });
});

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate('instructor', 'name avatar email')
    .select('-topics.quiz.questions.correctAnswer -topics.practiceProblems.solution');

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (!course.isPublished) {
    res.status(403);
    throw new Error('This course is not yet published');
  }

  res.json({
    success: true,
    data: course
  });
});

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private
const enrollInCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (!course.isPublished) {
    res.status(403);
    throw new Error('This course is not available for enrollment');
  }

  const user = await User.findById(req.user._id);

  // Check if already enrolled
  const alreadyEnrolled = user.enrolledCourses.some(
    ec => ec.courseId.toString() === course._id.toString()
  );

  if (alreadyEnrolled) {
    res.status(400);
    throw new Error('You are already enrolled in this course');
  }

  // Add enrollment
  user.enrolledCourses.push({
    courseId: course._id,
    enrolledAt: new Date(),
    progress: 0,
    completedTopics: []
  });

  // Update course enrollment count
  course.enrolledCount += 1;

  await Promise.all([user.save(), course.save()]);

  res.json({
    success: true,
    message: 'Successfully enrolled in course',
    data: {
      courseId: course._id,
      courseName: course.name,
      enrolledAt: new Date()
    }
  });
});

// @desc    Get course content (topics)
// @route   GET /api/courses/:id/topics
// @access  Private (must be enrolled)
const getCourseTopics = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  const user = await User.findById(req.user._id);

  // Check enrollment
  const enrollment = user.enrolledCourses.find(
    ec => ec.courseId.toString() === course._id.toString()
  );

  if (!enrollment) {
    res.status(403);
    throw new Error('You must enroll in this course first');
  }

  // Return topics without answers
  const topics = course.topics.map(topic => ({
    _id: topic._id,
    title: topic.title,
    description: topic.description,
    order: topic.order,
    duration: topic.duration,
    content: topic.content,
    isLocked: topic.isLocked,
    isCompleted: enrollment.completedTopics.includes(topic._id),
    quizQuestionCount: topic.quiz.questions.length,
    practiceProblemsCount: topic.practiceProblems.length
  }));

  res.json({
    success: true,
    data: {
      courseId: course._id,
      courseName: course.name,
      progress: enrollment.progress,
      topics
    }
  });
});

// @desc    Get quiz for a topic
// @route   GET /api/courses/:courseId/topics/:topicId/quiz
// @access  Private
const getTopicQuiz = asyncHandler(async (req, res) => {
  const { courseId, topicId } = req.params;

  const course = await Course.findById(courseId);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  const topic = course.topics.id(topicId);

  if (!topic) {
    res.status(404);
    throw new Error('Topic not found');
  }

  // Return quiz without correct answers
  const quiz = {
    topicTitle: topic.title,
    passingScore: topic.quiz.passingScore,
    timeLimit: topic.quiz.timeLimit,
    questions: topic.quiz.questions.map(q => ({
      _id: q._id,
      question: q.question,
      options: q.options,
      difficulty: q.difficulty,
      points: q.points
    }))
  };

  res.json({
    success: true,
    data: quiz
  });
});

// @desc    Submit quiz answers
// @route   POST /api/courses/:courseId/topics/:topicId/quiz/submit
// @access  Private
const submitQuiz = asyncHandler(async (req, res) => {
  const { courseId, topicId } = req.params;
  const { answers, timeSpent } = req.body; // answers = [{ questionId, selectedOption }]

  if (!answers || !Array.isArray(answers)) {
    res.status(400);
    throw new Error('Please provide quiz answers');
  }

  const course = await Course.findById(courseId);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  const topic = course.topics.id(topicId);

  if (!topic) {
    res.status(404);
    throw new Error('Topic not found');
  }

  // Grade the quiz
  let correctAnswers = 0;
  const wrongAnswers = [];
  const results = [];

  answers.forEach(answer => {
    const question = topic.quiz.questions.id(answer.questionId);
    
    if (question) {
      const isCorrect = question.correctAnswer === answer.selectedOption;
      
      if (isCorrect) {
        correctAnswers++;
      } else {
        wrongAnswers.push(question.question);
      }

      results.push({
        questionId: question._id,
        question: question.question,
        selectedOption: answer.selectedOption,
        correctOption: question.correctAnswer,
        isCorrect,
        explanation: question.explanation
      });
    }
  });

  const totalQuestions = topic.quiz.questions.length;
  const score = Math.round((correctAnswers / totalQuestions) * 100);
  const passed = score >= topic.quiz.passingScore;

  res.json({
    success: true,
    data: {
      score,
      correctAnswers,
      totalQuestions,
      passed,
      passingScore: topic.quiz.passingScore,
      wrongAnswers,
      timeSpent,
      results
    }
  });
});

// @desc    Get my enrolled courses
// @route   GET /api/courses/my-courses
// @access  Private
const getMyEnrolledCourses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate({
      path: 'enrolledCourses.courseId',
      select: 'name description thumbnail category level duration'
    });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const enrolledCourses = user.enrolledCourses.map(ec => ({
    _id: ec.courseId._id,
    name: ec.courseId.name,
    description: ec.courseId.description,
    thumbnail: ec.courseId.thumbnail,
    category: ec.courseId.category,
    level: ec.courseId.level,
    duration: ec.courseId.duration,
    enrolledAt: ec.enrolledAt,
    progress: ec.progress,
    completedTopicsCount: ec.completedTopics.length
  }));

  res.json({
    success: true,
    count: enrolledCourses.length,
    data: enrolledCourses
  });
});

module.exports = {
  getCourses,
  getCourseById,
  enrollInCourse,
  getCourseTopics,
  getTopicQuiz,
  submitQuiz,
  getMyEnrolledCourses
};
