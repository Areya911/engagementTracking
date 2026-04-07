const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API Running...');
});
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
const testRoutes = require('./routes/testRoutes');
app.use('/api/test', testRoutes);
const activityRoutes = require('./routes/activityRoutes');
app.use('/api/activities', activityRoutes);
const engagementRoutes = require('./routes/engagementRoutes');
app.use('/api/engagements', engagementRoutes);
const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/api/dashboard', dashboardRoutes);
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

app.use("/api/notifications", require("./routes/notificationRoutes"));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
