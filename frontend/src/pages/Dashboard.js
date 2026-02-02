import React from 'react';
import Navbar from '../components/Navbar';
import ProblemList from '../components/ProblemList';
import ProjectCard from '../components/ProjectCard';

const Dashboard = () => {
  // Data for Projects (Matches Screenshot 3)
  const projectData = [
    {
      title: "E-Commerce Platform",
      level: "Advanced",
      levelColor: "red",
      description: "Full-stack e-commerce application with user authentication, product catalog, shopping cart, Stripe...",
      stack: ["React", "Node.js", "Express", "MongoDB", "Stripe"]
    },
    {
      title: "Real-Time Weather Dashboard",
      level: "Beginner",
      levelColor: "green",
      description: "Weather application using OpenWeather API with location search, current weather, 5-day forecast...",
      stack: ["React", "TypeScript", "Tailwind CSS", "API"]
    },
    {
      title: "Task Management System",
      level: "Intermediate",
      levelColor: "yellow",
      description: "Collaborative task tracker with drag-and-drop interface, real-time updates using WebSockets...",
      stack: ["Vue.js", "Firebase", "TypeScript", "Socket.io"]
    }
  ];

  return (
    <div className="dashboard-container">
      <Navbar />
      
      <div className="main-content">
        {/* Hero / Action Buttons */}
        <div className="hero-actions">
          <button className="btn-primary">Explore Resources</button>
          <button className="btn-secondary">Get Started</button>
        </div>

        {/* The 6-Grid Menu (Matches Screenshot 1) */}
        <div className="grid-menu">
            {['Resource Library', 'Practice Problems', 'Project Showcase', 'Interview Prep', 'Job Board', 'Community Driven'].map((item, idx) => (
                <div key={idx} className="grid-card">
                    <div className="icon-box"></div>
                    <h3>{item}</h3>
                    <p>Access notes, labs, and content across various tech topics.</p>
                </div>
            ))}
        </div>

        {/* Section: Practice Problems */}
        <section className="section-container" id="practice">
            <h2>Daily Practice</h2>
            <ProblemList />
        </section>

        {/* Section: Projects */}
        <section className="section-container" id="projects">
            <h2>Project Showcase</h2>
            <div className="projects-grid">
                {projectData.map((project, index) => (
                    <ProjectCard key={index} {...project} />
                ))}
            </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;