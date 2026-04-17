import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getExams, getSubmissions, updateSubmission } from '../utils/storage';
import '../styles/EvaluateExams.css';

const EvaluateExams = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [questionMarks, setQuestionMarks] = useState({});
  const [feedback, setFeedback] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'staff') { navigate('/staff-login'); return; }
    const fetchData = async () => {
      const [examsData, subsData] = await Promise.all([getExams(), getSubmissions()]);
      setExams(examsData);
      setSubmissions(subsData.filter(s => !s.evaluated));
      setLoading(false);
    };
    fetchData();
  }, [user, navigate]);

  const handleSelectSubmission = (submission) => {
    const exam = exams.find(e => e.id === (submission.examId?.id || submission.examId));
    if (!exam) return;
    setSelectedSubmission(submission);
    const marks = {};
    const fb = {};
    exam.questions.forEach((q, idx) => {
      marks[idx] = q.type === 'mcq'
        ? (submission.answers[idx] === q.correctAnswer ? q.marks : 0)
        : 0;
      fb[idx] = '';
    });
    setQuestionMarks(marks);
    setFeedback(fb);
  };

  const handleSubmitEvaluation = async () => {
    setSubmitting(true);
    const result = await updateSubmission(selectedSubmission.id, { questionMarks, feedback });
    setSubmitting(false);
    if (result.success) {
      setSubmissions(submissions.filter(s => s.id !== selectedSubmission.id));
      setSelectedSubmission(null);
      alert('Evaluation submitted successfully!');
    } else {
      alert('Failed to submit evaluation');
    }
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;

  if (selectedSubmission) {
    const exam = exams.find(e => e.id === (selectedSubmission.examId?.id || selectedSubmission.examId));
    return (
      <div className="container">
        <button onClick={() => setSelectedSubmission(null)} className="btn btn-secondary">
          ← Back to Submissions
        </button>

        <div className="card evaluation-header">
          <h2>Evaluate Submission</h2>
          <p><strong>Student:</strong> {selectedSubmission.studentName}</p>
          <p><strong>Exam:</strong> {exam.title}</p>
          <p><strong>Submitted:</strong> {new Date(selectedSubmission.createdAt).toLocaleString()}</p>
        </div>

        {exam.questions.map((question, idx) => (
          <div key={idx} className="card evaluation-question">
            <h4>Question {idx + 1} (Max Marks: {question.marks})</h4>
            <p className="question-text">{question.question}</p>

            {question.type === 'mcq' && (
              <div className="mcq-evaluation">
                <p><strong>Correct Answer:</strong> <span className="correct">{question.correctAnswer}</span></p>
                <p><strong>Student Answer:</strong>
                  <span className={selectedSubmission.answers[idx] === question.correctAnswer ? 'correct' : 'incorrect'}>
                    {selectedSubmission.answers[idx] || 'Not answered'}
                  </span>
                </p>
                <p><strong>Auto-graded Marks:</strong> {questionMarks[idx]}</p>
              </div>
            )}

            {question.type === 'subjective' && (
              <div className="subjective-evaluation">
                <p><strong>Student Answer:</strong></p>
                <div className="student-answer">{selectedSubmission.answers[idx] || 'Not answered'}</div>
                <div className="form-group">
                  <label>Assign Marks (out of {question.marks})</label>
                  <input type="number" min="0" max={question.marks} value={questionMarks[idx]}
                    onChange={(e) => setQuestionMarks({ ...questionMarks, [idx]: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Feedback (Optional)</label>
              <textarea value={feedback[idx]}
                onChange={(e) => setFeedback({ ...feedback, [idx]: e.target.value })}
                placeholder="Add feedback for this question" />
            </div>
          </div>
        ))}

        <div className="total-marks">
          <h3>Total Marks: {Object.values(questionMarks).reduce((sum, m) => sum + m, 0)} / {exam.questions.reduce((sum, q) => sum + q.marks, 0)}</h3>
        </div>

        <button onClick={handleSubmitEvaluation} className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Evaluation'}
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Evaluate Submissions</h1>
      {submissions.length === 0 ? (
        <div className="card"><p>No pending submissions to evaluate</p></div>
      ) : (
        <div className="submissions-list">
          {submissions.map(submission => {
            const exam = exams.find(e => e.id === (submission.examId?.id || submission.examId));
            return (
              <div key={submission.id} className="card submission-card">
                <h3>{exam?.title || 'Unknown Exam'}</h3>
                <p><strong>Student:</strong> {submission.studentName}</p>
                <p><strong>Submitted:</strong> {new Date(submission.createdAt).toLocaleString()}</p>
                <button onClick={() => handleSelectSubmission(submission)} className="btn btn-primary">
                  Evaluate
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EvaluateExams;
