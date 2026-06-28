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

const allowedOrigins = getAllowedOrigins();

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin, allowedOrigins)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json({ limit: "100kb" }));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "football-hub-backend",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/community-posts", communityPostRouter);
app.use("/api/fields", fieldRoutes);
app.use("/api/join-requests", joinRequestRouter);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(`Football Hub backend running on port ${port}`);
  });
};

startServer();
