"use client";

import dynamic from "next/dynamic";
import { ComponentType } from "react";

interface MapClientProps {
  translations: {
    countries: string;
    cities: string;
    remoteTalents: string;
    totalTalents: string;
    viewProfile: string;
    noTalents: string;
    loading: string;
  };
}

const MapClient: ComponentType<MapClientProps> = dynamic(
  () => import("./MapClient").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] flex items-center justify-center border-2 border-gray-800 bg-black">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-white border-t-transparent animate-spin" />
          <p className="text-gray-500 mt-4 uppercase tracking-widest">
            Loading map...
          </p>
        </div>
      </div>
    ),
  }
);

export default function MapWrapper({ translations }: MapClientProps) {
  return <MapClient translations={translations} />;
}
