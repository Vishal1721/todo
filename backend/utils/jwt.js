const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET = process.env.JWT_SECRET ;

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, SECRET, { expiresIn: "1h" });
};

const verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};

module.exports = { generateToken, verifyToken };
