const mongoose = require('mongoose');

const quizQuestionSchema = mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  },
  explanation: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  points: {
    type: Number,
    default: 10
  },
  tags: [String]
});

const topicSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  
  // Content Types
  content: {
    videoUrl: String,
    articleText: String,
    codeExamples: [{
      language: String,
      code: String,
      output: String
    }],
    resources: [{
      title: String,
      url: String,
      type: {
        type: String,
        enum: ['video', 'article', 'documentation', 'practice']
      }
    }]
  },
  
  // Assessment
  quiz: {
    questions: [quizQuestionSchema],
    passingScore: {
      type: Number,
      default: 70
    },
    timeLimit: {
      type: Number, // in minutes
      default: 30
    }
  },
  
  // Practice Problems
  practiceProblems: [{
    title: String,
    description: String,
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard']
    },
    starterCode: String,
    testCases: [{
      input: String,
      expectedOutput: String
    }],
    hints: [String],
    solution: String
  }],
  
  isLocked: {
    type: Boolean,
    default: false
  },
  prerequisite: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic'
  }
});

const courseSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    longDescription: {
      type: String
    },
    
    // Categorization
    category: {
      type: String,
      required: true,
      enum: ['Programming', 'DSA', 'Web Development', 'Mobile Development', 'AI/ML', 'DevOps', 'Database']
    },
    programmingLanguage: {
      type: String,
      required: true,
      enum: ['C', 'C++', 'Python', 'JavaScript', 'Java', 'Go', 'Rust', 'SQL']
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner'
    },
    
    // Visual Assets
    thumbnail: {
      type: String,
      default: 'https://placehold.co/600x400/0284c7/ffffff?text=Leoaxis+Course'
    },
    banner: String,
    
    // Course Content
    topics: [topicSchema],
    
    // Meta Information
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    duration: {
      type: Number, // total duration in hours
      required: true
    },
    
    // Learning Outcomes
    learningOutcomes: [String],
    prerequisites: [String],
    
    // Engagement Metrics
    enrolledCount: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviews: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    
    // Status
    isPublished: {
      type: Boolean,
      default: false
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    
    // Pricing (for future monetization)
    pricing: {
      isFree: {
        type: Boolean,
        default: true
      },
      price: {
        type: Number,
        default: 0
      },
      currency: {
        type: String,
        default: 'INR'
      }
    },
    
    // SEO
    tags: [String],
    seoKeywords: [String]
  },
  {
    timestamps: true
  }
);

// Index for search optimization
courseSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Virtual for total quiz questions
courseSchema.virtual('totalQuestions').get(function() {
  return this.topics.reduce((total, topic) => {
    return total + (topic.quiz.questions ? topic.quiz.questions.length : 0);
  }, 0);
});

// Method to get course progress for a user
courseSchema.methods.getUserProgress = function(userId) {
  // This would be implemented in the controller
  // Returns percentage of topics completed
};

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
