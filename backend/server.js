const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config(); // Load environment variables

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- 1. MONGODB CONNECTION (Auto-Initializes DB) ---
// Docker will create a database named 'leoaxis' automatically if it doesn't exist.
const connectDB = async () => {
  try {
    // This URL connects to the Docker container named 'mongo'
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo:27017/leoaxis');
    console.log('✅ MongoDB Connected Successfully');
  } catch (err) {
    console.log('❌ MongoDB Error (Waiting for container...):', err.message);
    setTimeout(connectDB, 5000); // Retry after 5 seconds
  }
};
connectDB();

// --- 2. DEFINE DATA MODELS (Schemas) ---
const UserSchema = new mongoose.Schema({
    name: String,
    skills: [String],
    quizHistory: [{ topic: String, score: Number, date: Date }]
});
const User = mongoose.model('User', UserSchema);

// --- 3. REAL AI INTEGRATION (Gemini) ---
// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/ai/analyze', async (req, res) => {
  const { topic, score, wrongAnswers } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // The Prompt we send to the AI
    const prompt = `
      Act as a Senior Technical Mentor at Leoaxis Technologies.
      A student just took a quiz on "${topic}" and scored ${score}%.
      They struggled with these specific concepts: ${wrongAnswers.join(", ")}.
      
      Provide a JSON response with:
      1. A short encouraging feedback message.
      2. A specific "Next Step" recommendation (e.g., a project or specific topic to study).
      3. A list of 3 resource titles they should look up.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ ai_feedback: text });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ ai_feedback: "AI is currently offline. Focus on reviewing your loop syntax!" });
  }
});

app.get('/', (req, res) => res.send('Leoaxis API is Live'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));