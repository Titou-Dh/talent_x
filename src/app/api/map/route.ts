import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Profile from "@/models/Profile";

interface ProfileLocation {
  _id: { toString(): string };
  displayName: string;
  headline?: string;
  skills: string[];
  verified: boolean;
  location?: {
    city?: string;
    country?: string;
    coordinates?: {
      lat?: number;
      lng?: number;
    };
  };
  isRemote?: boolean;
}

export async function GET() {
  try {
    await dbConnect();

    // Get all profiles with location data
    const profiles = await Profile.find({
      $or: [
        { "location.coordinates.lat": { $exists: true, $ne: null } },
        { isRemote: true },
      ],
    })
      .select("displayName headline skills verified location isRemote")
      .lean();

    const mappedProfiles = (profiles as unknown as ProfileLocation[]).map(
      (p) => ({
        _id: p._id.toString(),
        displayName: p.displayName,
        headline: p.headline,
        skills: p.skills || [],
        verified: p.verified || false,
        location: p.location,
        isRemote: p.isRemote || false,
      })
    );

    // Calculate stats
    const countries = new Set<string>();
    const cities = new Set<string>();
    let remoteTalents = 0;

    mappedProfiles.forEach((p) => {
      if (p.location?.country) countries.add(p.location.country);
      if (p.location?.city) cities.add(p.location.city);
      if (p.isRemote) remoteTalents++;
    });

    return NextResponse.json({
      profiles: mappedProfiles,
      stats: {
        countries: countries.size,
        cities: cities.size,
        remoteTalents,
        totalTalents: mappedProfiles.length,
      },
    });
  } catch (error) {
    console.error("Map API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch map data" },
      { status: 500 }
    );
  }
}
