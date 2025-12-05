import { getTranslations } from "next-intl/server";
import { RetroButton } from "@/components/RetroButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function HomePage() {
  const t = await getTranslations("HomePage");
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12 text-center animate-in fade-in duration-1000">
      <div className="space-y-6">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white retro-glow">
          {t("title")}
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto tracking-wide">
          {t("subtitle")}
        </p>
      </div>

      <div className="flex gap-6">
        <RetroButton href="/talents" className="text-2xl px-8 py-4">
          {t("cta")}
        </RetroButton>
        {!session && (
          <RetroButton
            href="/login"
            variant="secondary"
            className="text-2xl px-8 py-4"
          >
            {t("cta") === "Explore Talents" ? "AUTHENTICATE" : "CONNEXION"}
          </RetroButton>
        )}
      </div>
    </div>
  );
}
