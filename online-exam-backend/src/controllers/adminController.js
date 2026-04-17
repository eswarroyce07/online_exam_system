const { User, Exam, Submission } = require('../models');

// GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.destroy();
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const students = await User.count({ where: { role: 'student' } });
    const staff = await User.count({ where: { role: 'staff' } });
    const totalExams = await Exam.count();
    const totalSubmissions = await Submission.count();
    const pendingEvaluations = await Submission.count({ where: { evaluated: false } });
    const evaluatedSubmissions = await Submission.count({ where: { evaluated: true } });

    res.json({ success: true, stats: { totalUsers, students, staff, totalExams, totalSubmissions, pendingEvaluations, evaluatedSubmissions } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/admin/clear
const clearAllData = async (req, res) => {
  try {
    await Submission.destroy({ where: {} });
    await Exam.destroy({ where: {} });
    await User.destroy({ where: { role: ['student', 'staff'] } });
    res.json({ success: true, message: 'All data cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, deleteUser, getStats, clearAllData };
