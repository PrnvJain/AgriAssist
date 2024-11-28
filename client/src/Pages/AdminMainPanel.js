import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminMainPanel.css";

const AdminMainPanel = () => {
  const [loanApplications, setLoanApplications] = useState([]);
  const [error, setError] = useState("");
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [viewApplication, setViewApplication] = useState(null);
  const [showRevertPopup, setShowRevertPopup] = useState(false);
  const [selectedAadhar, setSelectedAadhar] = useState(null);
  const [reviewMessage, setReviewMessage] = useState("");
  const [showApprovePopup, setShowApprovePopup] = useState(false);
  const [sanctionedAmount, setSanctionedAmount] = useState("");

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
        alert('Loan status updated to ${status} successfully!');
        const updatedApplications = loanApplications.map((application) =>
          application.aadharNumber === aadharNumber
            ? { ...application, status, reviewMessage }
            : application
        );
        setLoanApplications(updatedApplications);
        setShowRevertPopup(false);
      } else {
        alert("Failed to update loan status.");
      }
    } catch (err) {
      console.error("Error updating loan status:", err);
      alert("An error occurred while updating the loan status.");
    }
  };

  const openRevertPopup = (aadharNumber) => {
    setSelectedAadhar(aadharNumber);
    setShowRevertPopup(true);
  };

  const closeRevertPopup = () => {
    setShowRevertPopup(false);
    setReviewMessage("");
  };

  const submitRevertedStatus = () => {
    handleStatusUpdate(selectedAadhar, "Reverted", reviewMessage);
  };

  const openViewPopup = async (aadharNumber) => {
    try {
      const response = await axios.get(`http://localhost:5000/admin/view-application/${aadharNumber}`);
      if (response.status === 200) {
        setViewApplication(response.data.data);
        setShowViewPopup(true);
      } else {
        alert("Failed to fetch application details.");
      }
    } catch (err) {
      console.error("Error fetching application details:", err);
      alert("An error occurred while fetching application details.");
    }
  };

  const closeViewPopup = () => {
    setShowViewPopup(false);
    setViewApplication(null);
  };

  const handleApproveClick = (aadharNumber) => {
    setSelectedAadhar(aadharNumber);
    setShowApprovePopup(true);
  };
  
  const handleSanctionedSubmit = async () => {
    if (!sanctionedAmount || isNaN(sanctionedAmount) || sanctionedAmount <= 0) {
      alert("Please enter a valid sanctioned amount.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/admin/approve-loan",
        {
          aadharNumber: selectedAadhar,
          status: "Approved",
          sanctionedAmount: parseFloat(sanctionedAmount),
        }
      );

      if (response.status === 200) {
        alert("Loan approved successfully!");
        const updatedApplications = loanApplications.map((application) =>
          application.aadharNumber === selectedAadhar
            ? { ...application, loanStatus: "Approved", sanctionedAmount }
            : application
        );
        setLoanApplications(updatedApplications);
        setShowApprovePopup(false);
        setSanctionedAmount("");
      } else {
        alert("Failed to approve the loan.");
      }
    } catch (err) {
      console.error("Error approving the loan:", err);
      alert("An error occurred while approving the loan.");
    }
  };

  const closeApprovePopup = () => {
    setShowApprovePopup(false);
    setSanctionedAmount("");
  };

  return (
      <div className="admin-panel-container">
        <h2 className="admin-panel-title">Admin Panel - Loan Applications</h2>
        {error && <p className="error-message">{error}</p>}
        {!error && loanApplications.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Aadhar Number</th>
                  <th>Bank Name</th>
                  <th>Loan Amount</th>
                  <th>Repayment Months</th>
                  <th>Timestamp</th>
                  <th>Warning</th>
                  <th>Safe margin</th>
                  <th>Loan Status</th>
                  <th>Actions</th>

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
                    <td>{application.warning}</td>
                    <td>{application.safeMargin}</td>
                    <td
                      className={
                        application.loanStatus === "Approved"
                          ? "status-approved"
                          : application.loanStatus === "Rejected"
                          ? "status-rejected"
                          : "status-reverted"
                      }
                    >
                      {application.loanStatus}
                    </td>
                    <td className="action-buttons">
                    <button
                      className="button button-approve"
                      onClick={() => handleApproveClick(application.aadharNumber)}
                    >
                      Approve
                    </button>
                      <button
                        className="button button-reject"
                        onClick={() => handleStatusUpdate(application.aadharNumber, "Rejected")}
                      >
                        Reject
                      </button>
                      <button
                        className="button button-revert"
                        onClick={() => openRevertPopup(application.aadharNumber)}
                      >
                        Revert
                      </button>
                      <button
                        className="button button-view"
                        onClick={() => openViewPopup(application.aadharNumber)}
                      >
                        View Application
                      </button>
                     
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-data">No loan applications found</p>
        )}
    
        {/* Revert Popup */}
        {showRevertPopup && (
          <div className="popup">
            <div className="popup-content">
              <h3>Add Review Message</h3>
              <textarea
                className="input-field"
                rows="4"
                placeholder="Enter your review message..."
                value={reviewMessage}
                onChange={(e) => setReviewMessage(e.target.value)}
              ></textarea>
              <div className="flex justify-end">
                <button
                  className="button button-approve"
                  onClick={submitRevertedStatus}
                >
                  Submit
                </button>
                <button
                  className="button"
                  onClick={closeRevertPopup}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
    
        {/* View Popup */}
       {/* View Popup */}
        {/* View Popup */}
        {showViewPopup && viewApplication && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="popup-content">
              <h3>Application Details</h3>
              <ul>
                {Object.entries(viewApplication).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key.replace(/([A-Z])/g, " $1")}:</strong> {value}
                  </li>
                ))}
              </ul>
              <div className="flex justify-end mt-4">
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={closeViewPopup}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      
      {/* Approve Popup */}
      {showApprovePopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="popup-content">
            <h3>Sanction Loan Amount</h3>
            <input
              type="number"
              className="input-field"
              placeholder="Enter sanctioned amount"
              value={sanctionedAmount}
              onChange={(e) => setSanctionedAmount(e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <button
                className="button button-approve"
                onClick={handleSanctionedSubmit}
              >
                Submit
              </button>
              <button className="button" onClick={closeApprovePopup}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    
  );
};

export default AdminMainPanel;