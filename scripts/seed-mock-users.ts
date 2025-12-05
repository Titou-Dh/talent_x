import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// MongoDB connection - use env variable
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("ERROR: MONGODB_URI environment variable is not set");
  console.error("Make sure you have a .env file with MONGODB_URI defined");
  process.exit(1);
}

// User Schema
const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
  },
  { timestamps: true }
);

// Profile Schema
const ProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    displayName: { type: String, required: true },
    headline: { type: String },
    bio: { type: String },
    projects: { type: String },
    skills: [{ type: String }],
    languages: [{ type: String }],
    availability: { type: String },
    verified: { type: Boolean, default: false },
    location: {
      city: { type: String },
      country: { type: String },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    isRemote: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Profile = mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);

// Mock data
const cities = [
  { city: "Paris", country: "France", lat: 48.8566, lng: 2.3522 },
  { city: "London", country: "United Kingdom", lat: 51.5074, lng: -0.1278 },
  { city: "New York", country: "USA", lat: 40.7128, lng: -74.006 },
  { city: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503 },
  { city: "Berlin", country: "Germany", lat: 52.52, lng: 13.405 },
  { city: "Amsterdam", country: "Netherlands", lat: 52.3676, lng: 4.9041 },
  { city: "Barcelona", country: "Spain", lat: 41.3851, lng: 2.1734 },
  { city: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093 },
  { city: "Toronto", country: "Canada", lat: 43.6532, lng: -79.3832 },
  { city: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198 },
  { city: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708 },
  { city: "Stockholm", country: "Sweden", lat: 59.3293, lng: 18.0686 },
  { city: "Lisbon", country: "Portugal", lat: 38.7223, lng: -9.1393 },
  { city: "Seoul", country: "South Korea", lat: 37.5665, lng: 126.978 },
  { city: "Mumbai", country: "India", lat: 19.076, lng: 72.8777 },
  { city: "São Paulo", country: "Brazil", lat: -23.5505, lng: -46.6333 },
  { city: "Montreal", country: "Canada", lat: 45.5017, lng: -73.5673 },
  { city: "Vienna", country: "Austria", lat: 48.2082, lng: 16.3738 },
  { city: "Copenhagen", country: "Denmark", lat: 55.6761, lng: 12.5683 },
  { city: "Milan", country: "Italy", lat: 45.4642, lng: 9.19 },
];

const firstNames = [
  "Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Quinn", "Avery",
  "Jamie", "Skyler", "Reese", "Dakota", "Charlie", "Sage", "River", "Phoenix",
  "Blake", "Cameron", "Drew", "Ellis", "Finley", "Harper", "Hayden", "Jesse",
  "Kendall", "Lane", "Mason", "Nico", "Parker", "Rowan"
];

const lastNames = [
  "Smith", "Chen", "Garcia", "Kim", "Patel", "Johnson", "Williams", "Brown",
  "Jones", "Miller", "Davis", "Martinez", "Anderson", "Taylor", "Thomas",
  "Jackson", "White", "Harris", "Martin", "Thompson", "Moore", "Young",
  "Allen", "King", "Wright", "Scott", "Green", "Baker", "Adams", "Nelson"
];

const skills = [
  "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python", "Go",
  "Rust", "Java", "C++", "Swift", "Kotlin", "Ruby", "PHP", "Vue.js", "Angular",
  "Docker", "Kubernetes", "AWS", "GCP", "Azure", "PostgreSQL", "MongoDB",
  "Redis", "GraphQL", "REST API", "Machine Learning", "AI", "Blockchain",
  "DevOps", "CI/CD", "Agile", "Scrum", "UI/UX", "Figma", "TailwindCSS"
];

const headlines = [
  "Full Stack Developer | Open Source Enthusiast",
  "Senior Software Engineer @ Tech Startup",
  "Frontend Specialist | React & Next.js Expert",
  "Backend Developer | Cloud Architecture",
  "Mobile Developer | iOS & Android",
  "DevOps Engineer | Infrastructure as Code",
  "Data Scientist | ML & AI Researcher",
  "Product Designer | UX/UI Specialist",
  "Tech Lead | Building Scalable Systems",
  "Freelance Developer | Available for Projects",
  "Software Architect | System Design Expert",
  "Blockchain Developer | Web3 Builder",
  "Security Engineer | Ethical Hacker",
  "Game Developer | Unity & Unreal Engine",
  "Embedded Systems Engineer | IoT Specialist"
];

const languages = [
  "English", "French", "Spanish", "German", "Chinese", "Japanese", "Korean",
  "Portuguese", "Italian", "Russian", "Arabic", "Hindi", "Dutch", "Swedish"
];

const availabilities = ["Available", "Open to offers", "Busy", "Not available"];

function getRandomItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seedMockUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected to MongoDB");

    const mockUsers = [];

    for (let i = 0; i < 30; i++) {
      const firstName = getRandomItem(firstNames);
      const lastName = getRandomItem(lastNames);
      const name = `${firstName} ${lastName}`;
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;
      const hashedPassword = await bcrypt.hash("password123", 10);

      // Create user
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log(`⊘ User ${email} already exists, skipping...`);
        continue;
      }

      const user = await User.create({
        email,
        password: hashedPassword,
        name,
        role: "USER",
      });

      // Create profile
      const location = getRandomItem(cities);
      const isVerified = Math.random() < 0.4; // 40% chance of being verified
      const isRemote = Math.random() < 0.6; // 60% chance of remote work
      const hasLocation = Math.random() < 0.8; // 80% have location data

      const profile = await Profile.create({
        userId: user._id,
        displayName: name,
        headline: getRandomItem(headlines),
        bio: `Hi, I'm ${firstName}! I'm a passionate developer with ${Math.floor(Math.random() * 15) + 1} years of experience. I love building products that make a difference and collaborating with great teams.`,
        projects: `• Built a ${getRandomItem(["SaaS platform", "mobile app", "e-commerce site", "developer tool", "API service"])} with ${getRandomItem(skills)} and ${getRandomItem(skills)}\n• Contributed to open source projects with ${Math.floor(Math.random() * 500) + 50}+ GitHub stars\n• Led development of ${getRandomItem(["payment system", "real-time chat", "analytics dashboard", "auth system"])}`,
        skills: getRandomItems(skills, Math.floor(Math.random() * 8) + 3),
        languages: getRandomItems(languages, Math.floor(Math.random() * 3) + 1),
        availability: getRandomItem(availabilities),
        verified: isVerified,
        location: hasLocation ? {
          city: location.city,
          country: location.country,
          coordinates: {
            lat: location.lat,
            lng: location.lng,
          },
        } : undefined,
        isRemote,
      });

      mockUsers.push({ user, profile });
      console.log(`✓ Created: ${name} ${isVerified ? "(verified)" : ""} - ${location.city}, ${location.country}`);
    }

    console.log("\n========================================");
    console.log(`✓ Successfully created ${mockUsers.length} mock users`);
    console.log(`  - Verified: ${mockUsers.filter(u => u.profile.verified).length}`);
    console.log(`  - With location: ${mockUsers.filter(u => u.profile.location?.city).length}`);
    console.log(`  - Remote available: ${mockUsers.filter(u => u.profile.isRemote).length}`);
    console.log("========================================");
    console.log("\nAll users have password: password123");

  } catch (error) {
    console.error("Error seeding mock users:", error);
  } finally {
    await mongoose.disconnect();
    console.log("✓ Disconnected from MongoDB");
  }
}

seedMockUsers();
