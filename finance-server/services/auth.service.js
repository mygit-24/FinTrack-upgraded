// services/auth.service.js
const jwt = require("jsonwebtoken");
const usersRepository = require("../repositories/users.repository");

const TOKEN_EXPIRES_IN = "3d";

function createToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
}

// REGISTER
async function register(payload) {
  const { firstName, lastName, email, password } = payload;

  if (!firstName || !lastName || !email || !password) {
    const err = new Error("All fields are required");
    err.statusCode = 400;
    throw err;
  }

  const existingUser = await usersRepository.findByEmail(email);
  if (existingUser) {
    const err = new Error("Email already registered");
    err.statusCode = 409;
    throw err;
  }

  // אם יש pre-save על הסכמה – הוא כבר ידאג להאש לסיסמה
  const user = await usersRepository.create({ firstName, lastName, email, password });

  const token = createToken(user._id);
  const safeUser = {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };

  return { token, user: safeUser };
}

// LOGIN
async function login(payload) {
  const { email, password } = payload;

  if (!email || !password) {
    const err = new Error("Email and password are required");
    err.statusCode = 400;
    throw err;
  }

  const user = await usersRepository.findByEmail(email);
  if (!user) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  // נשתמש במתודה comparePassword מהמודל (כמו בקוד שלך)
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  const token = createToken(user._id);
  const safeUser = {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };

  return { token, user: safeUser };
}

// GET ME מתוך הטוקן שבקוקי (הגרסה ה"Optional" שלך)
async function getUserFromToken(token) {
  if (!token) {
    const err = new Error("Unauthorized");
    err.statusCode = 401;
    throw err;
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    const err = new Error("Invalid token");
    err.statusCode = 401;
    throw err;
  }

  const user = await usersRepository.findByIdWithoutPassword(decoded.id);
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  return user;
}

module.exports = {
  register,
  login,
  getUserFromToken,
};
