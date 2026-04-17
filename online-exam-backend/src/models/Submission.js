const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Submission = sequelize.define('Submission', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  examId: { type: DataTypes.INTEGER, allowNull: false },
  studentId: { type: DataTypes.INTEGER, allowNull: false },
  studentName: { type: DataTypes.STRING, allowNull: false },
  answers: { type: DataTypes.JSONB, allowNull: false, defaultValue: {} },
  evaluated: { type: DataTypes.BOOLEAN, defaultValue: false },
  questionMarks: { type: DataTypes.JSONB },
  feedback: { type: DataTypes.JSONB },
  totalMarks: { type: DataTypes.FLOAT },
  maxMarks: { type: DataTypes.FLOAT }
}, { tableName: 'submissions', timestamps: true });

module.exports = Submission;
