const { Exam, User } = require('../models');

// GET /api/exams
const getExams = async (req, res) => {
  try {
    const exams = await Exam.findAll({ include: [{ model: User, as: 'creator', attributes: ['name', 'email'] }] });
    res.json({ success: true, exams });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/exams/:id
const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findByPk(req.params.id, {
      include: [{ model: User, as: 'creator', attributes: ['name', 'email'] }]
    });
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json({ success: true, exam });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/exams
const createExam = async (req, res) => {
  try {
    const { title, description, duration, questions } = req.body;
    if (!title || !questions || questions.length === 0)
      return res.status(400).json({ message: 'Title and at least one question are required' });

    const exam = await Exam.create({ title, description, duration, questions, createdBy: req.user.id });
    res.status(201).json({ success: true, exam });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/exams/:id
const updateExam = async (req, res) => {
  try {
    const exam = await Exam.findByPk(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    await exam.update(req.body);
    res.json({ success: true, exam });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/exams/:id
const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByPk(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    await exam.destroy();
    res.json({ success: true, message: 'Exam deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getExams, getExamById, createExam, updateExam, deleteExam };
