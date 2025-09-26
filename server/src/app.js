import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiResponse } from './utils/ApiResponse.js';

const app = express();

const allowedOrigins = [
"http://localhost:5173",  // correct frontend dev server
process.env.CORS_ORIGIN,
process.env.FRONTEND_URL
];

app.use(cors({
origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
    callback(null, true);
    } else {
    callback(new Error("Not allowed by CORS"));
    }
},
methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
allowedHeaders: [
    'Content-Type', 'Origin', 'X-Requested-With', 'Accept',
    'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'
],
credentials: true
}));  

// Handle preflight requests globally
// app.options("/.*/", cors());

// Body Parsing
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Route Imports
import userRouter from "./routes/user.routes.js";
import sweetRouter from "./routes/sweet.routes.js";

// Route Registration
app.use("/api/auth", userRouter);
app.use("/api/sweets", sweetRouter);

// Health check
app.get('/', (req, res) => {
  res.status(200).json(new ApiResponse(200, null, 'Welcome to Sweet Shop API'));
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// Global Error Middleware
app.use((err, req, res, next) => {
  console.error('Global Error Middleware:', {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    body: req.body,
    query: req.query,
    error: {
      message: err.message,
      stack: err.stack,
      name: err.name,
      code: err.code
    },
  });

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export { app };
