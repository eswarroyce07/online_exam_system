const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Exam = sequelize.define('Exam', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  duration: { type: DataTypes.INTEGER, allowNull: false },
  questions: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
  createdBy: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'exams', timestamps: true });

module.exports = Exam;
