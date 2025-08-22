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

// Food type colors
const foodColors = {
  Vegetables: "green",
  Fruits: "orange",
  Grains: "brown",
  Dairy: "blue",
  Other: "purple",
};

// Haversine formula to calculate distance in km
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

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
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation(centerDefault) // fallback if denied
      );
    } else {
      setUserLocation(centerDefault);
    }

    // Fetch donors from backend
    fetch("http://localhost:5000/api/map/donors")
      .then((res) => res.json())
      .then(setDonors)
      .catch(console.error);

    // Fetch recipients from backend
    fetch("http://localhost:5000/api/map/recipients")
      .then((res) => res.json())
      .then(setRecipients)
      .catch(console.error);
  }, []);

  if (loadError) return <p>Error loading maps</p>;
  if (!isLoaded) return <p>Loading map...</p>;

  // Filter donors within 5 km of user
  const nearbyDonors = donors.filter(
    (d) =>
      getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, d.lat, d.lng) <=
      5
  );

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Find Nearby Food Recipients 🗺️</h2>
      <div className="card shadow p-4">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={14}
          center={userLocation || centerDefault}
        >
          {/* User */}
          <Marker position={userLocation} label="You" />

          {/* 5 km radius circle */}
          <Circle
            center={userLocation}
            radius={5000}
            options={{ fillColor: "blue", fillOpacity: 0.1, strokeColor: "blue" }}
          />

          {/* Nearby donors */}
          {nearbyDonors.map((d) => (
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

          {/* All recipients */}
          {recipients.map((r) => (
            <Marker
              key={r.id}
              position={{ lat: r.lat, lng: r.lng }}
              onClick={() => setSelectedMarker({ type: "recipient", data: r })}
            />
          ))}

          {/* InfoWindow */}
          {selectedMarker && (
            <InfoWindow
              position={{ lat: selectedMarker.data.lat, lng: selectedMarker.data.lng }}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div>
                {selectedMarker.type === "donor" ? (
                  <>
                    <strong>{selectedMarker.data.name}</strong>
                    <p>
                      Food:{" "}
                      <span style={{ color: foodColors[selectedMarker.data.type] }}>
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

        <p className="mt-2 text-center text-muted">
          Green = Vegetables, Orange = Fruits, Blue = Dairy, Brown = Grains, Purple = Other
        </p>
      </div>
    </div>
  );
};

export default RecipientMap;
