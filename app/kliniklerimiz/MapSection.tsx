"use client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import React from "react";

interface Branch {
  id: string;
  name: string;
  lat?: number;
  lng?: number;
}

const defaultCenter: [number, number] = [41.2867, 36.33];

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

function CenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

const MapSection = ({ branches }: { branches: Branch[] }) => {
  const markers = branches.filter(b => b.lat && b.lng);
  const center: [number, number] = markers.length === 1 ? [markers[0].lat as number, markers[0].lng as number] : defaultCenter;
  return (
    <MapContainer center={center} zoom={11} style={{ width: "100%", height: "100%" }} scrollWheelZoom={false}>
      <CenterMap center={center} />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {markers.map((b) => (
        <Marker key={b.id} position={[b.lat!, b.lng!]} icon={markerIcon}>
          <Popup>{b.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapSection; 