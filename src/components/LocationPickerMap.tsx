"use client";

import { useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
// @ts-expect-error - Leaflet CSS import
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet with Next.js
const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = markerIcon;

interface LocationPickerMapProps {
  position: { lat: number | null; lng: number | null };
  onPositionChange: (lat: number, lng: number) => void;
  translations: {
    clickToSelect: string;
    selectedPosition: string;
  };
}

function MapClickHandler({
  onPositionChange,
}: {
  onPositionChange: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e) => {
      onPositionChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPickerMap({
  position,
  onPositionChange,
  translations,
}: LocationPickerMapProps) {
  const mapRef = useRef<L.Map | null>(null);

  // Default center (world view or user's position if available)
  const defaultCenter: [number, number] = position.lat && position.lng 
    ? [position.lat, position.lng] 
    : [20, 0];
  
  const defaultZoom = position.lat && position.lng ? 10 : 2;

  return (
    <div className="space-y-3">
      <div className="h-[300px] border-2 border-gray-700 relative">
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%", background: "#000" }}
          className="retro-map"
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <MapClickHandler onPositionChange={onPositionChange} />
          {position.lat && position.lng && (
            <Marker position={[position.lat, position.lng]} icon={markerIcon} />
          )}
        </MapContainer>
        
        {/* Instructions overlay */}
        <div className="absolute bottom-2 left-2 right-2 bg-black/80 border border-gray-700 px-3 py-2 text-sm text-gray-400 z-1000">
          {position.lat && position.lng ? (
            <span>
              {translations.selectedPosition}: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
            </span>
          ) : (
            <span>{translations.clickToSelect}</span>
          )}
        </div>
      </div>
    </div>
  );
}
