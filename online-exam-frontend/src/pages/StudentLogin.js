import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { registerUser, loginUser } from '../utils/storage';
import '../styles/Auth.css';

const StudentLogin = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', rollNo: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (isRegister) {
      if (!formData.name || !formData.rollNo) {
        setError('All fields are required');
        setLoading(false);
        return;
      }
      const result = await registerUser({ ...formData, role: 'student' });
      if (result.success) {
        if (result.user) {
          login(result.user);
          navigate('/student-dashboard');
        } else {
          setIsRegister(false);
          setFormData({ name: '', email: '', password: '', rollNo: '' });
        }
      } else {
        setError(result.message);
      }
    } else {
      const result = await loginUser(formData.email, formData.password, 'student');
      if (result.success) {
        login(result.user);
        navigate('/student-dashboard');
      } else {
        setError(result.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isRegister ? 'Student Registration' : 'Student Login'}</h2>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name" />
              </div>
              <div className="form-group">
                <label>Roll Number</label>
                <input type="text" value={formData.rollNo}
                  onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                  placeholder="Enter roll number" />
              </div>
            </>
          )}
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password" />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
          </button>
        </form>
        <p className="toggle-auth">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <span onClick={() => { setIsRegister(!isRegister); setError(''); }}>
            {isRegister ? ' Login' : ' Register'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default StudentLogin;
