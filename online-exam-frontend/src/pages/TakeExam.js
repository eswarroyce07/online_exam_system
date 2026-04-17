import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getExams, saveSubmission } from '../utils/storage';
import '../styles/TakeExam.css';

const TakeExam = () => {
  const { examId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'student') { navigate('/student-login'); return; }
    const fetchExam = async () => {
      const exams = await getExams();
      const foundExam = exams.find(e => e.id === parseInt(examId));
      if (!foundExam) { navigate('/student-dashboard'); return; }
      setExam(foundExam);
      setTimeLeft(foundExam.duration * 60);
      setLoading(false);
    };
    fetchExam();

    const enterFullscreen = async () => {
      try { await document.documentElement.requestFullscreen?.(); } catch {}
    };
    enterFullscreen();

    const preventCopy = (e) => e.preventDefault();
    document.addEventListener('copy', preventCopy);
    document.addEventListener('paste', preventCopy);
    document.addEventListener('cut', preventCopy);

    return () => {
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('paste', preventCopy);
      document.removeEventListener('cut', preventCopy);
      try { if (document.fullscreenElement) document.exitFullscreen?.(); } catch {}
    };
  }, [examId, navigate, user]);

  const handleSubmit = useCallback(async (currentAnswers) => {
    if (!exam || !user) return;
    await saveSubmission({ examId: exam.id, answers: currentAnswers });
    try { if (document.fullscreenElement) document.exitFullscreen?.(); } catch {}
    navigate('/student-dashboard');
  }, [exam, user, navigate]);

  useEffect(() => {
    if (!exam || submitted) return;
    if (timeLeft <= 0) { setSubmitted(true); handleSubmit(answers); return; }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, exam, submitted, handleSubmit, answers]);

  const handleAnswer = (value) => setAnswers(prev => ({ ...prev, [currentQuestion]: value }));

  if (loading) return <div>Loading...</div>;
  if (!exam) return <div>Loading...</div>;

  const question = exam.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / exam.questions.length) * 100;

  return (
    <div className="exam-container">
      <div className="exam-header">
        <h2>{exam.title}</h2>
        <div className="timer">⏱️ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="question-nav">
        {exam.questions.map((_, idx) => (
          <button key={idx}
            className={`question-btn ${currentQuestion === idx ? 'active' : ''} ${answers[idx] ? 'answered' : ''}`}
            onClick={() => setCurrentQuestion(idx)}>
            {idx + 1}
          </button>
        ))}
      </div>

      <div className="question-card card">
        <h3>Question {currentQuestion + 1} of {exam.questions.length}</h3>
        <p className="question-text">{question.question}</p>

        {question.type === 'mcq' ? (
          <div className="options">
            {question.options.map((option, idx) => (
              <label key={idx} className="option-label">
                <input type="radio" name="answer"
                  checked={answers[currentQuestion] === option}
                  onChange={() => handleAnswer(option)} />
                <span>{option}</span>
              </label>
            ))}
          </div>
        ) : (
          <textarea className="subjective-answer"
            value={answers[currentQuestion] || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder="Type your answer here..." />
        )}
      </div>

      <div className="exam-actions">
        <button className="btn btn-secondary"
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}>
          Previous
        </button>
        {currentQuestion < exam.questions.length - 1 ? (
          <button className="btn btn-primary" onClick={() => setCurrentQuestion(prev => prev + 1)}>
            Next
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => handleSubmit(answers)}>
            Submit Exam
          </button>
        )}
      </div>
    </div>
  );
};

export default TakeExam;
