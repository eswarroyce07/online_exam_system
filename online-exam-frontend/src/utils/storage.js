import api from './api';

// Auth
export const registerUser = async (userData) => {
  try {
    const data = await api('POST', '/auth/register', userData);
    if (data.token) localStorage.setItem('token', data.token);
    return { success: true, message: data.message, user: data.user };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const loginUser = async (email, password, role) => {
  try {
    const data = await api('POST', '/auth/login', { email, password, role });
    localStorage.setItem('token', data.token);
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const loginAdmin = async (email, password) => {
  try {
    const data = await api('POST', '/auth/login', { email, password, role: 'admin' });
    localStorage.setItem('token', data.token);
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const registerAdmin = async (name, email, password) => {
  try {
    const data = await api('POST', '/auth/register', { name, email, password, role: 'admin' });
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const getUsers = async () => {
  try {
    const data = await api('GET', '/admin/users');
    return data.users;
  } catch {
    return [];
  }
};

// Exams
export const getExams = async () => {
  try {
    const data = await api('GET', '/exams');
    return data.exams;
  } catch {
    return [];
  }
};

export const saveExam = async (exam) => {
  try {
    await api('POST', '/exams', exam);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateExam = async (examId, updates) => {
  try {
    await api('PUT', `/exams/${examId}`, updates);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const deleteExam = async (examId) => {
  try {
    await api('DELETE', `/exams/${examId}`);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Submissions
export const getSubmissions = async () => {
  try {
    const data = await api('GET', '/submissions');
    return data.submissions;
  } catch {
    return [];
  }
};

export const saveSubmission = async (submission) => {
  try {
    await api('POST', '/submissions', submission);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const updateSubmission = async (submissionId, updates) => {
  try {
    await api('PUT', `/submissions/${submissionId}/evaluate`, updates);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
