// controllers/auth.controller.js
const authService = require("../services/auth.service");

// יצירת טוקן וקוקי נעשים דרך ה-service, כאן רק שמים את הקוקי ומשיבים תשובה

exports.register = async (req, res) => {
  try {
    const { token, user } = await authService.register(req.body);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax",
      // אם תרצי בעתיד: secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error("Register error:", error);

    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { token, user } = await authService.login(req.body);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Lax",
      // secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error("Login error:", error);

    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    res.status(500).json({ message: "Server error" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

// Optional - קבלת מידע על המשתמש מתוך הטוקן בקוקי
exports.getMe = async (req, res) => {
  try {
    const token = req.cookies.token;

    const user = await authService.getUserFromToken(token);
    res.json(user);
  } catch (error) {
    console.error("getMe (auth) error:", error);

    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    res.status(401).json({ message: "Invalid token" });
  }
};
