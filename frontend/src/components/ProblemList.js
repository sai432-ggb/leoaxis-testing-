import React, { useState } from 'react';
import QuizModal from './QuizModal';

const problems = [
  { id: 1, title: "Two Sum", difficulty: "Easy", tag: "Arrays", color: "green" },
  { id: 2, title: "Binary Tree Level Order Traversal", difficulty: "Medium", tag: "Trees", color: "yellow" },
  { id: 3, title: "Longest Palindromic Substring", difficulty: "Medium", tag: "Strings", color: "yellow" },
  { id: 4, title: "Merge K Sorted Lists", difficulty: "Hard", tag: "Linked Lists", color: "red" },
  { id: 5, title: "Valid Parentheses", difficulty: "Easy", tag: "Stack", color: "green" }
];

const ProblemList = () => {
  const [selectedProblem, setSelectedProblem] = useState(null);

  return (
    <div className="problem-section">
      {/* Stats Header */}
      <div className="stats-container">
        <div className="stat-card">
          <h4>Total Problems</h4>
          <span className="stat-value">150+</span>
          <p>Across all categories</p>
        </div>
        <div className="stat-card">
          <h4>Your Progress</h4>
          <span className="stat-value">23/150</span>
          <p>15% completion rate</p>
        </div>
        <div className="stat-card">
          <h4>Practice Time</h4>
          <span className="stat-value">12.5h</span>
          <p>This month</p>
        </div>
      </div>

      {/* Problem List Items */}
      <div className="problem-list">
        {problems.map((prob) => (
          <div key={prob.id} className="problem-row">
            <div className="problem-info">
              <h3>{prob.title}</h3>
              <div className="badges">
                <span className={`badge ${prob.color}`}>{prob.difficulty}</span>
                <span className="tag-pill">{prob.tag}</span>
              </div>
            </div>
            <button className="btn-solve" onClick={() => setSelectedProblem(prob.title)}>
              Solve
            </button>
          </div>
        ))}
      </div>

      {/* Show Modal if a problem is selected */}
      {selectedProblem && (
        <QuizModal 
          problemTitle={selectedProblem} 
          onClose={() => setSelectedProblem(null)} 
        />
      )}
    </div>
  );
};

export default ProblemList;