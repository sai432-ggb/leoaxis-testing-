const asyncHandler = require('express-async-handler');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require('../models/userModel');
const Course = require('../models/courseModel');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Analyze quiz performance and provide AI recommendations
// @route   POST /api/ai/analyze-quiz
// @access  Private
const analyzeQuizPerformance = asyncHandler(async (req, res) => {
  const { courseId, topicId, score, totalQuestions, correctAnswers, wrongAnswers, timeSpent } = req.body;

  if (!courseId || !topicId || score === undefined) {
    res.status(400);
    throw new Error('Please provide courseId, topicId, and score');
  }

  const user = await User.findById(req.user._id);
  const course = await Course.findById(courseId);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  // Find the topic
  const topic = course.topics.id(topicId);
  if (!topic) {
    res.status(404);
    throw new Error('Topic not found');
  }

  // Determine difficulty based on score
  let difficulty = 'Medium';
  if (score >= 80) difficulty = 'Easy';
  else if (score < 50) difficulty = 'Hard';

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create detailed prompt for AI
    const prompt = `
You are an expert technical mentor at Leoaxis Technologies, specializing in software engineering education.

STUDENT CONTEXT:
- Current Level: ${user.skills.overallLevel}
- Course: ${course.name} (${course.level})
- Topic Completed: ${topic.title}
- Quiz Performance: ${score}% (${correctAnswers}/${totalQuestions} correct)
- Time Spent: ${Math.round(timeSpent / 60)} minutes
- Struggling Areas: ${wrongAnswers.join(', ')}

TASK:
Provide a personalized learning recommendation in JSON format with these fields:

{
  "performance_summary": "2-3 sentence assessment of their performance",
  "strengths": ["list 2-3 concepts they understood well"],
  "weak_areas": ["list 2-3 specific concepts to review"],
  "next_steps": {
    "immediate": "What to do right now (1 specific action)",
    "short_term": "What to focus on this week (1-2 recommendations)",
    "long_term": "Career-aligned goal (1 recommendation)"
  },
  "recommended_resources": [
    {
      "title": "Resource name",
      "type": "video/article/practice",
      "focus": "What it helps with"
    }
  ],
  "motivational_message": "Encouraging 1-2 line message",
  "industry_readiness": "Percentage (0-100) of how industry-ready they are in this topic"
}

IMPORTANT: 
- Be specific and actionable
- Reference real-world applications
- Match tone to their level (beginner = encouraging, advanced = challenging)
- Focus on Digital India and Tier 2/3 city career opportunities
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let aiText = response.text();

    // Clean up response (remove markdown code blocks if present)
    aiText = aiText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    let aiRecommendation;
    try {
      aiRecommendation = JSON.parse(aiText);
    } catch (parseError) {
      // Fallback if AI doesn't return valid JSON
      aiRecommendation = {
        performance_summary: aiText.substring(0, 200),
        strengths: ["Quiz completed successfully"],
        weak_areas: wrongAnswers,
        next_steps: {
          immediate: "Review the topics you missed",
          short_term: "Practice similar problems",
          long_term: "Build a project using this knowledge"
        },
        recommended_resources: [],
        motivational_message: "Keep learning and improving!",
        industry_readiness: score
      };
    }

    // Save quiz result to user history
    user.quizHistory.push({
      quizId: topicId,
      topic: topic.title,
      score,
      totalQuestions,
      correctAnswers,
      timeSpent,
      difficulty,
      weakAreas: wrongAnswers,
      aiRecommendation: JSON.stringify(aiRecommendation)
    });

    // Update user points
    const pointsEarned = correctAnswers * 10 + (score >= 80 ? 50 : 0); // Bonus for high scores
    user.points += pointsEarned;

    // Update course progress
    const enrollment = user.enrolledCourses.find(
      ec => ec.courseId.toString() === courseId
    );
    
    if (enrollment) {
      if (!enrollment.completedTopics.includes(topicId)) {
        enrollment.completedTopics.push(topicId);
        
        // Calculate overall course progress
        const totalTopics = course.topics.length;
        const completedTopicsCount = enrollment.completedTopics.length;
        enrollment.progress = Math.round((completedTopicsCount / totalTopics) * 100);
      }
    }

    await user.save();

    res.json({
      success: true,
      data: {
        aiRecommendation,
        pointsEarned,
        newTotalPoints: user.points,
        courseProgress: enrollment ? enrollment.progress : 0
      }
    });

  } catch (error) {
    console.error('AI Analysis Error:', error);
    
    // Fallback response if AI fails
    res.json({
      success: true,
      data: {
        aiRecommendation: {
          performance_summary: `You scored ${score}% on ${topic.title}. ${score >= 70 ? 'Great job!' : 'Keep practicing!'}`,
          strengths: score >= 70 ? ["Understanding core concepts"] : [],
          weak_areas: wrongAnswers,
          next_steps: {
            immediate: "Review incorrect answers",
            short_term: "Practice more problems on weak areas",
            long_term: "Apply concepts in real projects"
          },
          recommended_resources: [],
          motivational_message: "Every quiz is a learning opportunity. Keep going!",
          industry_readiness: score
        },
        pointsEarned: 0,
        newTotalPoints: user.points,
        courseProgress: 0
      }
    });
  }
});

// @desc    Get personalized learning path
// @route   GET /api/ai/learning-path
// @access  Private
const getPersonalizedLearningPath = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('enrolledCourses.courseId');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Analyze user's learning history
    const recentQuizzes = user.quizHistory.slice(-10);
    const averageScore = recentQuizzes.length > 0
      ? recentQuizzes.reduce((sum, q) => sum + q.score, 0) / recentQuizzes.length
      : 0;

    const weakTopics = recentQuizzes
      .filter(q => q.score < 70)
      .flatMap(q => q.weakAreas)
      .reduce((acc, topic) => {
        acc[topic] = (acc[topic] || 0) + 1;
        return acc;
      }, {});

    const topWeakAreas = Object.entries(weakTopics)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([topic]) => topic);

    const prompt = `
As a career advisor at Leoaxis Technologies, create a personalized 30-day learning roadmap.

STUDENT PROFILE:
- Current Level: ${user.skills.overallLevel}
- Average Quiz Score: ${Math.round(averageScore)}%
- Enrolled Courses: ${user.enrolledCourses.length}
- Top Weak Areas: ${topWeakAreas.join(', ') || 'None identified yet'}
- Total Study Time: ${user.totalStudyTime} minutes
- Current Streak: ${user.streakCount} days

Generate a JSON roadmap:
{
  "assessment": "2-3 sentence current skill level assessment",
  "weekly_goals": [
    {
      "week": 1,
      "focus": "Main learning objective",
      "daily_tasks": ["task 1", "task 2", "task 3"],
      "milestone": "What should be achieved"
    }
  ],
  "recommended_courses": ["course name 1", "course name 2"],
  "career_alignment": "How this path leads to job readiness",
  "motivation": "Personal encouragement"
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let aiText = response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const learningPath = JSON.parse(aiText);

    res.json({
      success: true,
      data: learningPath
    });

  } catch (error) {
    console.error('Learning Path Error:', error);
    res.status(500);
    throw new Error('Unable to generate learning path. Please try again.');
  }
});

// @desc    Get AI-powered doubt resolution
// @route   POST /api/ai/doubt
// @access  Private
const resolveDoubt = asyncHandler(async (req, res) => {
  const { question, context } = req.body;

  if (!question) {
    res.status(400);
    throw new Error('Please provide a question');
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
You are a patient and knowledgeable programming tutor at Leoaxis Technologies.

STUDENT QUESTION: ${question}
CONTEXT: ${context || 'General programming query'}

Provide a clear, educational response that:
1. Directly answers the question
2. Explains the concept in simple terms
3. Provides a code example if relevant
4. Suggests related concepts to explore

Keep it concise but thorough. Use Indian English and relate to real-world examples familiar to Indian students.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text();

    res.json({
      success: true,
      data: {
        question,
        answer,
        timestamp: new Date()
      }
    });

  } catch (error) {
    console.error('Doubt Resolution Error:', error);
    res.status(500);
    throw new Error('Unable to process your question. Please try again.');
  }
});

module.exports = {
  analyzeQuizPerformance,
  getPersonalizedLearningPath,
  resolveDoubt
};
