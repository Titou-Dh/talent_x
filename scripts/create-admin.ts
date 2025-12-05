import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://titoudh1_db_user:PKKyKcqnfs7F4LK7@cluster0.h6ipjd6.mongodb.net/?appName=Cluster0";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
    name: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected to MongoDB");

    const adminEmail = "admin@talentx.com";
    const adminPassword = "admin123";
    const adminName = "Admin";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("⚠ Admin user already exists");
      
      // Update to admin role if not already
      if (existingAdmin.role !== "ADMIN") {
        await User.updateOne({ email: adminEmail }, { role: "ADMIN" });
        console.log("✓ Updated existing user to ADMIN role");
      }
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.create({
        email: adminEmail,
        password: hashedPassword,
        name: adminName,
        role: "ADMIN",
      });
      console.log("✓ Admin user created successfully");
    }

    console.log("\n========================================");
    console.log("Admin Credentials:");
    console.log("Email:    admin@talentx.com");
    console.log("Password: admin123");
    console.log("========================================\n");

    await mongoose.disconnect();
    console.log("✓ Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("✗ Error:", error);
    process.exit(1);
  }
}

createAdmin();
