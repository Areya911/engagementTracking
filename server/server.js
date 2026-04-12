const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// CORS — allow both local dev and deployed client
const allowedOrigins = [
    "http://localhost:3000",
    process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        const isLocalHost = origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1");
        const isLocalNetwork = origin.startsWith("http://10.") || origin.startsWith("http://192.168.") || origin.startsWith("http://172.");
        if (allowedOrigins.includes(origin) || isLocalHost || isLocalNetwork) {
            return callback(null, true);
        }
        callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true
}));

app.use(express.json());

// ---------- API Routes ----------
app.use('/api/auth',          require('./routes/authRoutes'));
app.use('/api/test',          require('./routes/testRoutes'));
app.use('/api/activities',    require('./routes/activityRoutes'));
app.use('/api/engagements',   require('./routes/engagementRoutes'));
app.use('/api/dashboard',     require('./routes/dashboardRoutes'));
app.use('/api/users',         require('./routes/userRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// ---------- Health check ----------
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'EduTrack API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
