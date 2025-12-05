import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Profile from "@/models/Profile";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
    return null;
  }

  await dbConnect();
  const profile = await Profile.findOne({ userId: session.user.id }).lean();

  const serializedProfile = profile
    ? {
        _id: (profile as any)._id.toString(),
        displayName: (profile as any).displayName,
        headline: (profile as any).headline,
        bio: (profile as any).bio,
        projects: (profile as any).projects,
        skills: (profile as any).skills || [],
        languages: (profile as any).languages || [],
        availability: (profile as any).availability,
        verified: (profile as any).verified || false,
      }
    : null;

  return (
    <DashboardClient
      user={{
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      }}
      profile={serializedProfile}
    />
  );
}
