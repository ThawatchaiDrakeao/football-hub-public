const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { installOptionalStartupGuards } = require("./utils/optionalStartup");
const connectDB = require("./config/db");
const { getAllowedOrigins, isAllowedOrigin } = require("./utils/corsOrigins");

const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const {
  communityPostRouter,
  joinRequestRouter,
} = require("./routes/communityRoutes");
const fieldRoutes = require("./routes/fieldRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");

const { errorHandler, notFound } = require("./middlewares/errorMiddleware");

const app = express();
const port = process.env.PORT || 5000;

installOptionalStartupGuards();

/**
 * =========================
 * Middleware
 * =========================
 */

// Request logger (debug production easier)
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.url}`);
  next();
});

// CORS (production-safe)
app.use(
  cors({
    origin(origin, callback) {
      const allowedOrigins = getAllowedOrigins();

      if (!origin) return callback(null, true);

      if (isAllowedOrigin(origin, allowedOrigins)) {
        return callback(null, true);
      }

      console.warn("[CORS BLOCKED]:", origin);
      return callback(null, false);
    },
  })
);

// JSON parser
app.use(express.json({ limit: "1mb" }));

/**
 * =========================
 * Health Check
 * =========================
 */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "football-hub-backend",
    time: new Date().toISOString(),
  });
});

/**
 * =========================
 * Routes
 * =========================
 */
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/community-posts", communityPostRouter);
app.use("/api/fields", fieldRoutes);
app.use("/api/join-requests", joinRequestRouter);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);

/**
 * =========================
 * Error Handling
 * =========================
 */
app.use(notFound);
app.use(errorHandler);

/**
 * =========================
 * Start Server
 * =========================
 */
const startServer = async () => {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`[BOOT] Football Hub backend running on port ${port}`);
    });
  } catch (err) {
    console.error("[FATAL] Failed to start server:", err);
    process.exit(1);
  }
};

startServer();