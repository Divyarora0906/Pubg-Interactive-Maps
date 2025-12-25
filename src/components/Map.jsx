import React, { useEffect, useState, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Maps from "../../public/Map.jpeg";

import {
  MapContainer,
  ImageOverlay,
  Polyline,
  Circle,
  CircleMarker,
  Marker,
  Tooltip,
  useMapEvents,
} from "react-leaflet";

// ---------- FIX DEFAULT MARKER ----------
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ---------- MAP CONSTANTS ----------
const MAP_SIZE = 4096;
const CENTER = MAP_SIZE / 2;
const VALID_RADIUS = 0.9 * CENTER;

// 8×8 km world scale
const KM_PER_UNIT = 8 / 4096;

// ---------- HELPERS ----------
const randomPlanePoint = () => {
  const angle = Math.random() * Math.PI * 2;
  return [
    CENTER + VALID_RADIUS * Math.cos(angle),
    CENTER + VALID_RADIUS * Math.sin(angle),
  ];
};

const validPlaneRoute = (start, end) => {
  const midX = (start[0] + end[0]) / 2;
  const midY = (start[1] + end[1]) / 2;
  return Math.hypot(CENTER - midX, CENTER - midY) <= 400;
};

const generateFlightPath = () => {
  let start = randomPlanePoint();
  let end = randomPlanePoint();
  while (!validPlaneRoute(start, end)) {
    start = randomPlanePoint();
    end = randomPlanePoint();
  }
  return { start, end };
};

const generateZones = () => {
  const zones = [];
  let radius = 1200;
  let center = [CENTER, CENTER];

  const shrink = [0.7, 0.65, 0.65, 0.6, 0.6, 0.65, 0.7];

  zones.push({ center, radius });

  shrink.forEach((s) => {
    radius *= s;

    const shift = Math.random() * 200 - 100;
    center = [center[0] + shift, center[1] - shift];

    zones.push({ center, radius });
  });

  return zones;
};

// ---------- PIN ADDER (WITH BOUNDS CHECK) ----------
function AddPins({ markers, setMarkers }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      // ⭐ BLOCK OUTSIDE MAP CLICKS
      if (lat < 0 || lat > MAP_SIZE || lng < 0 || lng > MAP_SIZE) return;

      if (markers.length >= 4) return;

      const label =
        window.prompt("Enter label:", "Cover Anchor") ||
        `Pin ${markers.length + 1}`;

      setMarkers((prev) => [...prev, { lat, lng, label }]);
    },
  });

  return null;
}

// ---------- MAIN MAP ----------
const Map = ({ activePhase = 1, gameSeed = 0 }) => {
  const bounds = [
    [0, 0],
    [MAP_SIZE, MAP_SIZE],
  ];

  const mapRef = useRef(null);

  const [flightPath, setFlightPath] = useState([
    [0, 0],
    [0, 0],
  ]);
  const [dashOffset, setDashOffset] = useState("0");
  const [zones, setZones] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const saved = localStorage.getItem("igl_markers");
      if (saved) setMarkers(JSON.parse(saved));
    } catch (err) {
      console.error("Failed to load markers", err);
    }

    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem("igl_markers", JSON.stringify(markers));
    } catch (err) {
      console.error("Failed to save markers", err);
    }
  }, [markers, loaded]);

  // ---------- GENERATE PLANE + ZONES ----------
  useEffect(() => {
    const { start, end } = generateFlightPath();
    setFlightPath([start, end]);
    setZones(generateZones());
  }, [gameSeed]);

  // ---------- ANIMATE PATH ----------
  useEffect(() => {
    const interval = setInterval(() => {
      setDashOffset((d) => String((parseInt(d, 10) - 6 + 120) % 120));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const removeMarker = (index) => {
    setMarkers((prev) => prev.filter((_, i) => i !== index));
  };
  const totalDistanceKm = markers.reduce((sum, m, i) => {
    if (i === 0) return sum;
    const prev = markers[i - 1];
    const dx = m.lat - prev.lat;
    const dy = m.lng - prev.lng;
    return sum + Math.sqrt(dx * dx + dy * dy) * KM_PER_UNIT;
  }, 0);

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          zIndex: 9999,
          background: "#111",
          color: "#fff",
          padding: "8px 12px",
          borderRadius: "10px",
          fontWeight: 600,
          border: "1px solid #333",
        }}
      >
        Total Route: {totalDistanceKm.toFixed(2)} km
      </div>
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 9999,
        }}
      >
      </div>

      <div ref={mapRef}>
        <MapContainer
          center={[CENTER, CENTER]}
          zoom={-2}
          minZoom={-3}
          maxZoom={2}
          crs={L.CRS.Simple}
          style={{ height: "100vh", width: "100%" }}
          maxBounds={bounds}
          maxBoundsViscosity={1}
        >
          <ImageOverlay url={Maps} bounds={bounds} crossOrigin="anonymous" />

          <AddPins markers={markers} setMarkers={setMarkers} />

          {markers.length > 1 &&
            markers.map((m, i) => {
              if (i === 0) return null;

              const prev = markers[i - 1];

              const dx = m.lat - prev.lat;
              const dy = m.lng - prev.lng;

              const distKm = Math.sqrt(dx * dx + dy * dy) * KM_PER_UNIT;

              let bearing = (Math.atan2(dy, dx) * 180) / Math.PI;
              if (bearing < 0) bearing += 360;

              const mid = [(prev.lat + m.lat) / 2, (prev.lng + m.lng) / 2];

              return (
                <React.Fragment key={`line-${i}`}>
                  <Polyline
                    positions={[
                      [prev.lat, prev.lng],
                      [m.lat, m.lng],
                    ]}
                    pathOptions={{ color: "yellow", weight: 3 }}
                  />

                  <Marker
                    position={mid}
                    icon={L.divIcon({
                      className: "distance-label",
                      html: `${distKm.toFixed(2)} km • ${bearing.toFixed(0)}°`,
                      iconAnchor: [0, 0],
                    })}
                    interactive={false}
                  />
                </React.Fragment>
              );
            })}
          {markers.map((m, i) => (
            <Marker
              key={i}
              position={[m.lat, m.lng]}
              eventHandlers={{ click: () => removeMarker(i) }}
              icon={L.divIcon({
                html: `<div class="pin-circle">${i + 1}</div>`,
                iconAnchor: [12, 12],
              })}
            >
              <Tooltip permanent direction="top" offset={[0, -10]}>
                {m.label}
              </Tooltip>
            </Marker>
          ))}

          <Polyline
            positions={flightPath}
            pathOptions={{ color: "white", weight: 6 }}
          />
          <Polyline
            positions={flightPath}
            pathOptions={{
              color: "red",
              weight: 4,
              dashArray: "30 30",
              dashOffset,
            }}
          />

          <CircleMarker
            center={flightPath[0]}
            radius={8}
            pathOptions={{
              color: "white",
              fillColor: "white",
              fillOpacity: 1,
            }}
          />

          {/* ZONES */}
          {zones.map(
            (z, i) =>
              i + 1 <= activePhase && (
                <Circle
                  key={i}
                  center={z.center}
                  radius={z.radius}
                  pathOptions={{
                    color: "white",
                    weight: 2,
                    fillOpacity: 0,
                  }}
                />
              )
          )}
        </MapContainer>
      </div>
    </>
  );
};

export default Map;
