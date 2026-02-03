const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false // Don't return password by default
    },
    phone: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      enum: ['student', 'instructor', 'admin'],
      default: 'student'
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    avatar: {
      type: String,
      default: 'https://ui-avatars.com/api/?background=0284c7&color=fff&name='
    },
    
    // Learning Progress Tracking
    enrolledCourses: [{
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      },
      enrolledAt: {
        type: Date,
        default: Date.now
      },
      progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
      },
      completedTopics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic'
      }]
    }],
    
    // Quiz Performance Tracking
    quizHistory: [{
      quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
      },
      topic: String,
      score: {
        type: Number,
        min: 0,
        max: 100
      },
      totalQuestions: Number,
      correctAnswers: Number,
      timeSpent: Number, // in seconds
      difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard']
      },
      completedAt: {
        type: Date,
        default: Date.now
      },
      weakAreas: [String], // Topics user struggled with
      aiRecommendation: String
    }],
    
    // Skill Assessment
    skills: {
      languages: [{
        name: String,
        proficiency: {
          type: Number,
          min: 0,
          max: 100
        },
        lastAssessed: Date
      }],
      overallLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        default: 'Beginner'
      }
    },
    
    // Activity Tracking
    streakCount: {
      type: Number,
      default: 0
    },
    lastLoginDate: Date,
    totalStudyTime: {
      type: Number,
      default: 0 // in minutes
    },
    
    // Gamification
    points: {
      type: Number,
      default: 0
    },
    badges: [{
      name: String,
      icon: String,
      earnedAt: Date,
      description: String
    }],
    
    // Account Status
    accountStatus: {
      type: String,
      enum: ['active', 'suspended', 'deleted'],
      default: 'active'
    },
    
    // Preferences
    preferences: {
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true }
      },
      learningStyle: {
        type: String,
        enum: ['visual', 'auditory', 'kinesthetic', 'reading'],
        default: 'visual'
      },
      dailyGoal: {
        type: Number,
        default: 30 // minutes per day
      }
    }
  },
  {
    timestamps: true
  }
);

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to check password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to update learning streak
userSchema.methods.updateStreak = function () {
  const today = new Date().setHours(0, 0, 0, 0);
  const lastLogin = this.lastLoginDate ? new Date(this.lastLoginDate).setHours(0, 0, 0, 0) : null;
  
  if (!lastLogin) {
    this.streakCount = 1;
  } else {
    const dayDiff = (today - lastLogin) / (1000 * 60 * 60 * 24);
    
    if (dayDiff === 1) {
      this.streakCount += 1;
    } else if (dayDiff > 1) {
      this.streakCount = 1;
    }
  }
  
  this.lastLoginDate = new Date();
};

// Virtual for avatar URL with name
userSchema.virtual('avatarUrl').get(function() {
  return this.avatar + this.name.split(' ').join('+');
});

const User = mongoose.model('User', userSchema);

module.exports = User;
