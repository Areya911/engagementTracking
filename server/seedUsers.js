const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const seedUsers = async () => {
  try {
    // Remove existing users (optional clean reset)
    await User.deleteMany({});
    console.log("Old users removed");

    const adminPassword = await bcrypt.hash("admin123", 10);
    const studentPassword = await bcrypt.hash("student123", 10);

    const users = [
      {
        name: "Super Admin",
        email: "admin@edu.in",
        password: adminPassword,
        role: "admin",
        department: "Administration",
        engagementScore: 0
      },
      {
        name: "Kavya",
        email: "kavya@edu.in",
        password: studentPassword,
        role: "user",
        department: "Computer Science",
        engagementScore: 0
      },
      {
        name: "Arjun",
        email: "arjun@edu.in",
        password: studentPassword,
        role: "user",
        department: "Information Technology",
        engagementScore: 0
      }
    ];

    await User.insertMany(users);

    console.log("Users seeded successfully");
    process.exit();

  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

seedUsers();