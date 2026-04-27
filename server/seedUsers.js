const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const seedUsers = async () => {
  try {
    // Remove existing users (clean reset)
    await User.deleteMany({});
    console.log("Old users removed");

    const adminPassword   = await bcrypt.hash("admin123",   10);
    const kavyaPassword   = await bcrypt.hash("kavya123",   10);
    const arjunPassword   = await bcrypt.hash("arjun123",   10);
    const snehaPassword   = await bcrypt.hash("sneha123",   10);
    const raviPassword    = await bcrypt.hash("ravi123",    10);

    const users = [
      // ── Super Admin ──────────────────────────────────────────
      {
        name: "Super Admin",
        email: "admin@edu.in",
        password: adminPassword,
        role: "admin",
        department: "Administration",
        engagementScore: 0
      },

      // ── Student-Admins ───────────────────────────────────────
      {
        name: "Kavya",
        email: "kavya@edu.in",
        password: kavyaPassword,
        role: "user",
        department: "Computer Science",
        engagementScore: 0
      },
      {
        name: "Arjun",
        email: "arjun@edu.in",
        password: arjunPassword,
        role: "user",
        department: "Information Technology",
        engagementScore: 0
      },
      {
        name: "Sneha",
        email: "sneha@edu.in",
        password: snehaPassword,
        role: "user",
        department: "Electronics",
        engagementScore: 0
      },
      {
        name: "Ravi",
        email: "ravi@edu.in",
        password: raviPassword,
        role: "user",
        department: "Mechanical Engineering",
        engagementScore: 0
      }
    ];

    await User.insertMany(users);

    console.log("Users seeded successfully:");
    console.log("  admin@edu.in   / admin123  [admin]");
    console.log("  kavya@edu.in   / kavya123  [user]");
    console.log("  arjun@edu.in   / arjun123  [user]");
    console.log("  sneha@edu.in   / sneha123  [user]");
    console.log("  ravi@edu.in    / ravi123   [user]");
    process.exit();

  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

seedUsers();