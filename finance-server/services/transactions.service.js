// services/transactions.service.js
const transactionsRepository = require("../repositories/transactions.repository");
const categories = require("../constants/expenseCategories");

// פונקציה פנימית להוספת categoryLabel לטרנזקציה
function attachCategoryLabel(tx) {
  const plain = tx.toObject ? tx.toObject() : tx;

  if (plain.type === "expense") {
    const categoryLabel =
      categories.find((c) => c.value === plain.category)?.label || "-";

    return { ...plain, categoryLabel };
  }

  return { ...plain, categoryLabel: "-" };
}

// יצירת טרנזקציה חדשה למשתמש
async function createTransactionForUser(userId, payload) {
  const data = {
    ...payload,
    user: userId,
  };

  const tx = await transactionsRepository.create(data);
  return attachCategoryLabel(tx);
}

// שליפת כל הטרנזקציות של משתמש (עם categoryLabel)
async function getUserTransactions(userId) {
  const transactions = await transactionsRepository.findByUser(userId);
  return transactions.map(attachCategoryLabel);
}

// עדכון טרנזקציה של משתמש
async function updateUserTransaction(userId, id, payload) {
  const updated = await transactionsRepository.updateByIdAndUser(id, userId, payload);
  if (!updated) {
    return null; // הקונטרולר יחליט מה להחזיר
  }
  return attachCategoryLabel(updated);
}

// מחיקת טרנזקציה של משתמש
async function deleteUserTransaction(userId, id) {
  const deleted = await transactionsRepository.deleteByIdAndUser(id, userId);
  return deleted; // null אם לא נמצא
}

module.exports = {
  createTransactionForUser,
  getUserTransactions,
  updateUserTransaction,
  deleteUserTransaction,
};
