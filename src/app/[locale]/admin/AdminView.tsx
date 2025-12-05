"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { ShieldCheck, ShieldOff, Trash2, CheckCircle, XCircle } from "lucide-react";

export const AdminView = ({ profiles }: { profiles: any[] }) => {
  const [localProfiles, setLocalProfiles] = useState(profiles);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isToggling, setIsToggling] = useState<string | null>(null);
  const t = useTranslations("Admin");

  const toggleVerification = async (
    profileId: string,
    currentStatus: boolean
  ) => {
    setIsToggling(profileId);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId, verified: !currentStatus }),
      });

      if (res.ok) {
        setLocalProfiles(
          localProfiles.map((p) =>
            p._id === profileId ? { ...p, verified: !currentStatus } : p
          )
        );
      } else {
        alert("Failed to update verification status");
      }
    } finally {
      setIsToggling(null);
    }
  };

  const deleteProfile = async (profileId: string, displayName: string) => {
    if (!confirm(t("confirmDelete", { name: displayName }))) {
      return;
    }

    setIsDeleting(profileId);
    try {
      const res = await fetch(`/api/profiles/${profileId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setLocalProfiles(localProfiles.filter((p) => p._id !== profileId));
      } else {
        alert("Failed to delete profile");
      }
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-5xl font-bold mb-8 border-b-2 border-white pb-4">
        {t("title").toUpperCase()}
      </h1>
      
      <div className="mb-4 text-gray-400 uppercase tracking-widest text-sm">
        {"// "}{t("totalProfiles")}: {localProfiles.length}
      </div>

      <table className="w-full text-left border-2 border-gray-800">
        <thead className="bg-white text-black">
          <tr>
            <th className="p-4 text-xl">{t("user").toUpperCase()}</th>
            <th className="p-4 text-xl text-center">{t("verified").toUpperCase()}</th>
            <th className="p-4 text-xl text-center">{t("actions").toUpperCase()}</th>
          </tr>
        </thead>
        <tbody>
          {localProfiles.length === 0 ? (
            <tr>
              <td colSpan={3} className="p-8 text-center text-gray-500">
                {t("noProfiles")}
              </td>
            </tr>
          ) : (
            localProfiles.map((p) => (
              <tr
                key={p._id}
                className="border-b border-gray-800 hover:bg-gray-900 transition-colors"
              >
                <td className="p-4">
                  <div className="font-mono text-lg">{p.displayName}</div>
                  {p.headline && (
                    <div className="text-sm text-gray-500 mt-1">{p.headline}</div>
                  )}
                </td>
                <td className="p-4 text-center">
                  {p.verified ? (
                    <span className="inline-flex items-center gap-1 text-green-400">
                      <CheckCircle size={18} />
                      {t("true").toUpperCase()}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-gray-500">
                      <XCircle size={18} />
                      {t("false").toUpperCase()}
                    </span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => toggleVerification(p._id, p.verified)}
                      disabled={isToggling === p._id}
                      className={`
                        inline-flex items-center gap-2 border px-3 py-2 transition-all
                        ${p.verified 
                          ? "border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black" 
                          : "border-green-500 text-green-500 hover:bg-green-500 hover:text-black"
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                      title={p.verified ? t("unverify") : t("verify")}
                    >
                      {isToggling === p._id ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin" />
                      ) : p.verified ? (
                        <ShieldOff size={18} />
                      ) : (
                        <ShieldCheck size={18} />
                      )}
                      <span className="hidden sm:inline">
                        {p.verified ? t("unverify").toUpperCase() : t("verify").toUpperCase()}
                      </span>
                    </button>
                    
                    <button
                      onClick={() => deleteProfile(p._id, p.displayName)}
                      disabled={isDeleting === p._id}
                      className="inline-flex items-center gap-2 border border-red-500 text-red-500 px-3 py-2 hover:bg-red-500 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title={t("delete")}
                    >
                      {isDeleting === p._id ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                      <span className="hidden sm:inline">{t("delete").toUpperCase()}</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
