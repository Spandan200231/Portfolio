
// Vercel serverless function entry point
import dotenv from "dotenv";
import path from "path";

// Ensure environment variables are loaded
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic } from "./vite";

// Simple log function
const log = (message: string) => {
  const formattedTime = new Date().toISOString();
  console.log(`[${formattedTime}] ${message}`);
};

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Register API routes
registerRoutes(app);

// For Vercel, serve static files differently
if (process.env.VERCEL) {
  // In Vercel, static files are handled by the platform
  // Just serve API routes
  app.get('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
} else {
  // In development, serve Vite dev server or static files
  serveStatic(app);
}

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Export for Vercel
export default app;
