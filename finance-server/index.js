const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
require('./autoSaving/autoSavingCron');
const dotenv = require('dotenv');

const connectDB = require("./config/db");
const authRoutes = require('./routes/authRoutes.js');
// const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes.js');
const metaRoutes = require('./routes/metaRoutes');
const profileRoutes = require('./routes/profileRoutes');
const savingsGoalsRoutes = require('./routes/savingGoals');
const autoSavingRegistry = require('./autoSaving/autoSavingRegistry');


dotenv.config();
connectDB();


const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());


// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.error('Mongo Error:', err));


app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/transactions', transactionRoutes);

// app.use('/api/income', incomeRoutes);
app.use('/api/meta', metaRoutes);

app.use('/api/goals', savingsGoalsRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something broke!" });
});

app.get('/', (req, res) => {
  res.send('Server is running...');
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

