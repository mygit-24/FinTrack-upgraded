// services/transactions.service.js
const Transaction = require("../models/Transaction");
// שימי לב: אין כאן require ל-expenseCategories

async function createTransactionForUser(userId, data) {
  const tx = await Transaction.create({
    ...data,
    user: userId,
  });
  return tx.toObject();
}

async function getUserTransactions(userId) {
  const docs = await Transaction.find({ user: userId }).sort({ date: -1 });

  // אופציה 1 – להחזיר פשוט את המסמכים כמו שהם:
  return docs.map(tx => tx.toObject());

  // אם את רוצה להדגיש שזה מפתח, אפשר גם ככה:
  /*
  return docs.map(tx => ({
    ...tx.toObject(),
    categoryKey: tx.category, // מפתח בלבד – הטקסט מתורגם ב־React
  }));
  */
}

async function updateUserTransaction(userId, id, data) {
  const updated = await Transaction.findOneAndUpdate(
    { _id: id, user: userId },
    data,
    { new: true }
  );
  return updated ? updated.toObject() : null;
}

async function deleteUserTransaction(userId, id) {
  const deleted = await Transaction.findOneAndDelete({
    _id: id,
    user: userId,
  });
  return deleted;
}

module.exports = {
  createTransactionForUser,
  getUserTransactions,
  updateUserTransaction,
  deleteUserTransaction,
};
