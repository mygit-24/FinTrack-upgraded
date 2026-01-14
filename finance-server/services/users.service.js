// services/users.service.js
const bcrypt = require("bcrypt");
const usersRepository = require("../repositories/users.repository");

// החזרת פרטי המשתמש (בלי סיסמה)
async function getMe(userId) {
  const user = await usersRepository.findByIdWithoutPassword(userId);
  if (!user) return null;
  return user; // כבר בלי password
}

// עדכון פרופיל כולל סיסמה
async function updateProfile(userId, payload) {
  const { firstName, lastName, email, oldPassword, password } = payload;

  const user = await usersRepository.findById(userId);
  if (!user) return null;

  // עדכון שדות בסיסיים
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (email) user.email = email;

  // עדכון סיסמה (אם נשלח גם oldPassword וגם password חדש)
  if (oldPassword && password) {
    const isMatch = await bcrypt.compare(oldPassword.trim(), user.password);
    if (!isMatch) {
      // נזרוק שגיאה "עסקית" כדי שהקונטרולר יחזיר 400
      const err = new Error("Old password is incorrect");
      err.statusCode = 400;
      throw err;
    }

    user.password = await bcrypt.hash(password, 10);
  }

  await usersRepository.save(user);

  // מחזירים רק שדות בטוחים
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };
}

module.exports = {
  getMe,
  updateProfile,
};
