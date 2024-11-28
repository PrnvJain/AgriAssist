import React, { useState } from "react";
import axios from "axios";
import './LoanStatus.css';

import hdfcicon from './hdfc.png';
import iciciicon from './icici.png';
import axisicon from './axis.png';
import sbiicon from './sbi.jpg';
import kotakicon from './kotak.png';
import barodaicon from './baroda.png';

const LoanStatus = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedBank, setSelectedBank] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [repaymentMonths, setRepaymentMonths] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [loanData, setLoanData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);

  const banks = [
    { id: 1, name: "HDFC", image: hdfcicon, interestRate: "7.5%" },
    { id: 2, name: "ICICI", image: iciciicon, interestRate: "8.2%" },
    { id: 3, name: "SBI", image: sbiicon, interestRate: "6.9%" },
    { id: 4, name: "Axis", image: axisicon, interestRate: "7.0%" },
    { id: 5, name: "Kotak Mahindra", image: kotakicon, interestRate: "8.0%" },
    { id: 6, name: "Baroda", image: barodaicon, interestRate: "7.3%" },
  ];

  const handleApplyClick = (bank) => {
    setSelectedBank(bank.name);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    const formPayload = {
      bankName: selectedBank,
      loanAmount,
      repaymentMonths,
      aadharNumber: aadharNumber  // Ensure this is captured in the form
    };
  
    try {

      console.log('Form Payload:', formPayload);
      const response = await axios.post('http://localhost:5000/submit-loan', formPayload);
  
      if (response.status === 200) {
        alert('Loan application submitted successfully.');
      } else {
        alert(response.data.message || 'Error submitting loan application.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'An unexpected error occurred.');
    }
  };


  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/admin/search-application/${aadharNumber}`);
      if (response.status === 200) {
        setLoanData(response.data.data);
        setErrorMessage("");
      } else {
        setLoanData([]);
        setErrorMessage("No data found for this Aadhar Number.");
      }
    } catch (err) {
      console.error("Error fetching loan data:", err);
      setLoanData([]);
      setErrorMessage("An error occurred while fetching loan data.");
    }
  };

  return (
    <div className="ml-96">
      <h1 className="text-2xl font-bold mb-6" style={{ marginLeft: '150px' }}>Loan Application</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ marginLeft: '125px' }}>
        {banks.map((bank) => (
          <div key={bank.id} className="bank-card">
            <div className="bankimage-container">
              <img src={bank.image} alt={bank.name} className="bank-image" />
            </div>
            <h2 className="text-lg font-semibold mb-2 mt-16">{bank.name}</h2>
            <p className="text-gray-600 mb-4 text-center">Rate of Interest: {bank.interestRate}</p>
            <button
              className="gradient-button"
              onClick={() => handleApplyClick(bank)}
            >
              Apply
            </button>
          </div>
        ))}
      </div>

      {/* Popup Form */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 shadow-lg rounded-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Loan Application Form</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="bank-name" className="block text-sm font-semibold mb-2">
                  Bank Name
                </label>
                <input
                  type="text"
                  id="bank-name"
                  name="bank-name"
                  value={selectedBank}
                  disabled
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="loan-amount" className="block text-sm font-semibold mb-2">
                  Loan Amount
                </label>
                <input
                  type="number"
                  id="loan-amount"
                  name="loan-amount"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="repayment-months" className="block text-sm font-semibold mb-2">
                  Repayment Months
                </label>
                <input
                  type="number"
                  id="repayment-months"
                  name="repayment-months"
                  value={repaymentMonths}
                  onChange={(e) => setRepaymentMonths(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="repayment-months" className="block text-sm font-semibold mb-2">
                  adharNumber
                </label>
                <input
                  type="number"
                  id="aadharNumber"
                  name="aadharNumber"
                  value={aadharNumber}
                  onChange={(e) => setAadharNumber(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={handleSubmit}
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-md w-full hover:bg-green-600"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="text-red-500 ml-4"
                  onClick={() => setShowForm(false)}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Previous Loans Section */}
      <h2 className="text-xl font-bold mt-10 mb-4">Previous Loans</h2>
      <button
        className="search-button"
        onClick={() => setShowSearchInput(!showSearchInput)}
      >
        View Previous Loans
      </button>

      {showSearchInput && (
        <>
          <div className="mb-4">
            <label htmlFor="aadhar-number" className="block text-sm font-semibold mb-2">
              Enter Aadhar Number
            </label>
            <input
              type="text"
              id="aadhar-number"
              value={aadharNumber}
              onChange={(e) => setAadharNumber(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
            <button
              className="gradient-button mt-4"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}

          {loanData.length > 0 && (
            <table className="table-auto w-full mt-4 border-collapse border border-gray-400">
              <thead>
                <tr>
                  <th className="border border-gray-400 px-4 py-2">Sr. No</th>
                  <th className="border border-gray-400 px-4 py-2">Bank</th>
                  <th className="border border-gray-400 px-4 py-2">Amount</th>
                  <th className="border border-gray-400 px-4 py-2">Sanctioned Amount</th>
                  <th className="border border-gray-400 px-4 py-2">Review Message</th>
                  <th className="border border-gray-400 px-4 py-2">Status</th>
                  <th className="border border-gray-400 px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {loanData.map((loan, index) => (
                  <tr key={index}>
                    <td className="border border-gray-400 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-400 px-4 py-2">{loan.bankName}</td>
                    <td className="border border-gray-400 px-4 py-2">{loan.loanAmount}</td>
                    <td className="border border-gray-400 px-4 py-2">{loan.sanctionedAmount || "N/A"}</td>
                    <td className="border border-gray-400 px-4 py-2">{loan.reviewMessage || "N/A"}</td>
                    <td className="border border-gray-400 px-4 py-2">{loan.loanStatus}</td>
                    <td className="border border-gray-400 px-4 py-2">
                      {new Date(loan.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default LoanStatus;
