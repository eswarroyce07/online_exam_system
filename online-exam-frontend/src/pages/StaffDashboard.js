import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getExams, getSubmissions } from '../utils/storage';
import '../styles/Dashboard.css';

const StaffDashboard = () => {
  const { user } = useContext(AuthContext);
  const [exams, setExams] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'staff') {
      navigate('/staff-login');
      return;
    }
    const fetchData = async () => {
      const [examsData, subsData] = await Promise.all([getExams(), getSubmissions()]);
      setExams(examsData);
      setSubmissions(subsData);
      setLoading(false);
    };
    fetchData();
  }, [user, navigate]);

  const pendingEvaluations = submissions.filter(s => !s.evaluated).length;

  if (loading) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container">
      <h1>Staff Dashboard</h1>
      <div className="dashboard-stats">
        <div className="stat-card"><h3>{exams.length}</h3><p>Total Exams</p></div>
        <div className="stat-card"><h3>{submissions.length}</h3><p>Total Submissions</p></div>
        <div className="stat-card"><h3>{pendingEvaluations}</h3><p>Pending Evaluations</p></div>
      </div>

      <div className="action-buttons">
        <button onClick={() => navigate('/create-exam')} className="btn btn-primary">
          Create New Exam
        </button>
        <button onClick={() => navigate('/evaluate-exams')} className="btn btn-secondary">
          Evaluate Submissions
        </button>
      </div>

      <h2>Created Exams</h2>
      <div className="exam-list">
        {exams.length === 0 ? <p>No exams created yet</p> : exams.map(exam => {
          const examSubmissions = submissions.filter(s => (s.examId?.id || s.examId) === exam.id);
          return (
            <div key={exam.id} className="card exam-card">
              <h3>{exam.title}</h3>
              <p>{exam.description}</p>
              <div className="exam-info">
                <span>Duration: {exam.duration} minutes</span>
                <span>Questions: {exam.questions.length}</span>
                <span>Submissions: {examSubmissions.length}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StaffDashboard;
