import React, { useState } from "react";
import "./Loan.css";
import LocalCreditForm from "./LocalCreditForm";
import GlobalCreditForm from "./GlobalCreditForm";

const Loan = () => {
  const [activeForm, setActiveForm] = useState(""); // Manage active form

  const handleBack = () => setActiveForm(""); // Back to loan options

  return (
    <div className="main-container text-xs font-xs">
      {/* Show cards only if no form is active */}
      {!activeForm && (
        <div className="loan-container">
          <h2>Submit Form</h2>
          <div className="loan-cards">
            {/* Local Credit Card */}
            <div className="card">
              <h3>Local Credit</h3>
              <p>
                Access loan options tailored to local needs with easy repayment
                terms and lower interest rates.
              </p>
              <button className="btn"  onClick={() => setActiveForm("local")}>
                Fill Form for Local Credit
              </button>
            </div>

            {/* Global Credit Card */}
            <div className="card">
              <h3>Global Credit</h3>
              <p>
                Leverage global financing options for high-value agricultural
                projects and expansion.
              </p>
              <button className="btn" onClick={() => setActiveForm("global")}>
                Fill Form for Global Credit
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Render forms conditionally */}
      {activeForm === "local" && <LocalCreditForm onBack={handleBack} />}
      {activeForm === "global" && <GlobalCreditForm onBack={handleBack} />}
    </div>
  );
};

export default Loan;
