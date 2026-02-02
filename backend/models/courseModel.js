const mongoose = require('mongoose');

const quizSchema = mongoose.Schema({
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true }, // Index of correct option
});

const topicSchema = mongoose.Schema({
    title: { type: String, required: true }, // e.g., "Pointers in C"
    content: { type: String, required: true }, // Video URL or Text
    quizzes: [quizSchema] 
});

const courseSchema = mongoose.Schema({
    name: { type: String, required: true }, // e.g., "Python Masterclass"
    description: { type: String, required: true },
    image: { type: String },
    topics: [topicSchema],
    level: { type: String, default: 'Beginner' } // Beginner, Intermediate, Advanced
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;