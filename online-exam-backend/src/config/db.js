const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected successfully');
    await sequelize.sync({ alter: true });
    console.log('All tables synced');
  } catch (error) {
    console.error('PostgreSQL connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
