const express = require('express');
const router = express.Router();
const { getSubmissions, getSubmissionById, createSubmission, evaluateSubmission } = require('../controllers/submissionController');
const { protect, authorizeRoles } = require('../middleware/auth');

router.get('/', protect, getSubmissions);
router.get('/:id', protect, getSubmissionById);
router.post('/', protect, authorizeRoles('student'), createSubmission);
router.put('/:id/evaluate', protect, authorizeRoles('staff', 'admin'), evaluateSubmission);

module.exports = router;
