import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Profile from "@/models/Profile";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  await dbConnect();
  const profiles = await Profile.find({}).sort({ createdAt: -1 });
  return NextResponse.json(profiles);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    await dbConnect();

    // Check if profile already exists for user
    const existing = await Profile.findOne({ userId: session.user.id });
    if (existing) {
      return NextResponse.json(
        { error: "Profile already exists" },
        { status: 400 }
      );
    }

    const profile = await Profile.create({
      ...body,
      userId: session.user.id,
      verified: false,
    });

    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
