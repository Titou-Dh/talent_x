import { getTranslations } from "next-intl/server";
import dbConnect from "@/lib/db";
import Profile from "@/models/Profile";
import { RetroCard } from "@/components/RetroCard";
import { SkillTag } from "@/components/SkillTag";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { Link } from "@/navigation";

interface ProfileData {
  _id: string;
  displayName: string;
  headline?: string;
  bio?: string;
  skills: string[];
  languages: string[];
  availability?: string;
  verified: boolean;
}

interface MongoProfile {
  _id: { toString(): string };
  displayName: string;
  headline?: string;
  bio?: string;
  skills?: string[];
  languages?: string[];
  availability?: string;
  verified?: boolean;
}

async function getProfiles(): Promise<ProfileData[]> {
  await dbConnect();
  const profiles = await Profile.find({}).sort({ createdAt: -1 }).lean();

  return (profiles as unknown as MongoProfile[]).map((p) => ({
    _id: p._id.toString(),
    displayName: p.displayName,
    headline: p.headline,
    bio: p.bio,
    skills: p.skills || [],
    languages: p.languages || [],
    availability: p.availability,
    verified: p.verified || false,
  }));
}

export default async function TalentsPage() {
  const t = await getTranslations("Talents");
  const profiles = await getProfiles();

  return (
    <div className="space-y-8">
      <div className="border-b-2 border-white pb-4 mb-8">
        <h1 className="text-5xl font-bold tracking-tighter">{t("title")}</h1>
        <p className="text-gray-500 mt-2 uppercase tracking-widest">
          {"// "}{profiles.length} {t("recordsFound")}
        </p>
      </div>

      {profiles.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl text-gray-500 mb-4">{t("noRecords")}</p>
          <p className="text-gray-600">
            {t("beFirst")}{" "}
            <Link href="/register" className="text-white underline">
              {t("createProfile")}
            </Link>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <RetroCard key={profile._id} className="cursor-pointer">
              <Link href={`/talents/${profile._id}`}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {profile.displayName}
                      </h2>
                      {profile.headline && (
                        <p className="text-gray-400 mt-1">{profile.headline}</p>
                      )}
                    </div>
                    {profile.verified && <VerifiedBadge />}
                  </div>

                  {profile.bio && (
                    <p className="text-gray-500 text-sm line-clamp-2">
                      {profile.bio}
                    </p>
                  )}

                  {profile.skills.length > 0 && (
                    <div className="flex flex-wrap">
                      {profile.skills.slice(0, 4).map((skill, i) => (
                        <SkillTag key={i} label={skill} />
                      ))}
                      {profile.skills.length > 4 && (
                        <SkillTag
                          label={`+${profile.skills.length - 4}`}
                          secondary
                        />
                      )}
                    </div>
                  )}

                  {profile.availability && (
                    <div className="text-sm text-gray-600 uppercase tracking-widest border-t border-gray-800 pt-3 mt-3">
                      {t("status")}: {profile.availability}
                    </div>
                  )}
                </div>
              </Link>
            </RetroCard>
          ))}
        </div>
      )}
    </div>
  );
}
