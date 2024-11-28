import React, { useState, useEffect } from "react";
import "./VegetationDetails.css";

const VegetationDetails = () => {
  const [imageBlob, setImageBlob] = useState(null);
  const [analysisReport, setAnalysisReport] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch vegetation graph data from the backend
  useEffect(() => {
    const fetchVegetationGraph = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Fetching NDVI image..."); // Debug log
        
        const response = await fetch("http://localhost:5000/ndvi-image");
        console.log("Response status:", response.status); // Debug log

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch vegetation graph.");
        }

        const contentType = response.headers.get("content-type");
        console.log("Content type:", contentType); // Debug log

        if (!contentType || !contentType.includes("image/")) {
          throw new Error("Invalid content type received from server");
        }

        const blob = await response.blob();
        console.log("Blob size:", blob.size); // Debug log
        
        const imageUrl = URL.createObjectURL(blob);
        setImageBlob(imageUrl);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching vegetation graph:", err);
        setError(err.message || "Unable to load vegetation graph. Please try again later.");
        setLoading(false);
      }
    };

    fetchVegetationGraph();

    return () => {
      if (imageBlob) {
        URL.revokeObjectURL(imageBlob);
      }
    };
  }, []);

  // Fetch analysis report from the public folder
  useEffect(() => {
    const fetchAnalysisReport = async () => {
      try {
        const response = await fetch("/output.json");

        if (!response.ok) {
          throw new Error("Failed to fetch analysis report.");
        }

        const data = await response.json();
        setAnalysisReport(data.analysisReport);
      } catch (err) {
        console.error("Error fetching analysis report:", err);
        setError("Unable to load analysis report. Please try again later.");
      }
    };

    fetchAnalysisReport();
  }, []);

  const renderImage = () => {
    if (loading) {
      return (
        <div className="text-center mt-8 text-gray-600">
          <div className="animate-pulse">Loading Vegetation Graph...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center mt-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        </div>
      );
    }

    if (imageBlob) {
      return (
        <div className="text-center mt-8">
          <h3 className="text-lg font-semibold mb-4">Vegetation Graph:</h3>
          <img
            src={imageBlob}
            alt="Vegetation Graph"
            className="border rounded-md shadow-md mx-auto w-4/5 md:w-3/5"
            onError={(e) => {
              console.error("Image failed to load");
              setError("Failed to display the image");
            }}
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="vegetation-details">
      <h1 className="text-2xl font-semibold text-center my-4">Vegetation Details</h1>

      {/* NDVI Graph Section */}
      {renderImage()}

      {/* Analysis Report Section */}
      {analysisReport ? (
        <div className="mt-12 bg-white border rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Analysis Report</h2>
          <h3 className="text-lg mb-2">
            Recent Vegetation Cycle Detected:{" "}
            {analysisReport[0] ? (
              <span className="text-green-600 font-bold">Yes</span>
            ) : (
              <span className="text-red-600 font-bold">No</span>
            )}
          </h3>
          <h3 className="text-lg mb-2">Latest NDVI Data:</h3>
          <pre className="bg-gray-100 rounded-md p-4 text-sm text-gray-700 overflow-x-auto">
            {JSON.stringify(analysisReport[1], null, 2)}
          </pre>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 mt-8">{error}</div>
      ) : (
        <div className="text-center mt-8 text-gray-600">Loading Analysis Report...</div>
      )}
    </div>
  );
};

export default VegetationDetails;