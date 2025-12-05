"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Link } from "@/navigation";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet with Next.js
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const verifiedIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: "verified-marker",
});

L.Marker.prototype.options.icon = defaultIcon;

interface TalentProfile {
  _id: string;
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
  isRemote: boolean;
}

interface MapStats {
  countries: number;
  cities: number;
  remoteTalents: number;
  totalTalents: number;
}

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

export default function MapClient({ translations }: MapClientProps) {
  const [profiles, setProfiles] = useState<TalentProfile[]>([]);
  const [stats, setStats] = useState<MapStats>({
    countries: 0,
    cities: 0,
    remoteTalents: 0,
    totalTalents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const res = await fetch("/api/map");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setProfiles(data.profiles);
        setStats(data.stats);
      } catch (err) {
        setError("Failed to load map data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
  }, []);

  const talentsWithCoords = profiles.filter(
    (p) => p.location?.coordinates?.lat && p.location?.coordinates?.lng
  );

  if (loading) {
    return (
      <div className="h-[500px] flex items-center justify-center border-2 border-gray-800 bg-black">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-white border-t-transparent animate-spin" />
          <p className="text-gray-500 mt-4 uppercase tracking-widest">
            {translations.loading}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[500px] flex items-center justify-center border-2 border-gray-800 bg-black">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Map Container */}
      <div className="h-[500px] border-2 border-gray-800 relative">
        {talentsWithCoords.length > 0 ? (
          <MapContainer
            center={[20, 0]}
            zoom={2}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%", background: "#000" }}
            className="retro-map"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {talentsWithCoords.map((profile) => (
              <Marker
                key={profile._id}
                position={[
                  profile.location!.coordinates!.lat!,
                  profile.location!.coordinates!.lng!,
                ]}
                icon={profile.verified ? verifiedIcon : defaultIcon}
              >
                <Popup className="retro-popup">
                  <div className="bg-black text-white p-2 min-w-[200px]">
                    <h3 className="font-bold text-lg border-b border-gray-700 pb-1">
                      {profile.displayName}
                      {profile.verified && (
                        <span className="ml-2 text-xs border border-white px-1">
                          ✓
                        </span>
                      )}
                    </h3>
                    {profile.headline && (
                      <p className="text-gray-400 text-sm mt-1">
                        {profile.headline}
                      </p>
                    )}
                    {profile.location?.city && profile.location?.country && (
                      <p className="text-gray-500 text-xs mt-1 uppercase">
                        {profile.location.city}, {profile.location.country}
                      </p>
                    )}
                    {profile.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {profile.skills.slice(0, 3).map((skill, i) => (
                          <span
                            key={i}
                            className="text-xs border border-gray-600 px-1"
                          >
                            {skill}
                          </span>
                        ))}
                        {profile.skills.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{profile.skills.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    <Link
                      href={`/talents/${profile._id}`}
                      className="block mt-3 text-center border border-white px-2 py-1 text-sm hover:bg-white hover:text-black transition-colors"
                    >
                      {translations.viewProfile}
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500 uppercase tracking-widest">
              {translations.noTalents}
            </p>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border-2 border-gray-800 p-4 text-center">
          <p className="text-4xl font-bold text-white">{stats.totalTalents}</p>
          <p className="text-gray-600 uppercase tracking-widest text-sm mt-2">
            {translations.totalTalents}
          </p>
        </div>
        <div className="border-2 border-gray-800 p-4 text-center">
          <p className="text-4xl font-bold text-white">{stats.countries}</p>
          <p className="text-gray-600 uppercase tracking-widest text-sm mt-2">
            {translations.countries}
          </p>
        </div>
        <div className="border-2 border-gray-800 p-4 text-center">
          <p className="text-4xl font-bold text-white">{stats.cities}</p>
          <p className="text-gray-600 uppercase tracking-widest text-sm mt-2">
            {translations.cities}
          </p>
        </div>
        <div className="border-2 border-gray-800 p-4 text-center">
          <p className="text-4xl font-bold text-white">{stats.remoteTalents}</p>
          <p className="text-gray-600 uppercase tracking-widest text-sm mt-2">
            {translations.remoteTalents}
          </p>
        </div>
      </div>
    </div>
  );
}
