const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { name, email, password, phone } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password, // Will be hashed by pre-save middleware
    phone,
    avatar: `https://ui-avatars.com/api/?background=0284c7&color=fff&name=${encodeURIComponent(name)}`
  });

  if (user) {
    // Update streak on first login
    user.updateStreak();
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatarUrl,
        token: generateToken(user._id)
      }
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { email, password } = req.body;

  // Find user and include password field
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Check account status
  if (user.accountStatus !== 'active') {
    res.status(403);
    throw new Error('Your account has been suspended. Please contact support.');
  }

  // Verify password
  const isPasswordMatch = await user.matchPassword(password);

  if (!isPasswordMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Update streak
  user.updateStreak();
  await user.save();

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatarUrl,
      streakCount: user.streakCount,
      points: user.points,
      enrolledCourses: user.enrolledCourses.length,
      token: generateToken(user._id)
    }
  });
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('enrolledCourses.courseId', 'name thumbnail category level')
    .select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    success: true,
    data: {
      ...user.toObject(),
      avatar: user.avatarUrl
    }
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Update allowed fields only
  const allowedUpdates = ['name', 'phone', 'preferences'];
  const updates = Object.keys(req.body);
  
  updates.forEach(update => {
    if (allowedUpdates.includes(update)) {
      if (update === 'preferences') {
        // Merge preferences
        user.preferences = { ...user.preferences, ...req.body.preferences };
      } else {
        user[update] = req.body[update];
      }
    }
  });

  await user.save();

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      preferences: user.preferences
    }
  });
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error('Please provide both current and new password');
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error('New password must be at least 6 characters');
  }

  const user = await User.findById(req.user._id).select('+password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Verify current password
  const isMatch = await user.matchPassword(currentPassword);

  if (!isMatch) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  // Update password (will be hashed by pre-save middleware)
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});

// @desc    Get user statistics
// @route   GET /api/auth/stats
// @access  Private
const getUserStats = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Calculate statistics
  const totalQuizzes = user.quizHistory.length;
  const averageScore = totalQuizzes > 0
    ? user.quizHistory.reduce((sum, quiz) => sum + quiz.score, 0) / totalQuizzes
    : 0;

  const completedCourses = user.enrolledCourses.filter(
    course => course.progress === 100
  ).length;

  const recentActivity = user.quizHistory
    .sort((a, b) => b.completedAt - a.completedAt)
    .slice(0, 5);

  res.json({
    success: true,
    data: {
      overview: {
        totalQuizzes,
        averageScore: Math.round(averageScore),
        completedCourses,
        enrolledCourses: user.enrolledCourses.length,
        streakCount: user.streakCount,
        totalPoints: user.points,
        totalStudyTime: user.totalStudyTime,
        badges: user.badges.length
      },
      skills: user.skills,
      recentActivity,
      badges: user.badges
    }
  });
});

module.exports = {
  registerUser,
  loginUser,
  getMyProfile,
  updateProfile,
  changePassword,
  getUserStats
};
