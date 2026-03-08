const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected:', mongoose.connection.host))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/scholarships', require('./routes/scholarshipRoutes'));
app.use('/api/bookmark', require('./routes/bookmarkRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/roadmap', require('./routes/roadmapRoutes'));
app.use('/api/forum', require('./routes/forumRoutes'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'ScholarSync API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
