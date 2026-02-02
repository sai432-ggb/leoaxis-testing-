import React, { useState } from 'react';

const QuizModal = ({ onClose, problemTitle }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [aiFeedback, setAiFeedback] = useState("AI is analyzing your answers...");
  const [wrongAnswers, setWrongAnswers] = useState([]);

  // Hardcoded questions for the demo
  const questions = [
    {
      question: "What is the time complexity of a binary search?",
      options: ["O(n)", "O(log n)", "O(n^2)", "O(1)"],
      answer: "O(log n)"
    },
    {
      question: "Which data structure uses LIFO (Last In First Out)?",
      options: ["Queue", "Array", "Stack", "Linked List"],
      answer: "Stack"
    },
    {
      question: "In React, which hook is used for side effects?",
      options: ["useState", "useEffect", "useReducer", "useRef"],
      answer: "useEffect"
    }
  ];

  const handleAnswer = (option) => {
    const isCorrect = option === questions[currentQuestion].answer;
    if (isCorrect) {
      setScore(score + 1);
    } else {
      setWrongAnswers([...wrongAnswers, questions[currentQuestion].question]);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowResult(true);
      callAI(score + (isCorrect ? 1 : 0), [...wrongAnswers, !isCorrect ? questions[currentQuestion].question : null]);
    }
  };

  // --- THE AI CONNECTION ---
  const callAI = async (finalScore, mistakes) => {
    try {
      const percentage = (finalScore / questions.length) * 100;
      
      const response = await fetch('http://localhost:5000/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: problemTitle,
          score: percentage,
          wrongAnswers: mistakes.filter(Boolean)
        })
      });

      const data = await response.json();
      setAiFeedback(data.ai_feedback); // Display what Gemini says!
    } catch (error) {
      setAiFeedback("Error connecting to Leoaxis AI. Check your backend.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>X</button>
        
        {!showResult ? (
          <>
            <h3>{problemTitle}</h3>
            <div className="question-box">
              <p>Question {currentQuestion + 1} of {questions.length}</p>
              <h4>{questions[currentQuestion].question}</h4>
            </div>
            <div className="options-grid">
              {questions[currentQuestion].options.map((opt) => (
                <button key={opt} className="option-btn" onClick={() => handleAnswer(opt)}>
                  {opt}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="result-box">
            <h2>Quiz Complete!</h2>
            <p className="score-text">You scored: {score} / {questions.length}</p>
            
            <div className="ai-feedback-box">
              <h4>🤖 Leoaxis Mentor says:</h4>
              <p>{aiFeedback}</p>
            </div>
            
            <button className="btn-primary" onClick={onClose}>Back to Dashboard</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizModal;