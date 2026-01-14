const mongoose = require('mongoose');
const expenseCategories = require('../constants/expenseCategoriesStrings');

const transactionSchema = new mongoose.Schema({
   user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, 
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true,
  },
  sum: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    enum: expenseCategories,
    required: function () {
      return this.type === 'expense';
    },
  },
});

module.exports = module.exports = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);



