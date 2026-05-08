const db = require("../config/db"); 
const { hashPassword, verifyPassword } = require("../utils/bcrypt");

const createUser = async (email, password) => {

  const [rows] = await db.query("SELECT * FROM Users WHERE email = ?", [email]);

  if (rows.length > 0) {
    throw new Error("User already exists with this email");
  }

  const passwordHash = await hashPassword(password);

  const [result] = await db.query(
    "INSERT INTO Users (email, password_hash) VALUES (?, ?)",
    [email, passwordHash],
  );

  return { id: result.insertId, email };
};

const loginUser = async (email, password) => {

  const [rows] = await db.query("SELECT * FROM Users WHERE email = ?", [email]);
  const user = rows[0];

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await verifyPassword(password, user.password_hash);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

 
  return { id: user.id, email: user.email };
};


module.exports = { createUser, loginUser };


