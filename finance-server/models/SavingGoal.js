const mongoose = require('mongoose');

const savingGoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  targetAmount: {
    type: Number,
    required: true
  },
  currentAmount: {
    type: Number,
    default: 0
  },

  autoSaving: {
    amount: {
      type: Number,
      default: 0
    },
    frequency: {
      type: String,
      enum: ['weekly', 'monthly', 'yearly', 'none'],
      default: 'none'
    },
    isUnlimited: {
      type: Boolean,
      default: true
    },
    timesToRepeat: {
      type: Number,
      default: null
    }
  }

}, { timestamps: true });

module.exports = mongoose.model('SavingGoal', savingGoalSchema);

