require("dotenv").config();
const express = require("express");

const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");
const todoListRoutes = require("./routes/todoListRoutes");

const app = express();


app.use(express.json());


app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});


const rateMap = new Map();

function rateLimit(req, res, next) {
  try {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    const windowMs = 60 * 1000;
    const maxRequests = 5;

    if (!rateMap.has(ip)) {
      rateMap.set(ip, []);
    }

    const timestamps = rateMap.get(ip) || [];

    const validHits = timestamps.filter((time) => {
      return now - time < windowMs;
    });

    if (validHits.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Try again later.",
      });
    }

    validHits.push(now);
    rateMap.set(ip, validHits);

    next();
  } catch (error) {
    console.error("Rate limiter error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error in rate limiter",
    });
  }
}

app.use(rateLimit);


app.use("/api/auth", authRoutes);
app.use("/api/lists", todoRoutes);
app.use("/api/lists", todoListRoutes);


app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Server is working",
    ip: req.ip,
  });
});


app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);

  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
