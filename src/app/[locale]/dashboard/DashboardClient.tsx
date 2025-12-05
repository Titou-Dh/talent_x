"use client";
import { useState } from "react";
import { useRouter } from "@/navigation";
import { useTranslations } from "next-intl";
import { RetroCard } from "@/components/RetroCard";
import { RetroButton } from "@/components/RetroButton";
import { SkillTag } from "@/components/SkillTag";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import LocationPicker from "@/components/LocationPicker";
import { Pencil, Plus, X, Save, MapPin } from "lucide-react";

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

interface DashboardClientProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
  profile: ProfileData | null;
}

export default function DashboardClient({
  user,
  profile: initialProfile,
}: DashboardClientProps) {
  const router = useRouter();
  const t = useTranslations("Dashboard");
  const [profile, setProfile] = useState<ProfileData | null>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newLanguage, setNewLanguage] = useState("");

  const [formData, setFormData] = useState({
    displayName: profile?.displayName || user.name || "",
    headline: profile?.headline || "",
    bio: profile?.bio || "",
    projects: profile?.projects || "",
    skills: profile?.skills || [],
    languages: profile?.languages || [],
    availability: profile?.availability || "Available",
    location: {
      city: profile?.location?.city || "",
      country: profile?.location?.country || "",
      coordinates: {
        lat: profile?.location?.coordinates?.lat || null as number | null,
        lng: profile?.location?.coordinates?.lng || null as number | null,
      },
    },
    isRemote: profile?.isRemote || false,
  });

  const handleCreateProfile = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const newProfile = await res.json();
        setProfile(newProfile);
        setIsCreating(false);
        router.refresh();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to create profile");
      }
    } catch {
      alert("Failed to create profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!profile) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/profiles/${profile._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const updatedProfile = await res.json();
        setProfile(updatedProfile);
        setIsEditing(false);
        router.refresh();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to update profile");
      }
    } catch {
      alert("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    });
  };

  const addLanguage = () => {
    if (
      newLanguage.trim() &&
      !formData.languages.includes(newLanguage.trim())
    ) {
      setFormData({
        ...formData,
        languages: [...formData.languages, newLanguage.trim()],
      });
      setNewLanguage("");
    }
  };

  const removeLanguage = (lang: string) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter((l) => l !== lang),
    });
  };

  const renderForm = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm uppercase mb-2 text-gray-400 tracking-widest">
          {t("displayName")} *
        </label>
        <input
          type="text"
          value={formData.displayName}
          onChange={(e) =>
            setFormData({ ...formData, displayName: e.target.value })
          }
          className="w-full bg-black border-2 border-gray-700 p-3 text-white focus:border-white focus:outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm uppercase mb-2 text-gray-400 tracking-widest">
          {t("headline")}
        </label>
        <input
          type="text"
          value={formData.headline}
          onChange={(e) =>
            setFormData({ ...formData, headline: e.target.value })
          }
          placeholder={t("headlinePlaceholder")}
          className="w-full bg-black border-2 border-gray-700 p-3 text-white focus:border-white focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm uppercase mb-2 text-gray-400 tracking-widest">
          {t("bio")}
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={4}
          className="w-full bg-black border-2 border-gray-700 p-3 text-white focus:border-white focus:outline-none resize-none"
        />
      </div>

      <div>
        <label className="block text-sm uppercase mb-2 text-gray-400 tracking-widest">
          {t("projects")}
        </label>
        <textarea
          value={formData.projects}
          onChange={(e) =>
            setFormData({ ...formData, projects: e.target.value })
          }
          rows={3}
          placeholder={t("projectsPlaceholder")}
          className="w-full bg-black border-2 border-gray-700 p-3 text-white focus:border-white focus:outline-none resize-none"
        />
      </div>

      <div>
        <label className="block text-sm uppercase mb-2 text-gray-400 tracking-widest">
          {t("skills")}
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
            placeholder={t("addSkill")}
            className="flex-1 bg-black border-2 border-gray-700 p-2 text-white focus:border-white focus:outline-none"
          />
          <button
            type="button"
            onClick={addSkill}
            className="border-2 border-gray-700 px-3 hover:bg-white hover:text-black"
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 border border-white px-2 py-1 text-sm"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="hover:text-red-400"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm uppercase mb-2 text-gray-400 tracking-widest">
          {t("languages")}
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), addLanguage())
            }
            placeholder={t("addLanguage")}
            className="flex-1 bg-black border-2 border-gray-700 p-2 text-white focus:border-white focus:outline-none"
          />
          <button
            type="button"
            onClick={addLanguage}
            className="border-2 border-gray-700 px-3 hover:bg-white hover:text-black"
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.languages.map((lang, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 border border-gray-500 px-2 py-1 text-sm text-gray-400"
            >
              {lang}
              <button
                type="button"
                onClick={() => removeLanguage(lang)}
                className="hover:text-red-400"
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm uppercase mb-2 text-gray-400 tracking-widest">
          {t("availability")}
        </label>
        <select
          value={formData.availability}
          onChange={(e) =>
            setFormData({ ...formData, availability: e.target.value })
          }
          className="w-full bg-black border-2 border-gray-700 p-3 text-white focus:border-white focus:outline-none"
        >
          <option value="Available">{t("availabilityOptions.available")}</option>
          <option value="Open to offers">{t("availabilityOptions.openToOffers")}</option>
          <option value="Busy">{t("availabilityOptions.busy")}</option>
          <option value="Not available">{t("availabilityOptions.notAvailable")}</option>
        </select>
      </div>

      {/* Location Section */}
      <div className="border-t border-gray-800 pt-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <MapPin size={18} /> {t("location")}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm uppercase mb-2 text-gray-400 tracking-widest">
              {t("city")}
            </label>
            <input
              type="text"
              value={formData.location.city}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  location: { ...formData.location, city: e.target.value },
                })
              }
              placeholder={t("cityPlaceholder")}
              className="w-full bg-black border-2 border-gray-700 p-3 text-white focus:border-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm uppercase mb-2 text-gray-400 tracking-widest">
              {t("country")}
            </label>
            <input
              type="text"
              value={formData.location.country}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  location: { ...formData.location, country: e.target.value },
                })
              }
              placeholder={t("countryPlaceholder")}
              className="w-full bg-black border-2 border-gray-700 p-3 text-white focus:border-white focus:outline-none"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm uppercase mb-2 text-gray-400 tracking-widest">
            {t("selectPosition")}
          </label>
          <LocationPicker
            position={{
              lat: formData.location.coordinates.lat,
              lng: formData.location.coordinates.lng,
            }}
            onPositionChange={(lat, lng) =>
              setFormData({
                ...formData,
                location: {
                  ...formData.location,
                  coordinates: { lat, lng },
                },
              })
            }
            translations={{
              clickToSelect: t("clickToSelectPosition"),
              selectedPosition: t("selectedPosition"),
            }}
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isRemote"
            checked={formData.isRemote}
            onChange={(e) =>
              setFormData({ ...formData, isRemote: e.target.checked })
            }
            className="w-5 h-5 bg-black border-2 border-gray-700"
          />
          <label htmlFor="isRemote" className="text-gray-400 uppercase tracking-widest text-sm">
            {t("remoteAvailable")}
          </label>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <RetroButton
          onClick={isCreating ? handleCreateProfile : handleUpdateProfile}
          disabled={isLoading || !formData.displayName}
          className="flex-1"
        >
          <Save size={18} />
          {isLoading ? t("saving") : t("save")}
        </RetroButton>
        <RetroButton
          variant="secondary"
          onClick={() => {
            setIsEditing(false);
            setIsCreating(false);
            if (profile) {
              setFormData({
                displayName: profile.displayName,
                headline: profile.headline || "",
                bio: profile.bio || "",
                projects: profile.projects || "",
                skills: profile.skills,
                languages: profile.languages,
                availability: profile.availability || "Available",
                location: {
                  city: profile.location?.city || "",
                  country: profile.location?.country || "",
                  coordinates: {
                    lat: profile.location?.coordinates?.lat || null,
                    lng: profile.location?.coordinates?.lng || null,
                  },
                },
                isRemote: profile.isRemote || false,
              });
            }
          }}
        >
          {t("cancel")}
        </RetroButton>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* User Info Header */}
      <div className="border-b-2 border-white pb-4">
        <h1 className="text-5xl font-bold tracking-tighter">
          {t("welcome").toUpperCase()}, {user.name?.toUpperCase() || user.email?.split("@")[0].toUpperCase()}
        </h1>
        <p className="text-gray-500 mt-2 uppercase tracking-widest">
          {"// "}{t("role")}: {user.role}{" | "}{t("sessionActive")}
        </p>
      </div>

      {/* Profile Section */}
      <RetroCard>
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
          <h2 className="text-2xl font-bold">{t("yourProfile").toUpperCase()}</h2>
          {profile && !isEditing && (
            <RetroButton
              variant="secondary"
              onClick={() => setIsEditing(true)}
              className="text-sm"
            >
              <Pencil size={16} /> {t("editProfile").toUpperCase()}
            </RetroButton>
          )}
        </div>

        {isEditing || isCreating ? (
          renderForm()
        ) : profile ? (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-3xl font-bold text-white">
                  {profile.displayName}
                </h3>
                {profile.headline && (
                  <p className="text-gray-400 mt-1">{profile.headline}</p>
                )}
              </div>
              {profile.verified && <VerifiedBadge />}
            </div>

            {profile.bio && (
              <div>
                <p className="text-sm uppercase text-gray-600 mb-1">{"// "}{t("bio")}</p>
                <p className="text-gray-300">{profile.bio}</p>
              </div>
            )}

            {profile.projects && (
              <div>
                <p className="text-sm uppercase text-gray-600 mb-1">
                  {"// "}{t("projects")}
                </p>
                <p className="text-gray-300">{profile.projects}</p>
              </div>
            )}

            {profile.skills.length > 0 && (
              <div>
                <p className="text-sm uppercase text-gray-600 mb-2">
                  {"// "}{t("skills")}
                </p>
                <div className="flex flex-wrap">
                  {profile.skills.map((skill, i) => (
                    <SkillTag key={i} label={skill} />
                  ))}
                </div>
              </div>
            )}

            {profile.languages.length > 0 && (
              <div>
                <p className="text-sm uppercase text-gray-600 mb-2">
                  {"// "}{t("languages")}
                </p>
                <div className="flex flex-wrap">
                  {profile.languages.map((lang, i) => (
                    <SkillTag key={i} label={lang} secondary />
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-gray-800 pt-4">
              <p className="text-sm uppercase text-gray-600 mb-1">
                {"// "}{t("availability")}
              </p>
              <p className="text-white">{profile.availability}</p>
            </div>

            <div className="pt-4">
              <RetroButton href={`/talents/${profile._id}`} variant="secondary">
                {t("viewPublic").toUpperCase()}
              </RetroButton>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">
              {t("noProfile")}
            </p>
            <RetroButton onClick={() => setIsCreating(true)}>
              <Plus size={18} /> {t("createProfile").toUpperCase()}
            </RetroButton>
          </div>
        )}
      </RetroCard>

      {/* Quick Stats */}
      {profile && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RetroCard>
            <div className="text-center">
              <p className="text-4xl font-bold text-white">
                {profile.skills.length}
              </p>
              <p className="text-gray-600 uppercase tracking-widest text-sm mt-2">
                {t("skills")}
              </p>
            </div>
          </RetroCard>
          <RetroCard>
            <div className="text-center">
              <p className="text-4xl font-bold text-white">
                {profile.languages.length}
              </p>
              <p className="text-gray-600 uppercase tracking-widest text-sm mt-2">
                {t("languages")}
              </p>
            </div>
          </RetroCard>
          <RetroCard>
            <div className="text-center">
              <p className="text-4xl font-bold text-white">
                {profile.verified ? "YES" : "NO"}
              </p>
              <p className="text-gray-600 uppercase tracking-widest text-sm mt-2">
                {t("verified")}
              </p>
            </div>
          </RetroCard>
        </div>
      )}
    </div>
  );
}
