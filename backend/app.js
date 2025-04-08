const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const User = require('./models/User');
const userRoutes = require('./routes/userRoutes');


const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api', userRoutes);

// Synchronisation de la base de données
sequelize.sync().then(() => {
  console.log('Database synced');
});

module.exports = app;