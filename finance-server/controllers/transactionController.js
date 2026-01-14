// controllers/transactions.controller.js
const transactionsService = require("../services/transactions.service");

// יצירת טרנזקציה
exports.createTransaction = async (req, res) => {
  try {
    const userId = req.user.id; // מגיע מה־JWT
    const transaction = await transactionsService.createTransactionForUser(
      userId,
      req.body
    );

    res.status(201).json(transaction);
  } catch (err) {
    console.error("createTransaction error:", err);
    res.status(400).json({ error: err.message });
  }
};

// שליפת כל הטרנזקציות (ממויין לפי תאריך יורד)
exports.getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await transactionsService.getUserTransactions(userId);

    res.json(transactions);
  } catch (err) {
    console.error("getTransactions error:", err);
    res.status(500).json({ error: err.message });
  }
};

// עדכון טרנזקציה
exports.updateTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;

    const updated = await transactionsService.updateUserTransaction(
      userId,
      id,
      req.body
    );

    if (!updated) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("updateTransaction error:", err);
    res.status(500).json({ error: err.message });
  }
};

// מחיקת טרנזקציה
exports.deleteTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;

    const deleted = await transactionsService.deleteUserTransaction(userId, id);

    if (!deleted) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("deleteTransaction error:", err);
    res.status(500).json({ error: err.message });
  }
};
