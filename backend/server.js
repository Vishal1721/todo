require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");
const todoListRoutes = require("./routes/todoListRoutes");
const app = express();
app.use(express.json());


const rateMap = new Map();
//Rate-Limiter
function rateLimit(req, res, next) {
    const ip = req.ip;
    const now = Date.now();
    
    const windowMs = 60 * 1000; 
    const maxRequests = 5;
    if (!rateMap.has(ip)) {
        rateMap.set(ip, []);
    }
    const timestamps = rateMap.get(ip);
    const hits = timestamps.filter((time) => {
        return now - time < windowMs;
    });
    
    if (hits.length >= maxRequests) {
        return res.status(429).json({
            success: false,
            message: "Too many requests. Try again later.",
        });
    }
    hits.push(now);
    rateMap.set(ip, hits);
    next();
}


app.use(rateLimit);
app.use("/api/lists", todoRoutes);
app.use("/api/lists", todoListRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Request allowed",
    ip: req.ip,
  });
});


app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
