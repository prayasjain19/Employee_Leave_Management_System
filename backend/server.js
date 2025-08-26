// server.js

const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./db/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const balanceRoutes = require('./routes/balanceRoutes');

// Config
dotenv.config();

// App initialization here
const app = express();

// Middleware Imp
app.use(express.json());
app.use(cors({
  origin: ["https://employee-leave-management-seven.vercel.app"],
  credentials: true
}));
app.use(cookieParser());
app.use(helmet());
app.use(morgan('dev'));

// API Routes 
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/balances', balanceRoutes);
app.use('/api/calendar', require('./routes/calendarRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));


// Health check route
app.get('/', (req, res) => {
  res.send('Employee Leave Management API is running...');
});

// Server + DB start
const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to DB', error);
    process.exit(1);
  }
};


//Calling here
startServer();
