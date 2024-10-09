const dbConfig = require('../config/dbConfig');
const { Sequelize, DataTypes } = require('sequelize');

// Create a new Sequelize instance
const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.user,
    dbConfig.password,
    {
        host: dbConfig.host,
        dialect: 'mysql',
    }
);

// Test the connection
sequelize.authenticate()
    .then(() => {
        console.log('Database connection established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Load models
db.users = require('./userModel.js')(sequelize, DataTypes);

// Sync database without dropping existing tables
db.sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database synchronized.');
    });

module.exports = db;
