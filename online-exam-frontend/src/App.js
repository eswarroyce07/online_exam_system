import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import StudentLogin from './pages/StudentLogin';
import StaffLogin from './pages/StaffLogin';
import AdminLogin from './pages/AdminLogin';
import StudentDashboard from './pages/StudentDashboard';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TakeExam from './pages/TakeExam';
import ViewResult from './pages/ViewResult';
import CreateExam from './pages/CreateExam';
import EvaluateExams from './pages/EvaluateExams';
import './styles/App.css';

function AppContent() {
  const { theme } = useContext(AuthContext);

  return (
    <div className={`app ${theme}`}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/student-login" element={<StudentLogin />} />
          <Route path="/staff-login" element={<StaffLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/staff-dashboard" element={<StaffDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/take-exam/:examId" element={<TakeExam />} />
          <Route path="/view-result/:examId" element={<ViewResult />} />
          <Route path="/create-exam" element={<CreateExam />} />
          <Route path="/evaluate-exams" element={<EvaluateExams />} />
        </Routes>
      </Router>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
