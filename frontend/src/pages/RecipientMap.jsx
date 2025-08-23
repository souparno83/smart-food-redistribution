import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  Circle,
  useLoadScript,
  InfoWindow,
} from "@react-google-maps/api";

const mapContainerStyle = { width: "100%", height: "500px" };
const centerDefault = { lat: 22.5726, lng: 88.3639 }; // Kolkata central

// Food type colors for donors
const foodColors = {
  Vegetables: "green",
  Fruits: "orange",
  Grains: "brown",
  Dairy: "blue",
  Other: "purple",
};

// Custom SVG path for recipient marker (pin style)
const recipientPinPath =
  "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z";

const RecipientMap = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [userLocation, setUserLocation] = useState(centerDefault);
  const [donors, setDonors] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        () => setUserLocation(centerDefault) // fallback if denied
      );
    } else {
      setUserLocation(centerDefault);
    }

    // Fetch donors
    fetch("http://localhost:5000/api/map/donors")
      .then((res) => res.json())
      .then(setDonors)
      .catch(console.error);

    // Fetch recipients
    fetch("http://localhost:5000/api/map/recipients")
      .then((res) => res.json())
      .then(setRecipients)
      .catch(console.error);
  }, []);

  if (loadError) return <p>Error loading maps</p>;
  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Find Nearby Food Recipients 🗺️</h2>
      <div className="card shadow p-4">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={14}
          center={userLocation || centerDefault}
          options={{ gestureHandling: "greedy" }} // prevents auto-panning
        >
          {/* User marker */}
          <Marker position={userLocation} label="You" />

          {/* 5 km radius circle */}
          <Circle
            center={userLocation}
            radius={5000}
            options={{
              fillColor: "blue",
              fillOpacity: 0.1,
              strokeColor: "blue",
              strokeWeight: 1,
            }}
          />

          {/* Donor markers (always visible) */}
          {donors.map((d) => (
            <Marker
              key={d.id}
              position={{ lat: d.lat, lng: d.lng }}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: foodColors[d.type] || "purple",
                fillOpacity: 1,
                strokeWeight: 1,
              }}
              onClick={() => setSelectedMarker({ type: "donor", data: d })}
            />
          ))}

          {/* Recipient markers (pin style) */}
          {recipients.map((r) => (
            <Marker
              key={r.id}
              position={{ lat: r.lat, lng: r.lng }}
              icon={{
                path: recipientPinPath,
                fillColor: "red",
                fillOpacity: 0.9,
                strokeColor: "white",
                strokeWeight: 2,
                scale: 1.5,
                anchor: new window.google.maps.Point(12, 24),
              }}
              onClick={() => setSelectedMarker({ type: "recipient", data: r })}
            />
          ))}

          {/* InfoWindow */}
          {selectedMarker && (
            <InfoWindow
              position={{
                lat: selectedMarker.data.lat,
                lng: selectedMarker.data.lng,
              }}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div>
                {selectedMarker.type === "donor" ? (
                  <>
                    <strong>{selectedMarker.data.name}</strong>
                    <p>
                      Food:{" "}
                      <span
                        style={{ color: foodColors[selectedMarker.data.type] }}
                      >
                        {selectedMarker.data.type}
                      </span>
                    </p>
                  </>
                ) : (
                  <>
                    <strong>{selectedMarker.data.name}</strong>
                    <p>Recipient</p>
                  </>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>

        {/* Legend */}
        <p className="mt-3 text-center text-muted">
          <span style={{ color: "green", fontWeight: "bold" }}>●</span> Vegetables{" "}
          <span style={{ color: "orange", fontWeight: "bold" }}>●</span> Fruits{" "}
          <span style={{ color: "brown", fontWeight: "bold" }}>●</span> Grains{" "}
          <span style={{ color: "blue", fontWeight: "bold" }}>●</span> Dairy{" "}
          <span style={{ color: "purple", fontWeight: "bold" }}>●</span> Other{" "}
          <span style={{ color: "red", fontSize: "18px" }}>📍</span> Recipients
        </p>
      </div>
    </div>
  );
};

export default RecipientMap;
