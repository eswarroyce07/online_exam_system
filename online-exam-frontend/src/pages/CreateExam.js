import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { saveExam } from '../utils/storage';
import '../styles/CreateExam.css';

const CreateExam = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [examData, setExamData] = useState({ title: '', description: '', duration: 30 });
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '', type: 'mcq', options: ['', '', '', ''], correctAnswer: '', marks: 1
  });
  const [loading, setLoading] = useState(false);

  const handleAddQuestion = () => {
    if (!currentQuestion.question) { alert('Please enter a question'); return; }
    if (currentQuestion.type === 'mcq' && (!currentQuestion.correctAnswer || currentQuestion.options.some(o => !o))) {
      alert('Please fill all options and select correct answer'); return;
    }
    setQuestions([...questions, currentQuestion]);
    setCurrentQuestion({ question: '', type: 'mcq', options: ['', '', '', ''], correctAnswer: '', marks: 1 });
  };

  const handleRemoveQuestion = (index) => setQuestions(questions.filter((_, idx) => idx !== index));

  const handleCreateExam = async () => {
    if (!user || user.role !== 'staff') { navigate('/staff-login'); return; }
    if (!examData.title || questions.length === 0) {
      alert('Please add exam title and at least one question'); return;
    }
    setLoading(true);
    const result = await saveExam({ ...examData, questions });
    setLoading(false);
    if (result.success) {
      navigate('/staff-dashboard');
    } else {
      alert('Failed to create exam: ' + result.message);
    }
  };

  return (
    <div className="container">
      <h1>Create New Exam</h1>

      <div className="card">
        <h3>Exam Details</h3>
        <div className="form-group">
          <label>Exam Title</label>
          <input type="text" value={examData.title}
            onChange={(e) => setExamData({ ...examData, title: e.target.value })}
            placeholder="Enter exam title" />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea value={examData.description}
            onChange={(e) => setExamData({ ...examData, description: e.target.value })}
            placeholder="Enter exam description" />
        </div>
        <div className="form-group">
          <label>Duration (minutes)</label>
          <input type="number" value={examData.duration}
            onChange={(e) => setExamData({ ...examData, duration: parseInt(e.target.value) })}
            min="1" />
        </div>
      </div>

      <div className="card">
        <h3>Add Question</h3>
        <div className="form-group">
          <label>Question Type</label>
          <select value={currentQuestion.type}
            onChange={(e) => setCurrentQuestion({ ...currentQuestion, type: e.target.value })}>
            <option value="mcq">Multiple Choice</option>
            <option value="subjective">Subjective</option>
          </select>
        </div>
        <div className="form-group">
          <label>Question</label>
          <textarea value={currentQuestion.question}
            onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
            placeholder="Enter question" />
        </div>
        {currentQuestion.type === 'mcq' && (
          <>
            {currentQuestion.options.map((option, idx) => (
              <div key={idx} className="form-group">
                <label>Option {idx + 1}</label>
                <input type="text" value={option}
                  onChange={(e) => {
                    const newOptions = [...currentQuestion.options];
                    newOptions[idx] = e.target.value;
                    setCurrentQuestion({ ...currentQuestion, options: newOptions });
                  }}
                  placeholder={`Enter option ${idx + 1}`} />
              </div>
            ))}
            <div className="form-group">
              <label>Correct Answer</label>
              <select value={currentQuestion.correctAnswer}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}>
                <option value="">Select correct answer</option>
                {currentQuestion.options.map((option, idx) => (
                  <option key={idx} value={option}>{option || `Option ${idx + 1}`}</option>
                ))}
              </select>
            </div>
          </>
        )}
        <div className="form-group">
          <label>Marks</label>
          <input type="number" value={currentQuestion.marks}
            onChange={(e) => setCurrentQuestion({ ...currentQuestion, marks: parseInt(e.target.value) })}
            min="1" />
        </div>
        <button onClick={handleAddQuestion} className="btn btn-primary">Add Question</button>
      </div>

      {questions.length > 0 && (
        <div className="card">
          <h3>Questions Added ({questions.length})</h3>
          {questions.map((q, idx) => (
            <div key={idx} className="question-preview">
              <div className="question-header">
                <span><strong>Q{idx + 1}:</strong> {q.question}</span>
                <button onClick={() => handleRemoveQuestion(idx)} className="btn btn-danger btn-sm">Remove</button>
              </div>
              <p className="question-meta">Type: {q.type} | Marks: {q.marks}</p>
            </div>
          ))}
        </div>
      )}

      <div className="action-buttons">
        <button onClick={() => navigate('/staff-dashboard')} className="btn btn-secondary">Cancel</button>
        <button onClick={handleCreateExam} className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating...' : 'Create Exam'}
        </button>
      </div>
    </div>
  );
};

export default CreateExam;
