const { Submission, Exam, User } = require('../models');

// GET /api/submissions
const getSubmissions = async (req, res) => {
  try {
    const where = req.user.role === 'student' ? { studentId: req.user.id } : {};
    const submissions = await Submission.findAll({
      where,
      include: [
        { model: Exam, as: 'exam', attributes: ['id', 'title', 'description', 'duration', 'questions'] },
        { model: User, as: 'student', attributes: ['name', 'email', 'rollNo'] }
      ]
    });
    res.json({ success: true, submissions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/submissions/:id
const getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findByPk(req.params.id, {
      include: [
        { model: Exam, as: 'exam', attributes: ['id', 'title', 'description', 'duration', 'questions'] },
        { model: User, as: 'student', attributes: ['name', 'email', 'rollNo'] }
      ]
    });
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    res.json({ success: true, submission });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/submissions
const createSubmission = async (req, res) => {
  try {
    const { examId, answers } = req.body;
    if (!examId || !answers)
      return res.status(400).json({ message: 'examId and answers are required' });

    const existing = await Submission.findOne({ where: { examId, studentId: req.user.id } });
    if (existing) return res.status(400).json({ message: 'You have already submitted this exam' });

    const submission = await Submission.create({
      examId,
      studentId: req.user.id,
      studentName: req.user.name,
      answers,
      evaluated: false
    });
    res.status(201).json({ success: true, submission });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/submissions/:id/evaluate
const evaluateSubmission = async (req, res) => {
  try {
    const { questionMarks, feedback } = req.body;
    const submission = await Submission.findByPk(req.params.id, {
      include: [{ model: Exam, as: 'exam' }]
    });
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    const totalMarks = Object.values(questionMarks).reduce((sum, m) => sum + Number(m), 0);
    const maxMarks = submission.exam.questions.reduce((sum, q) => sum + q.marks, 0);

    await submission.update({ evaluated: true, questionMarks, feedback, totalMarks, maxMarks });
    res.json({ success: true, submission });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSubmissions, getSubmissionById, createSubmission, evaluateSubmission };
