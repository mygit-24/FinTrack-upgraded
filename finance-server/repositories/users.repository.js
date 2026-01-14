// repositories/users.repository.js
const User = require("../models/User");

// למצוא משתמש לפי id (כולל סיסמה)
async function findById(id) {
  return User.findById(id);
}

// למצוא משתמש בלי שדה הסיסמה
async function findByIdWithoutPassword(id) {
  return User.findById(id).select("-password");
}

// למצוא לפי email
async function findByEmail(email) {
  return User.findOne({ email });
}

// יצירת משתמש חדש
async function create(data) {
  const user = new User(data);
  return user.save();
}

// עדכון לפי id (לא חובה לאותנטיקציה, אבל שימושי לפרופיל)
async function updateById(id, updates, options = { new: true }) {
  return User.findByIdAndUpdate(id, updates, options);
}

// שמירת אובייקט משתמש (mongoose document)
async function save(user) {
  return user.save();
}

module.exports = {
  findById,
  findByIdWithoutPassword,
  findByEmail,
  create,
  updateById,
  save,
};
