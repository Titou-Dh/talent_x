import { getTranslations } from "next-intl/server";
import MapWrapper from "./MapWrapper";

export default async function MapPage() {
  const t = await getTranslations("Map");
  const tCommon = await getTranslations("Common");

  const translations = {
    countries: t("countries"),
    cities: t("cities"),
    remoteTalents: t("remoteTalents"),
    totalTalents: t("totalTalents"),
    viewProfile: t("viewProfile"),
    noTalents: t("noTalents"),
    loading: tCommon("loading"),
  };

  return (
    <div className="space-y-8">
      <div className="border-b-2 border-white pb-4 mb-8">
        <h1 className="text-5xl font-bold tracking-tighter">{t("title")}</h1>
        <p className="text-gray-500 mt-2 uppercase tracking-widest">
          {"// "}
          {t("subtitle")}
        </p>
      </div>

      <MapWrapper translations={translations} />
    </div>
  );
}
