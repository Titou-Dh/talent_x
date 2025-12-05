import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import dbConnect from "@/lib/db";
import Profile from "@/models/Profile";
import { RetroCard } from "@/components/RetroCard";
import { SkillTag } from "@/components/SkillTag";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { RetroButton } from "@/components/RetroButton";
import { ArrowLeft, MapPin } from "lucide-react";

interface ProfileData {
  _id: string;
  displayName: string;
  headline?: string;
  bio?: string;
  projects?: string;
  skills: string[];
  languages: string[];
  availability?: string;
  verified: boolean;
  createdAt: string;
  location?: {
    city?: string;
    country?: string;
  };
  isRemote?: boolean;
}

interface MongoProfile {
  _id: { toString(): string };
  displayName: string;
  headline?: string;
  bio?: string;
  projects?: string;
  skills?: string[];
  languages?: string[];
  availability?: string;
  verified?: boolean;
  createdAt: Date;
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

async function getProfile(id: string): Promise<ProfileData | null> {
  try {
    await dbConnect();
    const profile = await Profile.findById(id).lean();

    if (!profile) return null;

    const p = profile as unknown as MongoProfile;
    return {
      _id: p._id.toString(),
      displayName: p.displayName,
      headline: p.headline,
      bio: p.bio,
      projects: p.projects,
      skills: p.skills || [],
      languages: p.languages || [],
      availability: p.availability,
      verified: p.verified || false,
      createdAt: p.createdAt.toISOString(),
      location: p.location ? {
        city: p.location.city,
        country: p.location.country,
      } : undefined,
      isRemote: p.isRemote,
    };
  } catch {
    return null;
  }
}

export default async function TalentDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id } = await params;
  const profile = await getProfile(id);
  const t = await getTranslations("Talents");
  const tDashboard = await getTranslations("Dashboard");

  if (!profile) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <RetroButton href="/talents" variant="ghost" className="mb-4">
        <ArrowLeft size={18} /> {t("backToDirectory")}
      </RetroButton>

      <RetroCard className="p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-gray-800 pb-6">
            <div>
              <h1 className="text-5xl font-bold text-white tracking-tighter">
                {profile.displayName}
              </h1>
              {profile.headline && (
                <p className="text-xl text-gray-400 mt-2">{profile.headline}</p>
              )}
            </div>
            {profile.verified && <VerifiedBadge />}
          </div>

          {/* Bio */}
          {profile.bio && (
            <div>
              <h2 className="text-sm uppercase tracking-widest text-gray-600 mb-2">
                {"// "}{tDashboard("bio").toUpperCase()}
              </h2>
              <p className="text-gray-300 text-lg whitespace-pre-wrap">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Projects */}
          {profile.projects && (
            <div>
              <h2 className="text-sm uppercase tracking-widest text-gray-600 mb-2">
                {"// "}{tDashboard("projects").toUpperCase()}
              </h2>
              <p className="text-gray-300 whitespace-pre-wrap">
                {profile.projects}
              </p>
            </div>
          )}

          {/* Skills */}
          {profile.skills.length > 0 && (
            <div>
              <h2 className="text-sm uppercase tracking-widest text-gray-600 mb-3">
                {"// "}{tDashboard("skills").toUpperCase()}
              </h2>
              <div className="flex flex-wrap">
                {profile.skills.map((skill, i) => (
                  <SkillTag key={i} label={skill} />
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {profile.languages.length > 0 && (
            <div>
              <h2 className="text-sm uppercase tracking-widest text-gray-600 mb-3">
                {"// "}{tDashboard("languages").toUpperCase()}
              </h2>
              <div className="flex flex-wrap">
                {profile.languages.map((lang, i) => (
                  <SkillTag key={i} label={lang} secondary />
                ))}
              </div>
            </div>
          )}

          {/* Availability */}
          {profile.availability && (
            <div className="border-t border-gray-800 pt-6">
              <h2 className="text-sm uppercase tracking-widest text-gray-600 mb-2">
                {"// "}{tDashboard("availability").toUpperCase()}
              </h2>
              <p className="text-white text-xl">{profile.availability}</p>
            </div>
          )}

          {/* Location */}
          {(profile.location?.city || profile.location?.country || profile.isRemote) && (
            <div>
              <h2 className="text-sm uppercase tracking-widest text-gray-600 mb-2 flex items-center gap-2">
                {"// "}{tDashboard("location").toUpperCase()} <MapPin size={14} />
              </h2>
              <div className="flex items-center gap-4 text-white">
                {profile.location?.city && profile.location?.country && (
                  <span>{profile.location.city}, {profile.location.country}</span>
                )}
                {profile.isRemote && (
                  <span className="border border-gray-600 px-2 py-1 text-sm text-gray-400">
                    {tDashboard("remoteAvailable")}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="text-xs text-gray-700 uppercase tracking-widest pt-4 border-t border-gray-900">
            {t("recordCreated")}: {new Date(profile.createdAt).toLocaleDateString()}
          </div>
        </div>
      </RetroCard>
    </div>
  );
}
