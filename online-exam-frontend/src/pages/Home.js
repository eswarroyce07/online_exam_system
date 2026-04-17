import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();

  const roles = [
    { icon: '🎓', title: 'Student', desc: 'Take exams and view your results', path: '/student-login' },
    { icon: '👨‍🏫', title: 'Staff', desc: 'Create and evaluate exams', path: '/staff-login' },
    { icon: '🛡️', title: 'Admin', desc: 'Manage users, exams and system', path: '/admin-login' }
  ];

  return (
    <div className="home-container">
      <div className="home-hero">
        <span className="home-badge">🚀 Online Exam Platform</span>
        <h1>Smart Exam Management System</h1>
        <p>A complete platform for creating, taking and evaluating exams — all in one place.</p>
      </div>
      <div className="role-cards">
        {roles.map(role => (
          <div key={role.title} className="role-card" onClick={() => navigate(role.path)}>
            <span className="role-icon">{role.icon}</span>
            <h2>{role.title}</h2>
            <p>{role.desc}</p>
            <span className="role-card-arrow">→</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
