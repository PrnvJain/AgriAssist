import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  LayersControl,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [drawnItems, setDrawnItems] = useState(null);
  const [center, setCenter] = useState([0, 0]);
  const [graphUrl, setGraphUrl] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCenter([position.coords.latitude, position.coords.longitude]);
      });
    }
  }, []);

  const handleCreated = (e) => {
    const { layer } = e;
    setDrawnItems(layer);
  };

  const handleSubmit = async () => {
    if (drawnItems) {
      const type = drawnItems.toGeoJSON().geometry.type;
      if (type === "Polygon") {
        const coordinates = drawnItems.toGeoJSON().geometry.coordinates[0];
        console.log("Coordinates:", coordinates);

        const payload = {
          coordinates,
          fromDate: "2023-01-01",
          toDate: "2023-12-31",
        };

        try {
          const response = await fetch("http://localhost:5000/getveg", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (response.ok) {
            const data = await response.json();
            setGraphUrl(data.graph_url);
          } else {
            console.error("Failed to fetch vegetation data:", await response.text());
          }
        } catch (error) {
          console.error("Error submitting coordinates:", error);
        }
      } else {
        alert("Please draw a polygon.");
      }
    } else {
      alert("Please draw a polygon.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {center[0] !== 0 && (
      <div className="ml-[125%]">
      <div className="flex flex-col items-center w-[800px] h-[700px]">
        <MapContainer
          center={center}
          zoom={19}
          className="h-[800px] w-[700px] border-2 border-gray-300 rounded-lg shadow-md"
          whenCreated={setMap}
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer name="OpenStreetMap">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer checked name="Satellite">
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles &copy; Esri &mdash"
              />
            </LayersControl.BaseLayer>
          </LayersControl>
          <FeatureGroup>
            <EditControl
              position="topright"
              onCreated={handleCreated}
              draw={{
                rectangle: false,
                polygon: true,
                circle: false,
                circlemarker: false,
                marker: false,
                polyline: false,
              }}
            />
          </FeatureGroup>
        </MapContainer>
        <button
          className="bg-[rgb(13,96,13)] text-white px-6 py-2 mt-6 rounded-lg text-lg hover:bg-green-700 active:bg-green-800 transition duration-300"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
    
     
      )}
      {graphUrl && (
        <div className="text-center mt-8">
          <h3 className="text-lg font-semibold mb-4">Vegetation Graph:</h3>
          <img
            src={`http://localhost:5000${graphUrl}`}
            alt="Vegetation Graph"
            className="border rounded-md shadow-md mx-auto"
          />
        </div>
      )}
    </div>
  );
};

export default MapComponent;
