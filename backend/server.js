const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { config, models } = require("./src");
const { mongodbConnection } = config;

const app = express();

// Use dynamic port for Render
const PORT = process.env.PORT || 5000;

// CORS: local + production frontend
const allowedOrigins = [
  process.env.FRONTEND_URL // set this in Render env
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin like Postman
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Routes
const { routes } = require("./src");
app.use("/api/users", routes.UserRoutes);
app.use("/api/tasks", routes.TaskRoutes);

// Basic root route
app.get("/", (req, res) => {
  res.json({
    message: "Todo backend API",
    success: true,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
});

// Initialize DB and start server
const startServer = async () => {
  try {
    // MongoDB connection
    await mongodbConnection(process.env.MONGODB_URI);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();
