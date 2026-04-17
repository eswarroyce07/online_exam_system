import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getExams, getSubmissions } from '../utils/storage';
import '../styles/ViewResult.css';

const ViewResult = () => {
  const { examId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [submission, setSubmission] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/student-login'); return; }
    const fetchData = async () => {
      const [exams, submissions] = await Promise.all([getExams(), getSubmissions()]);
      const foundExam = exams.find(e => e.id === parseInt(examId));
      const foundSubmission = submissions.find(s =>
        (s.examId?.id || s.examId) === parseInt(examId) && s.evaluated
      );
      if (!foundExam || !foundSubmission) { navigate('/student-dashboard'); return; }
      setExam(foundExam);
      setSubmission(foundSubmission);
    };
    fetchData();
  }, [examId, user, navigate]);

  if (!exam || !submission) return <div>Loading...</div>;

  return (
    <div className="container">
      <div className="result-header">
        <h1>Exam Result</h1>
        <div className="score-card">
          <h2>{submission.totalMarks} / {submission.maxMarks}</h2>
          <p>Percentage: {((submission.totalMarks / submission.maxMarks) * 100).toFixed(2)}%</p>
        </div>
      </div>

      <div className="card">
        <h3>{exam.title}</h3>
        <p>Submitted on: {new Date(submission.createdAt).toLocaleString()}</p>
      </div>

      <h2>Question-wise Results</h2>
      {exam.questions.map((question, idx) => (
        <div key={idx} className="card question-result">
          <h4>Question {idx + 1}</h4>
          <p className="question-text">{question.question}</p>
          <div className="answer-section">
            <p><strong>Your Answer:</strong></p>
            <p className="user-answer">{submission.answers[idx] || 'Not answered'}</p>
          </div>
          {question.type === 'mcq' && (
            <div className="answer-section">
              <p><strong>Correct Answer:</strong></p>
              <p className="correct-answer">{question.correctAnswer}</p>
            </div>
          )}
          <div className="marks-section">
            <span className="marks-obtained">
              Marks: {submission.questionMarks?.[idx] || 0} / {question.marks}
            </span>
            {submission.feedback?.[idx] && (
              <p className="feedback"><strong>Feedback:</strong> {submission.feedback[idx]}</p>
            )}
          </div>
        </div>
      ))}

      <button onClick={() => navigate('/student-dashboard')} className="btn btn-primary">
        Back to Dashboard
      </button>
    </div>
  );
};

export default ViewResult;
