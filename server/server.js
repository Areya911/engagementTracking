const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
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
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        callback(new Error("Not allowed by CORS"));
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

// ---------- Serve React client in production ----------
if (process.env.NODE_ENV === "production") {
    const clientBuild = path.join(__dirname, "..", "client", "build");
    app.use(express.static(clientBuild));

    // Any route that is NOT /api/* → serve React's index.html
    app.get("*", (req, res) => {
        res.sendFile(path.join(clientBuild, "index.html"));
    });
} else {
    app.get('/', (req, res) => {
        res.send('API Running...');
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
