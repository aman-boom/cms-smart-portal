require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const libraryRoutes = require('./routes/library');
const hospitalRoutes = require('./routes/hospital');
const foodRoutes = require('./routes/food');
const classroomRoutes = require('./routes/classrooms');
const facultyRoutes = require('./routes/faculty');
const labRoutes = require('./routes/lab');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/hospital', hospitalRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/lab', labRoutes);

// 404 fallback
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found' }));

// Central error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`CMS backend running on http://localhost:${PORT}`);
});
