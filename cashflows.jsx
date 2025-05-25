import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaMoneyBillWave, 
  FaCreditCard, 
  FaExchangeAlt,
  FaWallet,
  FaCalendarDay,
  FaFilter
} from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Table, Spinner } from 'react-bootstrap';


const CashInflows = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const [summary, setSummary] = useState({
    cash: 0,
    todcash:0,
    card: 0,
    todcard:0,
    todupi:0,
    upi: 0,
    creditCleared: 0,
    tocashcredit:0,
    total: 0
  });
  const today = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        // Format date as YYYY-MM-DD to match database format
        const dateStr = date.toISOString().split('T')[0];
        
        // Get all invoices cleared today (both new sales and cleared credits)
        const res = await axios.get(`http://localhost:5000/api/invoices/cleared/${dateStr}`);
        
        setInvoices(res.data);
        calculateSummary(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching invoices:', error);
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [date]);
  console.log(invoices)

  const calculateSummary = (invoices) => {
    let cashTotal = 0;
    let todcashTot = 0;
    let todcardTot = 0;
    let todupiTot = 0;
    let cardTotal = 0;
    let upiTotal = 0;
    let tocashcredit=0;
    let creditClearedTotal = 0;

    invoices.forEach(invoice => {
      const amount = parseFloat(invoice.totals.finalAmount) || 0;
      
      // Check if this is a credit bill that was cleared today
      const isCreditClearedToday = invoice.totals.dueStatus === 0 && 
                                  invoice.totals.clearedDate === today;
      
      if (isCreditClearedToday) {
        // For credit payments, check how they were cleared
        if (invoice.totals.duepaymentMode.toLowerCase() === 'cash') {
          cashTotal += amount;
          tocashcredit+=amount;
          creditClearedTotal += amount;
        } else if (invoice.totals.duepaymentMode.toLowerCase() === 'card') {
          cardTotal += amount;
          creditClearedTotal += amount;
        } else if (invoice.totals.duepaymentMode === 'UPI') {
          upiTotal += amount;
          creditClearedTotal += amount;
        }
      } else {
        // Handle regular payments (non-credit or credit not cleared today)
        if (invoice.totals.paymentMode.toLowerCase() === 'cash') {
          todcashTot += amount;
          cashTotal += amount;
        } else if (invoice.totals.paymentMode.toLowerCase() === 'card') {
          todcardTot += amount;
          cardTotal += amount;
        } else if (invoice.totals.paymentMode === 'UPI') {
          todupiTot += amount;
          upiTotal += amount;
        }
      }
    });

    setSummary({
      cash: cashTotal,
      todcash: todcashTot,
      tocashcredit:tocashcredit,
      todcard: todcardTot,
      todupi: todupiTot,
      card: cardTotal,
      upi: upiTotal,
      creditCleared: creditClearedTotal,
      total: cashTotal + cardTotal + upiTotal
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return new Date(`${month}/${day}/${year}`).toLocaleDateString();
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          <FaMoneyBillWave className="me-2" />
          Cash Inflows
        </h2>
        <div className="d-flex align-items-center">
          <FaCalendarDay className="me-2" />
          <DatePicker
            selected={date}
            onChange={(date) => setDate(date)}
            dateFormat="dd/MM/yyyy"
            className="form-control"
          />
          <button className="btn btn-outline-secondary ms-2">
            <FaFilter className="me-1" />
            Filter
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card border-success h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase text-muted mb-0">Cash Sales</h6>
                  <h3 className="mb-0">{formatCurrency(summary.todcash)}</h3>
                </div>
                <div className="icon icon-shape bg-success text-white rounded-circle">
                  <FaMoneyBillWave />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card border-primary h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase text-muted mb-0">Card Sales</h6>
                  <h3 className="mb-0">{formatCurrency(summary.todcard)}</h3>
                </div>
                <div className="icon icon-shape bg-primary text-white rounded-circle">
                  <FaCreditCard />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card border-info h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase text-muted mb-0">UPI Payments</h6>
                  <h3 className="mb-0">{formatCurrency(summary.todupi)}</h3>
                </div>
                <div className="icon icon-shape bg-info text-white rounded-circle">
                  <FaExchangeAlt />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card border-warning h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase text-muted mb-0">Credit Cleared</h6>
                  <h3 className="mb-0">{formatCurrency(summary.creditCleared)}</h3>
                </div>
                <div className="icon icon-shape bg-warning text-white rounded-circle">
                  <FaWallet />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Total Summary */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card bg-light">
            <div className="card-body text-center">
              <h4 className="mb-0">
                Total Cash Inflow for {date.toLocaleDateString()}: 
                <span className="ms-2 text-success">{formatCurrency(summary.total)}</span>
              </h4>
            </div>
          </div>
        </div>
      </div>
      
      {/* Transaction Details */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Transaction Details</h5>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Customer</th>
                  <th>Payment Mode</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Bill Date</th>
                  <th>Cleared Date</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => {
                  const isCreditClearedToday = invoice.totals.dueStatus === 0 && invoice.totals.clearedDate === today;
                  
                  return (
                    <tr key={invoice._id}>
                      <td>{invoice.invoiceNumber}</td>
                      <td>{invoice.customer?.cname || 'Walk-in Customer'}</td>
                      <td>
                        {isCreditClearedToday ? (
                          <>
                            {invoice.totals.duepaymentMode === 'cash' && <FaMoneyBillWave className="me-1" />}
                            {invoice.totals.duepaymentMode === 'card' && <FaCreditCard className="me-1" />}
                            {invoice.totals.duepaymentMode === 'UPI' && <FaExchangeAlt className="me-1" />}
                            Credit Cleared via {invoice.totals.duepaymentMode}
                          </>
                        ) : (
                          <>
                            {invoice.totals.paymentMode === 'cash' && <FaMoneyBillWave className="me-1" />}
                            {invoice.totals.paymentMode === 'card' && <FaCreditCard className="me-1" />}
                            {invoice.totals.paymentMode === 'UPI' && <FaExchangeAlt className="me-1" />}
                            {invoice.totals.paymentMode}
                          </>
                        )}
                      </td>
                      <td>{formatCurrency(invoice.totals.finalAmount)}</td>
                      <td>
                        {isCreditClearedToday ? (
                          <span className="badge bg-success">Credit Cleared</span>
                        ) : invoice.totals.dueStatus === 1 ? (
                          <span className="badge bg-warning">Credit</span>
                        ) : (
                          <span className="badge bg-success">Paid</span>
                        )}
                      </td>
                      <td>{invoice.date}</td>
                      <td>
                        {isCreditClearedToday ? invoice.totals.clearedDate : '-'}
                      </td>
                      <td>{invoice.time}</td>
                    </tr>
                  );
                })}
                {invoices.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-4">No transactions found for this date</td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </div>
      </div>

      {/* Drawer Summary */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card border-success">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Expected Cash in Drawer</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Cash Sales
                  <span>{formatCurrency(summary.todcash)}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Credit Payments Received (Cash)
                  <span>{formatCurrency(
                    invoices
                      .filter(inv => inv.totals.dueStatus === 0 && 
                             inv.totals.clearedDate === today &&
                             inv.totals.duepaymentMode.toLowerCase() === 'cash')
                      .reduce((sum, inv) => sum + parseFloat(inv.totals.finalAmount || 0), 0)
                  )}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center bg-light">
                  <strong>Total Expected Cash</strong>
                  <strong>{formatCurrency(
                    summary.todcash + 
                    invoices
                      .filter(inv => inv.totals.dueStatus === 0 && 
                             inv.totals.clearedDate === today &&
                             inv.totals.duepaymentMode.toLowerCase() === 'cash')
                      .reduce((sum, inv) => sum + parseFloat(inv.totals.finalAmount || 0), 0)
                  )}</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-primary">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Non-Cash Payments</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Card Payments
                  <span>{formatCurrency(summary.todcard)}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  UPI Payments
                  <span>{formatCurrency(summary.todupi)}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Credit Cleared (Non-Cash)
                  <span>{formatCurrency(
                    invoices
                      .filter(inv => inv.totals.dueStatus === 0 && 
                             inv.totals.clearedDate === today &&
                             ['card', 'UPI'].includes(inv.totals.duepaymentMode))
                      .reduce((sum, inv) => sum + parseFloat(inv.totals.finalAmount || 0), 0)
                  )}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center bg-light">
                  <strong>Total Non-Cash</strong>
                  <strong>{formatCurrency(
                    summary.todcard + 
                    summary.todupi + 
                    invoices
                      .filter(inv => inv.totals.dueStatus === 0 && 
                             inv.totals.clearedDate === today &&
                             ['card', 'UPI'].includes(inv.totals.duepaymentMode))
                      .reduce((sum, inv) => sum + parseFloat(inv.totals.finalAmount || 0), 0)
                  )}</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashInflows;
