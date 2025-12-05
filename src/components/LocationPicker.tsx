"use client";

import dynamic from "next/dynamic";

const LocationPickerMap = dynamic(
  () => import("./LocationPickerMap").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] border-2 border-gray-700 flex items-center justify-center bg-black">
        <div className="inline-block w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    ),
  }
);

interface LocationPickerProps {
  position: { lat: number | null; lng: number | null };
  onPositionChange: (lat: number, lng: number) => void;
  translations: {
    clickToSelect: string;
    selectedPosition: string;
  };
}

export default function LocationPicker({
  position,
  onPositionChange,
  translations,
}: LocationPickerProps) {
  return (
    <LocationPickerMap
      position={position}
      onPositionChange={onPositionChange}
      translations={translations}
    />
  );
}
