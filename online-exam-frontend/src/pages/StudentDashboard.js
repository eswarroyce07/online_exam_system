import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getExams, getSubmissions } from '../utils/storage';
import '../styles/Dashboard.css';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [exams, setExams] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/student-login');
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

  const hasSubmitted = (examId) => submissions.some(s => (s.examId?.id || s.examId) === examId);
  const getResult = (examId) => submissions.find(s => (s.examId?.id || s.examId) === examId);

  if (loading) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container">
      <h1>Student Dashboard</h1>
      <div className="dashboard-stats">
        <div className="stat-card"><h3>{exams.length}</h3><p>Available Exams</p></div>
        <div className="stat-card"><h3>{submissions.length}</h3><p>Completed Exams</p></div>
        <div className="stat-card"><h3>{submissions.filter(s => s.evaluated).length}</h3><p>Results Published</p></div>
      </div>

      <h2>Available Exams</h2>
      <div className="exam-list">
        {exams.length === 0 ? <p>No exams available</p> : exams.map(exam => {
          const submitted = hasSubmitted(exam.id);
          const result = getResult(exam.id);
          return (
            <div key={exam.id} className="card exam-card">
              <h3>{exam.title}</h3>
              <p>{exam.description}</p>
              <div className="exam-info">
                <span>Duration: {exam.duration} minutes</span>
                <span>Questions: {exam.questions.length}</span>
              </div>
              {submitted ? (
                result?.evaluated ? (
                  <div className="result-info">
                    <p className="success">Score: {result.totalMarks}/{result.maxMarks}</p>
                    <button onClick={() => navigate(`/view-result/${exam.id}`)} className="btn btn-primary">
                      View Result
                    </button>
                  </div>
                ) : (
                  <p className="warning">Submitted - Awaiting Evaluation</p>
                )
              ) : (
                <button onClick={() => navigate(`/take-exam/${exam.id}`)} className="btn btn-primary">
                  Start Exam
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentDashboard;
