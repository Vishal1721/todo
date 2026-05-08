require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");
const todoListRoutes = require("./routes/todoListRoutes");
const app = express();
app.use(express.json());

app.use("/api/lists", todoRoutes);
app.use("/api/lists", todoListRoutes);
app.use("/api/auth", authRoutes);
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
