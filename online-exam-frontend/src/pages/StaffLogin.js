import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { registerUser, loginUser } from '../utils/storage';
import '../styles/Auth.css';

const StaffLogin = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', staffId: '' });
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
      if (!formData.name || !formData.staffId) {
        setError('All fields are required');
        setLoading(false);
        return;
      }
      const result = await registerUser({ ...formData, role: 'staff' });
      if (result.success) {
        if (result.user) {
          login(result.user);
          navigate('/staff-dashboard');
        } else {
          setIsRegister(false);
          setFormData({ name: '', email: '', password: '', staffId: '' });
        }
      } else {
        setError(result.message);
      }
    } else {
      const result = await loginUser(formData.email, formData.password, 'staff');
      if (result.success) {
        login(result.user);
        navigate('/staff-dashboard');
      } else {
        setError(result.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isRegister ? 'Staff Registration' : 'Staff Login'}</h2>
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
                <label>Staff ID</label>
                <input type="text" value={formData.staffId}
                  onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                  placeholder="Enter staff ID" />
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

export default StaffLogin;
