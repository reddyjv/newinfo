// routes/invoice.js
const express = require("express");
const router = express.Router();
const Invoice = require("../models/Invoices");
const Customer = require("../models/Customer");

function generateInvoiceNumber(lastNumber) {
  if (!lastNumber) return "INV1000";
  const num = parseInt(lastNumber.replace("INV", ""), 10) + 1;
  return `INV${num}`;
}

router.post("/createinvoice", async (req, res) => {
  try {
    const lastInvoice = await Invoice.findOne().sort({ _id: -1 });
    const newInvoiceNumber = generateInvoiceNumber(lastInvoice?.invoiceNumber);

    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();

    const invoice = new Invoice({
      invoiceNumber: newInvoiceNumber,
      date,
      time,
      customer: req.body.customer,
      items: req.body.items,
      totals: req.body.totals,
    });

    await invoice.save();
    res
      .status(201)
      .json({ success: true, invoiceNumber: newInvoiceNumber, date, time });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ date: -1 });
    res.json(invoices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching invoices" });
  }
});

// Assuming you are using Express and your Invoice model is imported
router.get("/totals/today", async (req, res) => {
  try {
    const today = new Date();
    const dd = String(today.getDate()); // No leading zero because you have format like "20/5/2025"
    const mm = String(today.getMonth() + 1); // Same here
    const yyyy = today.getFullYear();

    // Format as DD/MM/YYYY — note no leading zeros as in your example "20/5/2025"
    const todayStr = `${dd}/${mm}/${yyyy}`;

    const result = await Invoice.aggregate([
      { $match: { date: todayStr } },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totals.finalAmount" },
        },
      },
    ]);

    const totalSales = result.length > 0 ? result[0].totalSales : 0;
    console.log("Total Sale is ", totalSales);

    res.json({
      date: todayStr,
      totalSales,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching today total sales" });
  }
});

// routes/invoiceRoutes.js

// GET all due bills
router.get("/due", async (req, res) => {
  try {
    const dueBills = await Invoice.find({ "totals.dueStatus": 1 });
    res.json(dueBills);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// PATCH clear a bill (set dueStatus to 0)
router.patch("/clear/:id", async (req, res) => {
  console.log("Hello came to here");
  try {
    const invoicust = await Invoice.findOne({ invoiceNumber: req.params.id });
    const billAmount = invoicust.totals?.finalAmount || 0;
    const customerId = invoicust.customer.customerId;
    const customer = await Customer.findOne({customerId:customerId});
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    if (customer.walletBal < billAmount) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    // Subtract using $inc operator
    await Customer.findOneAndUpdate({customerId:customerId}, {
      $inc: { walletBal: -billAmount },
    });

    const invoice = await Invoice.findOneAndUpdate(
      { invoiceNumber: req.params.id },
      {
        $set: {
          "totals.dueStatus": 0,
          "totals.duepaymentMode": req.body.paymentMode || "",
          "totals.paidreferenceNumber": req.body.referenceNumber || "N/A",
          "totals.clearedDate": new Date().toLocaleDateString(),
        },
      },
      { new: true }
    );
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.json(invoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating bill status" });
  }
});

router.get("/date/:date", async (req, res) => {
  console.log("Hello came incvoicnes");
  try {
    let searchDate = req.params.date;

    // Convert from 'YYYY-MM-DD' to 'D/M/YYYY' to match stored format
    if (/^\d{4}-\d{2}-\d{2}$/.test(searchDate)) {
      const [year, month, day] = searchDate.split("-");
      // Don't pad day/month
      searchDate = `${parseInt(day)}/${parseInt(month)}/${year}`;
    }

    console.log("Searching for invoices with date:", searchDate);

    const invoices = await Invoice.find({ date: searchDate });
    console.log(invoices);

    if (invoices.length === 0) {
      console.log("No invoices found for this date.");
    }
    res.json(invoices);
  } catch (err) {
    console.error("Error fetching invoices:", err);
    res.status(500).json({ message: err.message });
  }
});


router.get('/cleared/:date', async (req, res) => {
  try {
    let searchDate = req.params.date;
    
    // Convert YYYY-MM-DD to D/M/YYYY
    if (/^\d{4}-\d{2}-\d{2}$/.test(searchDate)) {
      const [year, month, day] = searchDate.split("-");
      searchDate = `${parseInt(day)}/${parseInt(month)}/${year}`;
    } else {
      return res.status(400).json({ msg: 'Date must be in YYYY-MM-DD format' });
    }

    // 1. Get invoices created on this date
    const dailyInvoices = await Invoice.find({ date: searchDate });

    // 2. Get credit invoices cleared on this date
    const clearedCredits = await Invoice.find({
      'totals.dueStatus': 0,
      'totals.clearedDate': searchDate
    });

    // Combine results (may contain duplicates if invoice was created and cleared same day)
    const allInvoices = [...dailyInvoices, ...clearedCredits];

    res.json(allInvoices);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
