import React from 'react';

const ProjectCard = ({ title, level, description, stack, levelColor }) => {
  return (
    <div className="project-card">
      <div className="card-header">
        <span className={`badge ${levelColor}`}>{level}</span>
        <div className="icons">
          <i className="github-icon"></i> {/* Placeholder for icon */}
          <i className="link-icon"></i>
        </div>
      </div>
      
      <h3>{title}</h3>
      <p className="project-desc">{description}</p>
      
      <div className="tech-stack-container">
        <h4>Tech Stack</h4>
        <div className="stack-pills">
          {stack.map((tech, index) => (
            <span key={index} className="stack-pill">{tech}</span>
          ))}
        </div>
      </div>

      <button className="btn-tutorial">View Tutorial</button>
    </div>
  );
};

export default ProjectCard;