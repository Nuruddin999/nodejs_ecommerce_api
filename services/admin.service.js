const { User } = require("../models/user"); // Assuming you have a User model
const bcrypt = require("bcrypt");
const { ADMIN_LOGIN, ADMIN_PASSWORD } = process.env;

async function initializeAdminUser() {
  try {
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Create the new admin user
    const adminUser = new User({
      email: ADMIN_LOGIN,
      password: hashedPassword,
      fullName: "Admin",
      username: "admin",
      role: "admin"
    });

    await adminUser.save();
    console.log("Admin user created successfully");
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}

module.exports = {
  initializeAdminUser,
};
