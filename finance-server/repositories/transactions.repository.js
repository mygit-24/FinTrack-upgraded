// repositories/transactions.repository.js
const Transaction = require("../models/Transaction");

// יצירת טרנזקציה
async function create(data) {
  return Transaction.create(data);
}

// שליפת כל הטרנזקציות של משתמש, ממויין לפי תאריך יורד
async function findByUser(userId) {
  return Transaction.find({ user: userId }).sort({ date: -1 });
}

// עדכון טרנזקציה לפי id + user
async function updateByIdAndUser(id, userId, data) {
  return Transaction.findOneAndUpdate(
    { _id: id, user: userId },
    data,
    { new: true }
  );
}

// מחיקת טרנזקציה לפי id + user
async function deleteByIdAndUser(id, userId) {
  return Transaction.findOneAndDelete({
    _id: id,
    user: userId,
  });
}

module.exports = {
  create,
  findByUser,
  updateByIdAndUser,
  deleteByIdAndUser,
};
