const User = require('./User');
const Exam = require('./Exam');
const Submission = require('./Submission');

// Associations
User.hasMany(Exam, { foreignKey: 'createdBy', as: 'exams' });
Exam.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

User.hasMany(Submission, { foreignKey: 'studentId', as: 'submissions' });
Submission.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

Exam.hasMany(Submission, { foreignKey: 'examId', as: 'submissions' });
Submission.belongsTo(Exam, { foreignKey: 'examId', as: 'exam' });

module.exports = { User, Exam, Submission };
