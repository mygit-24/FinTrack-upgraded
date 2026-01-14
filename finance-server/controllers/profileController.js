// controllers/user.controller.js
const usersService = require("../services/users.service");

// קבלת המשתמש המחובר
exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id; // מגיע מה־JWT / middleware

    const user = await usersService.getMe(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("GetMe error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// עדכון פרופיל כולל סיסמה
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const updated = await usersService.updateProfile(userId, req.body);
    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("UpdateProfile error:", err);

    // אם ב-service שמנו statusCode (למשל על סיסמה ישנה לא נכונה)
    if (err.statusCode === 400) {
      return res.status(400).json({ message: err.message });
    }

    res.status(500).json({ message: "Server Error" });
  }
};
