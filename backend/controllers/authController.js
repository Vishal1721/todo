const Joi = require("joi");
const { createUser, loginUser } = require("../services/authService");
const { generateToken } = require("../utils/jwt");

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const register = async (req, res) => {
  try {

    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, password } = req.body;
    const newUser = await createUser(email, password);

    res
      .status(201)
      .json({ message: "User registered successfully", userId: newUser.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, password } = req.body;
    const user = await loginUser(email, password);
    const token = generateToken(user.id);

    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = { register, login };
