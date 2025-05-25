 dueStatus:Number,
    duepaymentMode:String,
    paidreferenceNumber:String,
    clearedDate:String
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VendorNavbar from './VendorNavbar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const DueBills = () => {
  const [dueBills, setDueBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentMode, setPaymentMode] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fetchDueBills = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/invoices/due');
      setDueBills(response.data);
      setFilteredBills(response.data);
    } catch (err) {
      console.error('Error fetching due bills:', err);
      setError('Failed to load due bills.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDueBills();
  }, []);

  useEffect(() => {
    const results = dueBills.filter(bill =>
      bill.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBills(results);
  }, [searchTerm, dueBills]);

  const handleClearClick = (invoiceNumber) => {
    setSelectedInvoice(invoiceNumber);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!paymentMode) {
      toast.error("Please select a payment mode");
      return;
    }
    if (paymentMode !== 'cash' && !referenceNumber) {
      toast.error("Reference number required for non-cash payments");
      return;
    }

    try {
      await axios.patch(`http://localhost:5000/api/invoices/clear/${selectedInvoice}`, {
        paymentMode,
        referenceNumber: paymentMode !== 'cash' ? referenceNumber : null
      });
      toast.success('Bill marked as cleared!');
      setShowModal(false);
      setPaymentMode('');
      setReferenceNumber('');
      fetchDueBills();
    } catch (err) {
      console.error('Error clearing bill:', err);
      toast.error('Failed to clear bill.');
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="container mt-5">
      <div className="alert alert-danger">{error}</div>
    </div>
  );

  return (
    <>
      <VendorNavbar />
      <div className="container mt-4">
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h2 className="h4 mb-0">Due Bills (Credit Payments)</h2>
          </div>
        <div className="card-body">
          {/* Search input */}
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search by invoice number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {filteredBills.length === 0 ? (
            <div className="alert alert-info">No Due invoices found</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Invoice No</th><th>Date</th><th>Time</th><th>Customer</th>
                    <th>Phone</th><th>Total</th><th>Mode</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBills.map((bill) => (
                    <tr key={bill._id}>
                      <td className="fw-semibold">{bill.invoiceNumber}</td>
                      <td>{bill.date}</td>
                      <td>{bill.time}</td>
                      <td>{bill.customer?.cname || 'N/A'}</td>
                      <td>{bill.customer?.cphone || 'N/A'}</td>
                      <td className="fw-bold">₹{bill.totals?.finalAmount?.toFixed(2) || '0.00'}</td>
                      <td>
                        <span className={`badge ${
                          bill.totals.paymentMode === 'credit'
                            ? 'bg-warning text-dark'
                            : 'bg-info text-white'
                        }`}>
                          {bill.totals.paymentMode}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleClearClick(bill.invoiceNumber)}
                        >
                          Clear Bill
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Payment</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Payment Mode</label>
                  <select
                    className="form-select"
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                  >
                    <option value="">Select Mode</option>
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="upi">UPI</option>
                  </select>
                </div>
                {paymentMode !== 'cash' && (
                  <div className="mb-3">
                    <label className="form-label">Reference Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={referenceNumber}
                      onChange={(e) => setReferenceNumber(e.target.value)}
                      placeholder="Enter Transaction ID"
                    />
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DueBills;
