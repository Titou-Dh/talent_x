import mongoose, { Schema, model, models } from "mongoose";

const ProfileSchema = new Schema(
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
    // Location fields
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

const Profile = models.Profile || model("Profile", ProfileSchema);
export default Profile;
