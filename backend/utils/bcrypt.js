const bcrypt = require("bcrypt");

async function hashPassword(password) {
  const saltRounds = 10;
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (err) {
    throw new Error("Error hashing password");
  }
}

async function verifyPassword(password, storedHash) {
  try {
    const isMatch = await bcrypt.compare(password, storedHash);
    return isMatch;
  } catch (err) {
    throw new Error("Error verifying password");
  }
}

module.exports = { hashPassword, verifyPassword };
