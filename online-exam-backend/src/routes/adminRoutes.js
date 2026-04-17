const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, getStats, clearAllData } = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middleware/auth');

router.use(protect, authorizeRoles('admin'));

router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.get('/stats', getStats);
router.delete('/clear', clearAllData);

module.exports = router;
