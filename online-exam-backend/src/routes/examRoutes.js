const express = require('express');
const router = express.Router();
const { getExams, getExamById, createExam, updateExam, deleteExam } = require('../controllers/examController');
const { protect, authorizeRoles } = require('../middleware/auth');

router.get('/', protect, getExams);
router.get('/:id', protect, getExamById);
router.post('/', protect, authorizeRoles('staff', 'admin'), createExam);
router.put('/:id', protect, authorizeRoles('staff', 'admin'), updateExam);
router.delete('/:id', protect, authorizeRoles('staff', 'admin'), deleteExam);

module.exports = router;
