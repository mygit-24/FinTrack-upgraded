const User = require('../models/User');
const transactionmodel = require('../models/transaction');
const SavingGoal = require('../models/SavingGoal');

 

module.exports = async function deleteUserData(userId) {
  try {
    await Transaction.deleteMany({ userId });
    await User.deleteMany({ userId });
    await transactionmodel.deleteMany({ userId });
    await SavingGoal.deleteMany({ userId });
     
  } catch (err) {
    console.error('Error deleting user data:', err);
    throw err;
  }
};