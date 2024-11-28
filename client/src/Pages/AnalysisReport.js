import React, { useEffect, useState } from "react";
import '../Todo/TodoWrapper.css'
const AnalysisReport = () => {
  const [analysisReport, setAnalysisReport] = useState(null);
  const [error, setError] = useState(null);

  // Fetch analysisReport from output.json placed in the public folder
  useEffect(() => {
    const fetchAnalysisReport = async () => {
      try {
        // Fetch the JSON file from the public folder
        const response = await fetch("/output.json");

        if (!response.ok) {
          throw new Error("Failed to fetch output.json");
        }

        const data = await response.json();

        // Extract only the analysisReport
        const report = data.analysisReport;

        setAnalysisReport(report); // Set the analysis report data in state
      } catch (err) {
        setError(err.message); // Handle any errors
      }
    };

    fetchAnalysisReport(); // Call the function to fetch data
  }, []); // Empty dependency array ensures this only runs once (on component mount)

  // Show loading state while waiting for data
  if (!analysisReport) {
    return <div>Loading analysis report...</div>;
  }

  // Show error if something goes wrong
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Analysis Report</h2>
      <h3>Recent Vegetation Cycle Detected: {analysisReport[0] ? "Yes" : "No"}</h3>
      <h3>Latest NDVI Data</h3>
      <pre>{JSON.stringify(analysisReport[1], null, 2)}</pre>
    </div>
  );
};

export default AnalysisReport;