import React, { useState } from 'react';
import './App.css'; 

function App() {
  const [aiMessage, setAiMessage] = useState('');

  // Function to call the Backend AI
  const getAIRecommendation = async () => {
    const response = await fetch('http://localhost:5000/api/ai/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userSkills: ['React'], quizScore: 90 }) 
    });
    const data = await response.json();
    setAiMessage(data.ai_suggestion);
  };

  return (
    <div className="App">
      {/* Navbar (From Screenshot 1) */}
      <nav className="navbar">
        <h2>Leoaxis Technologies</h2>
        <div className="links">
          <span>Topics</span> <span>Resources</span> <span>Practice</span>
          <button className="btn-signin">Sign In</button>
        </div>
      </nav>

      {/* Dashboard Grid */}
      <div className="container">
        <header className="hero">
          <h1>Welcome back, Sai!</h1>
          <button onClick={getAIRecommendation} className="btn-ai">
            Get AI Career Advice
          </button>
          {aiMessage && <div className="ai-box">🤖 AI Says: {aiMessage}</div>}
        </header>

        {/* Practice Section (From Screenshot 2) */}
        <section className="practice-section">
          <h3>Daily Challenges</h3>
          <div className="problem-card">
            <span className="badge easy">Easy</span>
            <h4>Two Sum</h4>
            <button className="btn-solve">Solve</button>
          </div>
          <div className="problem-card">
            <span className="badge medium">Medium</span>
            <h4>Binary Tree Traversal</h4>
            <button className="btn-solve">Solve</button>
          </div>
        </section>

        {/* Project Section (From Screenshot 3) */}
        <section className="project-section">
          <h3>Project Showcase</h3>
          <div className="project-grid">
            <div className="project-card">
              <span className="badge adv">Advanced</span>
              <h4>E-Commerce Platform</h4>
              <p>Full-stack app with Stripe & MongoDB.</p>
              <div className="tech-stack">React • Node • Stripe</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;