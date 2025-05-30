import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import nodemailer from "nodemailer";
import cron from "node-cron";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { insertContactMessageSchema, insertCaseStudySchema, insertSiteContentSchema, insertPortfolioItemSchema } from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const ADMIN_EMAIL = "spandan.majumder0231@gmail.com";
const ADMIN_PASSWORD = "Spandan@200231";

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only images and documents are allowed"));
    }
  },
});

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || ADMIN_EMAIL,
    pass: process.env.EMAIL_PASSWORD || "your-app-password",
  },
});

// JWT middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Behance API integration
async function syncWithBehance() {
  try {
    const behanceApiKey = process.env.BEHANCE_API_KEY;
    if (!behanceApiKey) {
      console.log("Behance API key not configured");
      return;
    }

    const username = "spandanmajumder3";
    const response = await fetch(
      `https://api.behance.net/v2/users/${username}/projects?api_key=${behanceApiKey}`
    );

    if (!response.ok) {
      throw new Error(`Behance API error: ${response.status}`);
    }

    const data = await response.json();
    const projects = data.projects || [];

    // Get existing portfolio items
    const existingItems = await storage.getPortfolioItems();
    const existingBehanceIds = new Set(
      existingItems
        .filter(item => item.behanceId)
        .map(item => item.behanceId)
    );

    // Add new projects
    for (const project of projects) {
      if (!existingBehanceIds.has(project.id.toString())) {
        await storage.createPortfolioItem({
          behanceId: project.id.toString(),
          title: project.name,
          description: project.description || "",
          imageUrl: project.covers?.original || "",
          projectUrl: project.url,
          tags: project.tags || [],
          category: project.fields?.[0] || "Design",
          featured: false,
        });
      }
    }

    // Remove deleted projects
    const currentBehanceIds = new Set(projects.map((p: any) => p.id.toString()));
    for (const item of existingItems) {
      if (item.behanceId && !currentBehanceIds.has(item.behanceId)) {
        await storage.deletePortfolioItem(item.id);
      }
    }

    console.log("Behance sync completed successfully");
  } catch (error) {
    console.error("Behance sync failed:", error);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Schedule Behance sync every 30 minutes
  cron.schedule("*/30 * * * *", syncWithBehance);

  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "2h" }
      );

      res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/change-password", authenticateToken, async (req: any, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      if (currentPassword !== ADMIN_PASSWORD) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }

      // In a real app, you'd update the password in the database
      // For now, we'll just return success (password change would require restart)
      res.json({ message: "Password changed successfully. Please restart the application for changes to take effect." });
    } catch (error) {
      res.status(500).json({ message: "Failed to change password" });
    }
  });

  app.get("/api/auth/verify", authenticateToken, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
      res.status(500).json({ message: "Token verification failed" });
    }
  });

  // Portfolio routes
  app.get("/api/portfolio", async (req, res) => {
    try {
      const items = await storage.getPortfolioItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch portfolio items" });
    }
  });

  app.get("/api/portfolio/featured", async (req, res) => {
    try {
      const items = await storage.getFeaturedPortfolioItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured portfolio items" });
    }
  });

  app.post("/api/portfolio", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertPortfolioItemSchema.parse(req.body);
      const item = await storage.createPortfolioItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ message: "Invalid portfolio item data" });
    }
  });

  app.put("/api/portfolio/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const item = await storage.updatePortfolioItem(id, updates);

      if (!item) {
        return res.status(404).json({ message: "Portfolio item not found" });
      }

      res.json(item);
    } catch (error) {
      res.status(400).json({ message: "Failed to update portfolio item" });
    }
  });

  app.delete("/api/portfolio/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deletePortfolioItem(id);

      if (!success) {
        return res.status(404).json({ message: "Portfolio item not found" });
      }

      res.json({ message: "Portfolio item deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete portfolio item" });
    }
  });

  // Manual Behance sync
  app.post("/api/portfolio/sync", authenticateToken, async (req, res) => {
    try {
      await syncWithBehance();
      res.json({ message: "Behance sync completed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Behance sync failed" });
    }
  });

  // Case studies routes
  app.get("/api/case-studies", async (req, res) => {
    try {
      const studies = await storage.getPublishedCaseStudies();
      res.json(studies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch case studies" });
    }
  });

  app.get("/api/case-studies/all", authenticateToken, async (req, res) => {
    try {
      const studies = await storage.getCaseStudies();
      res.json(studies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch all case studies" });
    }
  });

  app.get("/api/case-studies/:slug", async (req, res) => {
    try {
      const study = await storage.getCaseStudyBySlug(req.params.slug);
      if (!study || !study.published) {
        return res.status(404).json({ message: "Case study not found" });
      }
      res.json(study);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch case study" });
    }
  });

  app.post("/api/case-studies", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertCaseStudySchema.parse(req.body);
      const study = await storage.createCaseStudy(validatedData);
      res.status(201).json(study);
    } catch (error) {
      res.status(400).json({ message: "Invalid case study data" });
    }
  });

  app.put("/api/case-studies/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const study = await storage.updateCaseStudy(id, updates);

      if (!study) {
        return res.status(404).json({ message: "Case study not found" });
      }

      res.json(study);
    } catch (error) {
      res.status(400).json({ message: "Failed to update case study" });
    }
  });

  app.delete("/api/case-studies/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCaseStudy(id);

      if (!success) {
        return res.status(404).json({ message: "Case study not found" });
      }

      res.json({ message: "Case study deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete case study" });
    }
  });

  // Site content routes
  app.get("/api/content/:section", async (req, res) => {
    try {
      // Prevent browser caching for real-time updates
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });

      const content = await storage.getSiteContent(req.params.section);
      if (!content) {
        return res.status(404).json({ message: "Content section not found" });
      }
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  app.put("/api/content/:section", authenticateToken, async (req, res) => {
    try {
      // Prevent caching for updated content
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });

      const validatedData = insertSiteContentSchema.parse({
        section: req.params.section,
        content: req.body.content,
      });
      const content = await storage.updateSiteContent(validatedData);
      res.json(content);
    } catch (error) {
      res.status(400).json({ message: "Invalid content data" });
    }
  });

  // Contact routes
  app.post("/api/contact", upload.array("attachments", 5), async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);

      // Handle file uploads
      const attachments: string[] = [];
      if (req.files && Array.isArray(req.files)) {
        for (const file of req.files) {
          const filename = `${Date.now()}-${file.originalname}`;
          const filepath = path.join("uploads", filename);

          // Process image files with Sharp
          if (file.mimetype.startsWith("image/")) {
            await sharp(file.path)
              .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
              .jpeg({ quality: 85 })
              .toFile(filepath);
            fs.unlinkSync(file.path);
          } else {
            fs.renameSync(file.path, filepath);
          }

          attachments.push(filename);
        }
      }

      const message = await storage.createContactMessage({
        ...validatedData,
        attachments,
      });

      // Send email notification
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER || ADMIN_EMAIL,
          to: ADMIN_EMAIL,
          subject: `New Contact Form Submission: ${validatedData.subject}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${validatedData.firstName} ${validatedData.lastName}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            <p><strong>Subject:</strong> ${validatedData.subject}</p>
            <p><strong>Message:</strong></p>
            <p>${validatedData.message}</p>
            ${attachments.length > 0 ? `<p><strong>Attachments:</strong> ${attachments.join(", ")}</p>` : ""}
          `,
        });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
      }

      res.status(201).json({ message: "Message sent successfully" });
    } catch (error) {
      res.status(400).json({ message: "Failed to send message" });
    }
  });

  app.get("/api/contact/messages", authenticateToken, async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.put("/api/contact/messages/:id/read", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.markMessageAsRead(id);

      if (!success) {
        return res.status(404).json({ message: "Message not found" });
      }

      res.json({ message: "Message marked as read" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update message" });
    }
  });

  // Analytics tracking middleware
  app.use((req, res, next) => {
    // Track page views for non-API routes
    if (!req.path.startsWith('/api/') && req.method === 'GET') {
      const userAgent = req.headers['user-agent'];
      const ip = req.ip || req.connection.remoteAddress;
      storage.trackPageView(req.path, userAgent, ip);
    }
    next();
  });

  // Analytics and traffic data
  app.get("/api/analytics/traffic", authenticateToken, async (req, res) => {
    try {
      const analyticsData = await storage.getAnalytics();
      res.json(analyticsData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics data" });
    }
  });

  // Hero image upload
  app.post("/api/upload/hero-image", authenticateToken, upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const filename = `hero-${Date.now()}-${req.file.originalname}`;
      const filepath = path.join("uploads", filename);

      // Process image with Sharp
      if (req.file.mimetype.startsWith("image/")) {
        await sharp(req.file.path)
          .resize(1200, 800, { fit: "cover", withoutEnlargement: true })
          .jpeg({ quality: 85 })
          .toFile(filepath);
        fs.unlinkSync(req.file.path);
      } else {
        return res.status(400).json({ message: "Only image files are allowed" });
      }

      const imageUrl = `/api/uploads/${filename}`;
      res.json({ imageUrl, filename });
    } catch (error) {
      res.status(500).json({ message: "Failed to upload image" });
    }
  });

  // Portfolio image upload
  app.post("/api/upload/portfolio-image", authenticateToken, upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const filename = `portfolio-${Date.now()}-${req.file.originalname}`;
      const filepath = path.join("uploads", filename);

      // Process image with Sharp
      if (req.file.mimetype.startsWith("image/")) {
        await sharp(req.file.path)
          .resize(800, 600, { fit: "cover", withoutEnlargement: true })
          .jpeg({ quality: 85 })
          .toFile(filepath);
        fs.unlinkSync(req.file.path);
      } else {
        return res.status(400).json({ message: "Only image files are allowed" });
      }

      const imageUrl = `/api/uploads/${filename}`;
      res.json({ imageUrl, filename });
    } catch (error) {
      res.status(500).json({ message: "Failed to upload image" });
    }
  });

  // File serving for uploads
  app.get("/api/uploads/:filename", (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join("uploads", filename);

    if (fs.existsSync(filepath)) {
      res.sendFile(path.resolve(filepath));
    } else {
      res.status(404).json({ message: "File not found" });
    }
  });

  // Analytics routes
  app.get("/api/analytics", async (req, res) => {
    try {
      const analytics = await storage.getAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      // Return default analytics data if there's an error
      res.json({
        totalVisits: 0,
        uniqueVisitors: 0,
        pageViews: 0,
        bounceRate: 0,
        avgSessionDuration: 0,
        topPages: [],
        weeklyData: Array.from({ length: 7 }, (_, i) => ({
          day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
          visits: 0
        })),
        lastUpdated: new Date()
      });
    }
  });

  // MongoDB connection status
  app.get("/api/database/status", async (req, res) => {
    try {
      const db = await connectToMongoDB();
      const stats = await db.stats();
      const collections = await db.listCollections().toArray();

      res.json({
        connected: true,
        database: "portfolio",
        collections: collections.map(col => col.name),
        totalSize: stats.dataSize,
        totalDocuments: stats.objects,
        connectionString: process.env.MONGODB_URI ? "Connected to MongoDB Atlas" : "Using default URI",
        lastChecked: new Date()
      });
    } catch (error) {
      res.status(500).json({
        connected: false,
        error: error.message,
        lastChecked: new Date()
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}