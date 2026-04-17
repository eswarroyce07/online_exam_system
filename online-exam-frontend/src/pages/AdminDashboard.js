import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getUsers, getExams, getSubmissions } from '../utils/storage';
import api from '../utils/api';
import '../styles/Dashboard.css';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [exams, setExams] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin-login');
      return;
    }
    const fetchData = async () => {
      const [usersData, examsData, subsData] = await Promise.all([
        getUsers(), getExams(), getSubmissions()
      ]);
      setUsers(usersData);
      setExams(examsData);
      setSubmissions(subsData);
      setLoading(false);
    };
    fetchData();
  }, [user, navigate]);

  const handleClearData = async () => {
    if (!window.confirm('Are you sure you want to clear ALL data?')) return;
    try {
      await api('DELETE', '/admin/clear');
      setUsers([]);
      setExams([]);
      setSubmissions([]);
      alert('All data cleared successfully');
    } catch (error) {
      alert('Failed to clear data: ' + error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api('DELETE', `/admin/users/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      alert('Failed to delete user: ' + error.message);
    }
  };

  const students = users.filter(u => u.role === 'student');
  const staff = users.filter(u => u.role === 'staff');

  if (loading) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>

      <div className="dashboard-stats">
        <div className="stat-card"><h3>{students.length}</h3><p>Students</p></div>
        <div className="stat-card"><h3>{staff.length}</h3><p>Staff</p></div>
        <div className="stat-card"><h3>{exams.length}</h3><p>Total Exams</p></div>
        <div className="stat-card"><h3>{submissions.length}</h3><p>Submissions</p></div>
      </div>

      <div className="action-buttons" style={{ marginBottom: '20px' }}>
        {['overview', 'users', 'exams', 'submissions'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`btn ${tab === t ? 'btn-primary' : 'btn-secondary'}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
        <button onClick={handleClearData} className="btn btn-danger" style={{ marginLeft: 'auto' }}>
          Clear All Data
        </button>
      </div>

      {tab === 'overview' && (
        <div className="exam-list">
          <div className="card exam-card">
            <h3>System Overview</h3>
            <p>Total registered users: {users.length}</p>
            <p>Pending evaluations: {submissions.filter(s => !s.evaluated).length}</p>
            <p>Evaluated submissions: {submissions.filter(s => s.evaluated).length}</p>
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="exam-list">
          <h2>All Users</h2>
          {users.length === 0 ? <p>No registered users</p> : users.map(u => (
            <div key={u.id} className="card exam-card">
              <h3>{u.name}</h3>
              <div className="exam-info">
                <span>Email: {u.email}</span>
                <span>Role: {u.role}</span>
                {u.rollNo && <span>Roll No: {u.rollNo}</span>}
                {u.staffId && <span>Staff ID: {u.staffId}</span>}
              </div>
              <button onClick={() => handleDeleteUser(u.id)} className="btn btn-danger btn-sm">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'exams' && (
        <div className="exam-list">
          <h2>All Exams</h2>
          {exams.length === 0 ? <p>No exams created</p> : exams.map(exam => (
            <div key={exam.id} className="card exam-card">
              <h3>{exam.title}</h3>
              <p>{exam.description}</p>
              <div className="exam-info">
                <span>Duration: {exam.duration} min</span>
                <span>Questions: {exam.questions.length}</span>
                <span>Submissions: {submissions.filter(s => (s.examId?.id || s.examId) === exam.id).length}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'submissions' && (
        <div className="exam-list">
          <h2>All Submissions</h2>
          {submissions.length === 0 ? <p>No submissions yet</p> : submissions.map(s => (
            <div key={s.id} className="card exam-card">
              <h3>{s.exam?.title || 'Unknown Exam'}</h3>
              <div className="exam-info">
                <span>Student: {s.student?.name || s.studentName}</span>
                <span>Status: {s.evaluated ? `Evaluated (${s.totalMarks}/${s.maxMarks})` : 'Pending'}</span>
                <span>Submitted: {new Date(s.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
