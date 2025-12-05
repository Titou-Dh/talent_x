import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Profile from "@/models/Profile";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const profile = await Profile.findById(id);

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    await dbConnect();

    // Check if profile belongs to user or user is admin
    const profile = await Profile.findById(id);
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    if (
      profile.userId.toString() !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Don't allow updating verified status through this endpoint
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { verified: _verified, userId: _userId, ...updateData } = body;

    const updatedProfile = await Profile.findByIdAndUpdate(
      id,
      { ...updateData },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await dbConnect();

    const profile = await Profile.findById(id);
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    if (
      profile.userId.toString() !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Profile.findByIdAndDelete(id);
    return NextResponse.json({ message: "Profile deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
