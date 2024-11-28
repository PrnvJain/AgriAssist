import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [loanApplications, setLoanApplications] = useState([]);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedAadhar, setSelectedAadhar] = useState(null);
  const [reviewMessage, setReviewMessage] = useState("");

  useEffect(() => {
    const fetchLoanApplications = async () => {
      try {
        const response = await axios.get("http://localhost:5000/admin/loan-applications");
        if (response.status === 200) {
          setLoanApplications(response.data.data);
        } else {
          setError("Failed to fetch loan applications.");
        }
      } catch (err) {
        console.error("Error fetching loan applications:", err);
        setError("An error occurred while fetching loan applications.");
      }
    };

    fetchLoanApplications();
  }, []);

  const handleStatusUpdate = async (aadharNumber, status, reviewMessage = "") => {
    try {
      const response = await axios.post("http://localhost:5000/admin/update-loan-status", {
        aadharNumber,
        status,
        reviewMessage,
      });

      if (response.status === 200) {
        alert(`Loan status updated to ${status} successfully!`);
        const updatedApplications = loanApplications.map((application) =>
          application.aadharNumber === aadharNumber
            ? { ...application, status, reviewMessage }
            : application
        );
        setLoanApplications(updatedApplications);
        setShowPopup(false);
      } else {
        alert("Failed to update loan status.");
      }
    } catch (err) {
      console.error("Error updating loan status:", err);
      alert("An error occurred while updating the loan status.");
    }
  };

  const openPopup = (aadharNumber) => {
    setSelectedAadhar(aadharNumber);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setReviewMessage("");
  };

  const submitRevertedStatus = () => {
    handleStatusUpdate(selectedAadhar, "Reverted", reviewMessage);
  };

  return (
    <div className="admin-panel-container">
      <h2 className="admin-panel-title">Bhoomi Admin Panel - Loan Applications</h2>
      {error && <p className="error-message">{error}</p>}
      {!error && loanApplications.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                {[
                  "Full Name",
                  "Aadhar Number",
                  "Bank Name",
                  "Loan Amount",
                  "Repayment Months",
                  "Timestamp",
                  "Loan Status",
                  "Actions",
                ].map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loanApplications.map((application, index) => (
                <tr key={index} className="table-row">
                  <td>{application.fullName}</td>
                  <td>{application.aadharNumber}</td>
                  <td>{application.bankName}</td>
                  <td>{application.loanAmount}</td>
                  <td>{application.repaymentMonths}</td>
                  <td>{new Date(application.timestamp).toLocaleString()}</td>
                  <td
                    className={`status-${application.loanStatus.toLowerCase()}`}
                  >
                    {application.loanStatus}
                  </td>
                  <td className="action-buttons">
                    <button
                      className="button button-approve"
                      onClick={() =>
                        handleStatusUpdate(application.aadharNumber, "Approved")
                      }
                    >
                      Approve
                    </button>
                    <button
                      className="button button-reject"
                      onClick={() =>
                        handleStatusUpdate(application.aadharNumber, "Rejected")
                      }
                    >
                      Reject
                    </button>
                    <button
                      className="button button-revert"
                      onClick={() => openPopup(application.aadharNumber)}
                    >
                      Revert
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-data">No loan applications found.</p>
      )}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Revert Loan Application</h3>
            <textarea
              value={reviewMessage}
              onChange={(e) => setReviewMessage(e.target.value)}
              placeholder="Enter review message"
            />
            <button className="button button-revert" onClick={submitRevertedStatus}>
              Submit
            </button>
            <button className="button button-reject" onClick={closePopup}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
