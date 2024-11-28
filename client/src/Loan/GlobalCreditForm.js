import React, { useState } from "react";
import axios from "axios"; // Import axios for making API calls
import "./Loan.css";

const GlobalCreditForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    aadharNumber: "",
    numVehicles: "",
    numCattle: "",
    numWells: "",
    numBorewells: "",
    canalWater: "yes",
    numLivestock: "",
    agriEquipments: "",
    annualIncome: "",
    otherIncome: "",
    outstandingLoans: "yes",
    loanType: "agriculture",
    outstandingLoanAmount: "",
    bankSavings: "",
    cropInsurance: "yes",
    livestockInsurance: "yes",
    healthInsurance: "yes",
  });

  const [error, setError] = useState(""); // For form validation error messages

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform form validation
    if (
      !formData.numVehicles ||
      !formData.numCattle ||
      !formData.numWells ||
      !formData.annualIncome ||
      !formData.otherIncome
    ) {
      setError("Please fill in all the required fields!");
      return;
    }

    try {
      // API call to store the data

      const response = await axios.post(
        "http://localhost:5000/global",
        formData
      );

      // Handle response (success)
      if (response.status === 200) {
        alert("Data submitted successfully!");
        // Optionally, reset form or navigate
        setFormData({
          aadharNumber: "",
          numVehicles: "",
          numCattle: "",
          numWells: "",
          numBorewells: "",
          canalWater: "yes",
          numLivestock: "",
          agriEquipments: "",
          annualIncome: "",
          otherIncome: "",
          outstandingLoans: "yes",
          loanType: "agriculture",
          outstandingLoanAmount: "",
          bankSavings: "",
          cropInsurance: "yes",
          livestockInsurance: "yes",
          healthInsurance: "yes",
        });
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Error submitting data. Please try again later.");
    }
  };

  return (
    <div className="form-container">
      <h3>Global Credit Score Form</h3>
      <div className="scrollable-form">
        <form onSubmit={handleSubmit}>
          {/* Aadhar Number */}
          <div className="form-group">
            <label htmlFor="aadharNumber" className="block mb-1">
              Aadhar Number
            </label>
            <input
              type="text"
              id="aadharNumber"
              name="aadharNumber"
              value={formData.aadharNumber}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          {/* Number of Vehicles */}
          <div className="form-group">
            <label htmlFor="numVehicles">Number of Vehicles</label>
            <input
              type="number"
              id="numVehicles"
              name="numVehicles"
              value={formData.numVehicles}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Number of Cattle */}
          <div className="form-group">
            <label htmlFor="numCattle">Number of Cattle</label>
            <input
              type="number"
              id="numCattle"
              name="numCattle"
              value={formData.numCattle}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Number of Wells */}
          <div className="form-group">
            <label htmlFor="numWells">Number of Wells</label>
            <input
              type="number"
              id="numWells"
              name="numWells"
              value={formData.numWells}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Number of Borewells */}
          <div className="form-group">
            <label htmlFor="numBorewells">Number of Borewells</label>
            <input
              type="number"
              id="numBorewells"
              name="numBorewells"
              value={formData.numBorewells}
              onChange={handleInputChange}
            />
          </div>

          {/* Canal Water */}
          <div className="form-group">
            <label htmlFor="canalWater">Canal Water</label>
            <select
              id="canalWater"
              name="canalWater"
              value={formData.canalWater}
              onChange={handleInputChange}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          {/* Number of Livestock */}
          <div className="form-group">
            <label htmlFor="numLivestock">Number of Livestock</label>
            <input
              type="number"
              id="numLivestock"
              name="numLivestock"
              value={formData.numLivestock}
              onChange={handleInputChange}
            />
          </div>

          {/* Agricultural Equipments */}
          <div className="form-group">
            <label htmlFor="agriEquipments">Agricultural Equipment</label>
            <input
              type="text"
              id="agriEquipments"
              name="agriEquipments"
              value={formData.agriEquipments}
              onChange={handleInputChange}
            />
          </div>

          {/* Annual Income */}
          <div className="form-group">
            <label htmlFor="annualIncome">Annual Income</label>
            <input
              type="number"
              id="annualIncome"
              name="annualIncome"
              value={formData.annualIncome}
              onChange={handleInputChange}
            />
          </div>

          {/* Other Income */}
          <div className="form-group">
            <label htmlFor="otherIncome">Other Income</label>
            <input
              type="number"
              id="otherIncome"
              name="otherIncome"
              value={formData.otherIncome}
              onChange={handleInputChange}
            />
          </div>

          {/* Outstanding Loans */}
          <div className="form-group">
            <label htmlFor="outstandingLoans">Outstanding Loans</label>
            <select
              id="outstandingLoans"
              name="outstandingLoans"
              value={formData.outstandingLoans}
              onChange={handleInputChange}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          {/* Loan Type */}
          <div className="form-group">
            <label htmlFor="loanType">Loan Type</label>
            <select
              id="loanType"
              name="loanType"
              value={formData.loanType}
              onChange={handleInputChange}
            >
              <option value="agriculture">Agriculture</option>
              <option value="business">Business</option>
              <option value="personal">Personal</option>
            </select>
          </div>

          {/* Outstanding Loan Amount */}
          <div className="form-group">
            <label htmlFor="outstandingLoanAmount">Outstanding Loan Amount</label>
            <input
              type="number"
              id="outstandingLoanAmount"
              name="outstandingLoanAmount"
              value={formData.outstandingLoanAmount}
              onChange={handleInputChange}
            />
          </div>

          {/* Bank Savings */}
          <div className="form-group">
            <label htmlFor="bankSavings">Bank Savings</label>
            <input
              type="number"
              id="bankSavings"
              name="bankSavings"
              value={formData.bankSavings}
              onChange={handleInputChange}
            />
          </div>

          {/* Crop Insurance */}
          <div className="form-group">
            <label htmlFor="cropInsurance">Crop Insurance</label>
            <select
              id="cropInsurance"
              name="cropInsurance"
              value={formData.cropInsurance}
              onChange={handleInputChange}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          {/* Livestock Insurance */}
          <div className="form-group">
            <label htmlFor="livestockInsurance">Livestock Insurance</label>
            <select
              id="livestockInsurance"
              name="livestockInsurance"
              value={formData.livestockInsurance}
              onChange={handleInputChange}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          {/* Health Insurance */}
          <div className="form-group">
            <label htmlFor="healthInsurance">Health Insurance</label>
            <select
              id="healthInsurance"
              name="healthInsurance"
              value={formData.healthInsurance}
              onChange={handleInputChange}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          {/* Error Handling */}
          {error && <div className="error">{error}</div>}

        </form>
      </div>
      {/* Submit Button */}
      <button onClick={handleSubmit} type="submit" className="btn">
        Submit
      </button>
      <button onClick={onBack} className="btn back-btn">
        Go Back
      </button>
    </div>
  );
};

export default GlobalCreditForm;