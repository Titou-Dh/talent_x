import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Profile from "@/models/Profile";
import { AdminView } from "./AdminView";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
    return null;
  }

  await dbConnect();
  const profiles = await Profile.find({}).lean();

  // Serialize mongo objects
  const serializedProfiles = profiles.map((p) => ({
    ...p,
    _id: (p as any)._id.toString(),
    userId: (p as any).userId.toString(),
    createdAt: (p as any).createdAt.toISOString(),
    updatedAt: (p as any).updatedAt.toISOString(),
  }));

  return <AdminView profiles={serializedProfiles} />;
}
