import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Maps from "../../public/Map.jpeg";
import {
  MapContainer,
  ImageOverlay,
  Polyline,
  Circle,
  CircleMarker,
} from "react-leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const MAP_SIZE = 4096;
const CENTER = MAP_SIZE / 2;


const ORIGINAL_MAP_SIZE = 2000;
const SCALE = MAP_SIZE / ORIGINAL_MAP_SIZE;


const VALID_RADIUS = 0.9 * CENTER;

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
  return Math.hypot(CENTER - midX, CENTER - midY) <= 400 * SCALE;
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

const generateZones = (planeStart, planeEnd) => {
  const zones = [];

  const previousRadius = (MAP_SIZE / 2) * Math.sqrt(2);
  let radius = 500 * SCALE; 

  let center;
  let d1, theta;

  const planeAngle = Math.atan2(
    planeEnd[1] - planeStart[1],
    planeEnd[0] - planeStart[0]
  );

  do {
    const hardshift = (previousRadius - radius) * Math.random();
    const angle = Math.random() * Math.PI * 2;

    center = [
      CENTER + hardshift * Math.cos(angle),
      CENTER - hardshift * Math.sin(angle),
    ];

    d1 = Math.hypot(
      center[0] - planeStart[0],
      center[1] - planeStart[1]
    );

    const angleToCenter = Math.atan2(
      center[1] - planeStart[1],
      center[0] - planeStart[0]
    );

    theta = Math.abs(planeAngle - angleToCenter);
    if (theta > Math.PI) theta = Math.abs(theta - 2 * Math.PI);

  } while ((d1 * Math.sin(theta)) > radius);

  zones.push({ center, radius });

  const shrinkRatios = [0.70, 0.60, 0.60, 0.65, 0.65, 0.65, 0.70];

  for (const shrink of shrinkRatios) {
    const prevRadius = radius;
    radius *= shrink;

    const hardshift =
      (prevRadius - radius) *
      Math.pow(Math.random(), 0.56);

    const angle = Math.random() * Math.PI * 2;

    center = [
      center[0] + hardshift * Math.cos(angle),
      center[1] - hardshift * Math.sin(angle),
    ];

    zones.push({ center, radius });
  }

  return zones;
};

const Map = ({ activePhase = 1, gameSeed = 0 }) => {
  const bounds = [
    [0, 0],
    [MAP_SIZE, MAP_SIZE],
  ];

  const [flightPath, setFlightPath] = useState([[0, 0], [0, 0]]);
  const [dashOffset, setDashOffset] = useState("0");
  const [zones, setZones] = useState([]);

  
  useEffect(() => {
    const { start, end } = generateFlightPath();
    setFlightPath([start, end]);
    setZones(generateZones(start, end));
  }, [gameSeed]);

useEffect(() => {
  const interval = setInterval(() => {
    setDashOffset((d) => String((parseInt(d, 10) - 6 + 120) % 120));
  }, 50);
  return () => clearInterval(interval);
}, []);


  return (
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
      <ImageOverlay url={Maps} bounds={bounds} />


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
  );
};

export default Map;
