import React, { useState } from "react";
import "./Loan.css";
import axios from "axios"; // Import axios for API requests


const LocalCreditForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    aadharNumber: "",
    contactNumber: "",
    address: "",
    village: "",
    landArea: "",
    ownershipType: "owned",
    landUse: "agriculture",
    soilType: "",
    irrigation: "yes",
    cropTypes: "",
    averageYield: "",
  });
 
  const [formStatus, setFormStatus] = useState(""); // For status feedback

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send form data to the backend
      const response = await fetch("http://localhost:5000/local", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log("Response:", response);
      if (response.status === 200) {
        setFormStatus("Form submitted successfully!");
        setFormData({
          fullName: "",
          aadharNumber: "",
          contactNumber: "",
          address: "",
          village: "",
          landArea: "",
          ownershipType: "owned",
          landUse: "agriculture",
          soilType: "",
          irrigation: "yes",
          cropTypes: "",
          averageYield: "",
        }); // Clear form
      } else {
        // setFormStatus("Failed to submit form. Please try again.");
        alert("Error submitting data. Please try again later.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // setFormStatus("An error occurred while submitting the form.");
      alert("Error submitting data. Please try again later.");
    }
  };

  return (
    <div className="form-container">
      <h3>Local Credit Score Form</h3>
      <div className="scrollable-form">
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label htmlFor="full-name">Full Name:</label>
            <input
              id="full-name"
              type="text"
              name="fullName"
              className="crop-input"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-container">
            <label htmlFor="aadhar-number">Aadhar Number (or relevant ID):</label>
            <input
              id="aadhar-number"
              type="text"
              name="aadharNumber"
              className="crop-input"
              placeholder="Enter Aadhar Number"
              value={formData.aadharNumber}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-container">
            <label htmlFor="contact-number">Contact Number:</label>
            <input
              id="contact-number"
              type="tel"
              name="contactNumber"
              className="crop-input"
              placeholder="Enter your contact number"
              value={formData.contactNumber}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-container">
            <label htmlFor="address">Address:</label>
            <textarea
              id="address"
              name="address"
              className="crop-input"
              rows="3"
              placeholder="Enter your address"
              value={formData.address}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>

          <div className="input-container">
            <label htmlFor="village">Village/Tehsil/Block:</label>
            <input
              id="village"
              type="text"
              name="village"
              className="crop-input"
              placeholder="Enter village/tehsil/block"
              value={formData.village}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-container">
            <label htmlFor="land-area">Total Land Area (in acres/hectares):</label>
            <input
              id="land-area"
              type="number"
              name="landArea"
              className="crop-input"
              placeholder="Enter total land area"
              value={formData.landArea}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-container">
            <label htmlFor="ownership-type">Land Ownership Type:</label>
            <select
              id="ownership-type"
              name="ownershipType"
              className="crop-input"
              value={formData.ownershipType}
              onChange={handleInputChange}
            >
              <option value="owned">Owned</option>
              <option value="leased">Leased</option>
              <option value="shared">Shared</option>
            </select>
          </div>

          <div className="input-container">
            <label htmlFor="land-use">Land Use Type:</label>
            <select
              id="land-use"
              name="landUse"
              className="crop-input"
              value={formData.landUse}
              onChange={handleInputChange}
            >
              <option value="agriculture">Agriculture</option>
              <option value="non-agriculture">Non-Agriculture</option>
            </select>
          </div>

          <div className="input-container">
            <label htmlFor="soil-type">Soil Type:</label>
            <input
              id="soil-type"
              type="text"
              name="soilType"
              className="crop-input"
              placeholder="Enter soil type (e.g., Red, Black)"
              value={formData.soilType}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-container">
            <label htmlFor="irrigation">Irrigation Facilities:</label>
            <select
              id="irrigation"
              name="irrigation"
              className="crop-input"
              value={formData.irrigation}
              onChange={handleInputChange}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div className="input-container">
            <label htmlFor="crop-types">Crop Name Grown:</label>
            <input
              id="crop-types"
              type="text"
              name="cropTypes"
              className="crop-input"
              placeholder="Enter crop name"
              value={formData.cropTypes}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-container">
            <label htmlFor="average-yield">Total Yield:</label>
            <input
              id="average-yield"
              type="text"
              name="averageYield"
              className="crop-input"
              placeholder="Enter average yield"
              value={formData.averageYield}
              onChange={handleInputChange}
              required
            />
          </div>

          <button className="btn" type="submit" onClick={handleSubmit}>
            Submit
          </button>
          <button className="btn back-btn" onClick={onBack}>
            Back
          </button>
        </form>
        {formStatus && <p className="form-status">{formStatus}</p>}
      </div>
    </div>
  );
};

export default LocalCreditForm;