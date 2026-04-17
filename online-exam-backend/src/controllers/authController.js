const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, rollNo, staffId } = req.body;
    if (!name || !email || !password || !role)
      return res.status(400).json({ message: 'All fields are required' });

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, role, rollNo, staffId });
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token: generateToken(user.id)
    });
  } catch (error) {
    console.error('Register error:', error);
    next(error);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role)
      return res.status(400).json({ message: 'All fields are required' });

    // Hardcoded default admin
    if (role === 'admin' && email === 'admin@exam.com' && password === 'admin123') {
      return res.json({
        success: true,
        user: { id: 'admin', name: 'Admin', email, role: 'admin' },
        token: generateToken('admin')
      });
    }

    const user = await User.findOne({ where: { email, role } });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    res.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, rollNo: user.rollNo, staffId: user.staffId },
      token: generateToken(user.id)
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

module.exports = { register, login, getMe };
