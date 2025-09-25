const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { config, models } = require("./src");
const { mongodbConnection } = config;
const { User } = models;

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: 'http://localhost:3000',
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

// Basic routes
app.get("/", (req, res) => {
  res.json({
    message: "todo bacekend api",
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

// Initializing database and starting server
const startServer = async () => {
  try {
    // connecting
    await mongodbConnection();

    // Create MySQL table

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();