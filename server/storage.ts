
import { MongoClient, Db, Collection, ObjectId } from "mongodb";
import { 
  users, 
  portfolioItems, 
  caseStudies, 
  siteContent, 
  contactMessages,
  type User, 
  type InsertUser,
  type PortfolioItem,
  type InsertPortfolioItem,
  type CaseStudy,
  type InsertCaseStudy,
  type SiteContent,
  type InsertSiteContent,
  type ContactMessage,
  type InsertContactMessage
} from "@shared/schema";

// MongoDB connection
let mongoClient: MongoClient | null = null;
let mongoDb: Db | null = null;

async function connectToMongoDB() {
  if (mongoClient && mongoDb) {
    return mongoDb;
  }

  try {
    // Use environment variable for MongoDB URI
    const mongoUri = process.env.MONGODB_URI || "mongodb+srv://portfolioUser:Spandan200231@cluster0.lscdfht.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    
    mongoClient = new MongoClient(mongoUri);
    await mongoClient.connect();
    mongoDb = mongoClient.db("portfolio");
    
    console.log("✅ Connected to MongoDB Atlas successfully");
    
    // Initialize indexes for better performance
    await initializeIndexes(mongoDb);
    
    return mongoDb;
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB Atlas:", error);
    console.log("💡 Make sure to:");
    console.log("1. Replace <password> in MongoDB URI with your actual password");
    console.log("2. Add your IP address to MongoDB Atlas Network Access");
    console.log("3. Check your internet connection");
    throw error;
  }
}

async function initializeIndexes(db: Db) {
  try {
    // Create indexes for better query performance
    await db.collection("users").createIndex({ email: 1 }, { unique: true });
    
    // Drop existing behanceId index if it exists
    try {
      await db.collection("portfolioItems").dropIndex("behanceId_1");
    } catch (dropError) {
      // Index might not exist, which is fine
    }
    
    // Create new sparse unique index for behanceId (allows multiple null values)
    await db.collection("portfolioItems").createIndex(
      { behanceId: 1 }, 
      { 
        unique: true, 
        sparse: true,
        partialFilterExpression: { behanceId: { $type: "string" } }
      }
    );
    
    await db.collection("portfolioItems").createIndex({ featured: 1 });
    await db.collection("caseStudies").createIndex({ slug: 1 }, { unique: true });
    await db.collection("caseStudies").createIndex({ published: 1 });
    await db.collection("siteContent").createIndex({ section: 1 }, { unique: true });
    await db.collection("contactMessages").createIndex({ createdAt: -1 });
    await db.collection("contactMessages").createIndex({ read: 1 });
    
    console.log("📊 Database indexes created successfully");
  } catch (error) {
    console.log("⚠️ Index creation warning (this is normal on first run):", error.message);
  }
}

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Portfolio management
  getPortfolioItems(): Promise<PortfolioItem[]>;
  getPortfolioItem(id: number): Promise<PortfolioItem | undefined>;
  getPortfolioItemByBehanceId(behanceId: string): Promise<PortfolioItem | undefined>;
  createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem>;
  updatePortfolioItem(id: number, item: Partial<InsertPortfolioItem>): Promise<PortfolioItem | undefined>;
  deletePortfolioItem(id: number): Promise<boolean>;
  getFeaturedPortfolioItems(): Promise<PortfolioItem[]>;

  // Case studies management
  getCaseStudies(): Promise<CaseStudy[]>;
  getCaseStudy(id: number): Promise<CaseStudy | undefined>;
  getCaseStudyBySlug(slug: string): Promise<CaseStudy | undefined>;
  createCaseStudy(study: InsertCaseStudy): Promise<CaseStudy>;
  updateCaseStudy(id: number, study: Partial<InsertCaseStudy>): Promise<CaseStudy | undefined>;
  deleteCaseStudy(id: number): Promise<boolean>;
  getPublishedCaseStudies(): Promise<CaseStudy[]>;

  // Site content management
  getSiteContent(section: string): Promise<SiteContent | undefined>;
  updateSiteContent(content: InsertSiteContent): Promise<SiteContent>;

  // Contact messages
  getContactMessages(): Promise<ContactMessage[]>;
  getContactMessage(id: number): Promise<ContactMessage | undefined>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  markMessageAsRead(id: number): Promise<boolean>;
  deleteContactMessage(id: number): Promise<boolean>;

  // Analytics
  trackPageView(page: string, userAgent?: string, ip?: string): Promise<void>;
  getAnalytics(): Promise<any>;
}

export class MongoStorage implements IStorage {
  private currentUserId: number = 1;
  private currentPortfolioId: number = 1;
  private currentCaseStudyId: number = 1;
  private currentSiteContentId: number = 1;
  private currentMessageId: number = 1;

  constructor() {
    this.initializeDefaultData();
  }

  private async initializeDefaultData() {
    try {
      const db = await connectToMongoDB();
      
      // Check if admin user exists
      const adminExists = await db.collection("users").findOne({ email: "spandan.majumder0231@gmail.com" });
      
      if (!adminExists) {
        // Create default admin user
        await this.createUser({
          email: "spandan.majumder0231@gmail.com",
          password: "$2b$10$yourhashedpassword",
          name: "Spandan Majumder"
        });
        console.log("👤 Default admin user created");
      }

      // Initialize default site content
      const defaultSections = ["hero", "contact", "social", "miscellaneous"];
      for (const section of defaultSections) {
        const exists = await db.collection("siteContent").findOne({ section });
        if (!exists) {
          await this.createDefaultSiteContent(section);
        }
      }
      
      console.log("🎨 Default site content initialized");
      
    } catch (error) {
      console.error("❌ Error initializing default data:", error);
    }
  }

  private async createDefaultSiteContent(section: string) {
    const db = await connectToMongoDB();
    
    const defaultContent = {
      hero: {
        name: "Spandan Majumder",
        title: "UI/UX Designer",
        introduction: "A passionate UI/UX Designer crafting intuitive digital experiences that bridge the gap between user needs and business goals. Based in Kolkata, I specialize in creating meaningful interactions through thoughtful design.",
        skills: [
          { name: "Figma", icon: "fas fa-paint-brush" },
          { name: "HTML & CSS", icon: "fab fa-html5" },
          { name: "Prototyping", icon: "fas fa-pen-nib" },
          { name: "Wireframing", icon: "fas fa-sitemap" },
          { name: "Adobe XD", icon: "fab fa-adobe" },
          { name: "InDesign", icon: "fas fa-layer-group" },
          { name: "Photoshop", icon: "fab fa-adobe" },
          { name: "Premiere Pro", icon: "fab fa-adobe" },
          { name: "Dora", icon: "fas fa-magic" }
        ]
      },
      contact: {
        email: "spandan.majumder0231@gmail.com",
        location: "Kolkata, West Bengal, India",
        responseTime: "Usually within 24 hours"
      },
      social: {
        linkedin: "https://www.linkedin.com/in/spandan-majumder-6b7b52366/",
        facebook: "https://www.facebook.com/profile.php?id=61576610008524",
        instagram: "https://www.instagram.com/uiux.spandan/?__pwa=1",
        behance: "https://www.behance.net/spandanmajumder3"
      },
      miscellaneous: {
        heroTagline: "Creating meaningful digital experiences through thoughtful design and user-centered approaches.",
        availabilityText: "Available for freelance projects and collaborations.",
        copyrightText: "© 2025 Spandan Majumder. All rights reserved.",
        footerCopyright: "© 2025 Spandan Majumder. All rights reserved.",
        caseStudiesDescription: "Deep dives into my design process, challenges faced, and solutions delivered for complex user experience problems.",
        portfolioDescription: "A curated selection of my recent projects showcasing user-centered design solutions across various digital platforms."
      }
      }
    };

    await db.collection("siteContent").insertOne({
      id: this.currentSiteContentId++,
      section,
      content: defaultContent[section],
      updatedAt: new Date()
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    try {
      const db = await connectToMongoDB();
      const user = await db.collection("users").findOne({ id });
      return user ? { ...user, _id: undefined } as User : undefined;
    } catch (error) {
      console.error("Error getting user:", error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const db = await connectToMongoDB();
      const user = await db.collection("users").findOne({ email });
      return user ? { ...user, _id: undefined } as User : undefined;
    } catch (error) {
      console.error("Error getting user by email:", error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const db = await connectToMongoDB();
      const id = this.currentUserId++;
      const user: User = { 
        ...insertUser, 
        id, 
        createdAt: new Date()
      };
      
      await db.collection("users").insertOne(user);
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  // Portfolio methods
  async getPortfolioItems(): Promise<PortfolioItem[]> {
    try {
      const db = await connectToMongoDB();
      const items = await db.collection("portfolioItems")
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      
      return items.map(item => ({ ...item, _id: undefined })) as PortfolioItem[];
    } catch (error) {
      console.error("Error getting portfolio items:", error);
      return [];
    }
  }

  async getPortfolioItem(id: number): Promise<PortfolioItem | undefined> {
    try {
      const db = await connectToMongoDB();
      const item = await db.collection("portfolioItems").findOne({ id });
      return item ? { ...item, _id: undefined } as PortfolioItem : undefined;
    } catch (error) {
      console.error("Error getting portfolio item:", error);
      return undefined;
    }
  }

  async getPortfolioItemByBehanceId(behanceId: string): Promise<PortfolioItem | undefined> {
    try {
      const db = await connectToMongoDB();
      const item = await db.collection("portfolioItems").findOne({ behanceId });
      return item ? { ...item, _id: undefined } as PortfolioItem : undefined;
    } catch (error) {
      console.error("Error getting portfolio item by Behance ID:", error);
      return undefined;
    }
  }

  async createPortfolioItem(insertItem: InsertPortfolioItem): Promise<PortfolioItem> {
    try {
      const db = await connectToMongoDB();
      const id = this.currentPortfolioId++;
      const now = new Date();
      
      const item: any = {
        id,
        title: insertItem.title,
        imageUrl: insertItem.imageUrl,
        description: insertItem.description || null,
        projectUrl: insertItem.projectUrl || null,
        tags: insertItem.tags || null,
        category: insertItem.category || null,
        featured: insertItem.featured || null,
        createdAt: now,
        updatedAt: now,
      };

      // Only include behanceId if it's provided and not empty
      if (insertItem.behanceId && insertItem.behanceId.trim()) {
        item.behanceId = insertItem.behanceId;
      }

      await db.collection("portfolioItems").insertOne(item);
      return { ...item, behanceId: item.behanceId || null } as PortfolioItem;
    } catch (error) {
      console.error("Error creating portfolio item:", error);
      throw error;
    }
  }

  async updatePortfolioItem(id: number, updateData: Partial<InsertPortfolioItem>): Promise<PortfolioItem | undefined> {
    try {
      const db = await connectToMongoDB();
      const result = await db.collection("portfolioItems").findOneAndUpdate(
        { id },
        { 
          $set: { 
            ...updateData, 
            updatedAt: new Date() 
          } 
        },
        { returnDocument: 'after' }
      );

      return result ? { ...result, _id: undefined } as PortfolioItem : undefined;
    } catch (error) {
      console.error("Error updating portfolio item:", error);
      return undefined;
    }
  }

  async deletePortfolioItem(id: number): Promise<boolean> {
    try {
      const db = await connectToMongoDB();
      const result = await db.collection("portfolioItems").deleteOne({ id });
      return result.deletedCount > 0;
    } catch (error) {
      console.error("Error deleting portfolio item:", error);
      return false;
    }
  }

  async getFeaturedPortfolioItems(): Promise<PortfolioItem[]> {
    try {
      const db = await connectToMongoDB();
      const items = await db.collection("portfolioItems")
        .find({ featured: true })
        .sort({ createdAt: -1 })
        .toArray();
      
      return items.map(item => ({ ...item, _id: undefined })) as PortfolioItem[];
    } catch (error) {
      console.error("Error getting featured portfolio items:", error);
      return [];
    }
  }

  // Case study methods
  async getCaseStudies(): Promise<CaseStudy[]> {
    try {
      const db = await connectToMongoDB();
      const studies = await db.collection("caseStudies")
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      
      return studies.map(study => ({ ...study, _id: undefined })) as CaseStudy[];
    } catch (error) {
      console.error("Error getting case studies:", error);
      return [];
    }
  }

  async getCaseStudy(id: number): Promise<CaseStudy | undefined> {
    try {
      const db = await connectToMongoDB();
      const study = await db.collection("caseStudies").findOne({ id });
      return study ? { ...study, _id: undefined } as CaseStudy : undefined;
    } catch (error) {
      console.error("Error getting case study:", error);
      return undefined;
    }
  }

  async getCaseStudyBySlug(slug: string): Promise<CaseStudy | undefined> {
    try {
      const db = await connectToMongoDB();
      const study = await db.collection("caseStudies").findOne({ slug });
      return study ? { ...study, _id: undefined } as CaseStudy : undefined;
    } catch (error) {
      console.error("Error getting case study by slug:", error);
      return undefined;
    }
  }

  async createCaseStudy(insertStudy: InsertCaseStudy): Promise<CaseStudy> {
    try {
      const db = await connectToMongoDB();
      const id = this.currentCaseStudyId++;
      const now = new Date();
      
      const study: CaseStudy = {
        id,
        slug: insertStudy.slug,
        title: insertStudy.title,
        subtitle: insertStudy.subtitle || null,
        description: insertStudy.description || null,
        content: insertStudy.content || null,
        imageUrl: insertStudy.imageUrl || null,
        duration: insertStudy.duration || null,
        category: insertStudy.category || null,
        tags: insertStudy.tags || null,
        featured: insertStudy.featured || null,
        published: insertStudy.published || null,
        createdAt: now,
        updatedAt: now,
      };

      await db.collection("caseStudies").insertOne(study);
      return study;
    } catch (error) {
      console.error("Error creating case study:", error);
      throw error;
    }
  }

  async updateCaseStudy(id: number, updateData: Partial<InsertCaseStudy>): Promise<CaseStudy | undefined> {
    try {
      const db = await connectToMongoDB();
      const result = await db.collection("caseStudies").findOneAndUpdate(
        { id },
        { 
          $set: { 
            ...updateData, 
            updatedAt: new Date() 
          } 
        },
        { returnDocument: 'after' }
      );

      return result ? { ...result, _id: undefined } as CaseStudy : undefined;
    } catch (error) {
      console.error("Error updating case study:", error);
      return undefined;
    }
  }

  async deleteCaseStudy(id: number): Promise<boolean> {
    try {
      const db = await connectToMongoDB();
      const result = await db.collection("caseStudies").deleteOne({ id });
      return result.deletedCount > 0;
    } catch (error) {
      console.error("Error deleting case study:", error);
      return false;
    }
  }

  async getPublishedCaseStudies(): Promise<CaseStudy[]> {
    try {
      const db = await connectToMongoDB();
      const studies = await db.collection("caseStudies")
        .find({ published: true })
        .sort({ createdAt: -1 })
        .toArray();
      
      return studies.map(study => ({ ...study, _id: undefined })) as CaseStudy[];
    } catch (error) {
      console.error("Error getting published case studies:", error);
      return [];
    }
  }

  // Site content methods
  async getSiteContent(section: string): Promise<SiteContent | undefined> {
    try {
      const db = await connectToMongoDB();
      const content = await db.collection("siteContent").findOne({ section });
      return content ? { ...content, _id: undefined } as SiteContent : undefined;
    } catch (error) {
      console.error("Error getting site content:", error);
      return undefined;
    }
  }

  async updateSiteContent(content: InsertSiteContent): Promise<SiteContent> {
    try {
      const db = await connectToMongoDB();
      const now = new Date();
      
      const result = await db.collection("siteContent").findOneAndUpdate(
        { section: content.section },
        { 
          $set: {
            content: content.content,
            updatedAt: now
          },
          $setOnInsert: {
            id: this.currentSiteContentId++,
            section: content.section
          }
        },
        { 
          upsert: true, 
          returnDocument: 'after' 
        }
      );

      console.log(`✅ Updated ${content.section} content in MongoDB`);
      return { ...result, _id: undefined } as SiteContent;
    } catch (error) {
      console.error("Error updating site content:", error);
      throw error;
    }
  }

  // Contact message methods
  async getContactMessages(): Promise<ContactMessage[]> {
    try {
      const db = await connectToMongoDB();
      const messages = await db.collection("contactMessages")
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      
      return messages.map(msg => ({ ...msg, _id: undefined })) as ContactMessage[];
    } catch (error) {
      console.error("Error getting contact messages:", error);
      return [];
    }
  }

  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    try {
      const db = await connectToMongoDB();
      const message = await db.collection("contactMessages").findOne({ id });
      return message ? { ...message, _id: undefined } as ContactMessage : undefined;
    } catch (error) {
      console.error("Error getting contact message:", error);
      return undefined;
    }
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    try {
      const db = await connectToMongoDB();
      const id = this.currentMessageId++;
      
      const message: ContactMessage = {
        id,
        firstName: insertMessage.firstName,
        lastName: insertMessage.lastName,
        email: insertMessage.email,
        subject: insertMessage.subject,
        message: insertMessage.message,
        attachments: insertMessage.attachments ?? null,
        read: false,
        createdAt: new Date(),
      };

      await db.collection("contactMessages").insertOne(message);
      return message;
    } catch (error) {
      console.error("Error creating contact message:", error);
      throw error;
    }
  }

  async markMessageAsRead(id: number): Promise<boolean> {
    try {
      const db = await connectToMongoDB();
      const result = await db.collection("contactMessages").updateOne(
        { id },
        { $set: { read: true } }
      );
      
      return result.modifiedCount > 0;
    } catch (error) {
      console.error("Error marking message as read:", error);
      return false;
    }
  }

  async deleteContactMessage(id: number): Promise<boolean> {
    try {
      const db = await connectToMongoDB();
      const result = await db.collection("contactMessages").deleteOne({ id });
      return result.deletedCount > 0;
    } catch (error) {
      console.error("Error deleting contact message:", error);
      return false;
    }
  }

  // Analytics methods
  async trackPageView(page: string, userAgent?: string, ip?: string): Promise<void> {
    try {
      const db = await connectToMongoDB();
      await db.collection("analytics").insertOne({
        page,
        userAgent,
        ip,
        timestamp: new Date()
      });
    } catch (error) {
      console.error("Error tracking page view:", error);
    }
  }

  async getAnalytics(): Promise<any> {
    try {
      const db = await connectToMongoDB();
      const now = new Date();
      const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Get recent page views
      const recentViews = await db.collection("analytics")
        .find({ timestamp: { $gte: last30Days } })
        .toArray();

      // Calculate analytics
      const uniqueVisitors = new Set(
        recentViews.map(view => view.ip || view.userAgent || 'anonymous')
      ).size;

      // Top pages
      const pageViews = {};
      recentViews.forEach(view => {
        pageViews[view.page] = (pageViews[view.page] || 0) + 1;
      });

      const topPages = Object.entries(pageViews)
        .map(([page, views]) => ({ page, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);

      // Weekly data
      const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const weekData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
        return {
          day: weekDays[date.getDay()],
          visits: 0
        };
      });

      recentViews.forEach(view => {
        const dayIndex = Math.floor((now.getTime() - view.timestamp.getTime()) / (24 * 60 * 60 * 1000));
        if (dayIndex >= 0 && dayIndex < 7) {
          weekData[6 - dayIndex].visits++;
        }
      });

      return {
        totalVisits: recentViews.length,
        uniqueVisitors,
        pageViews: recentViews.length,
        bounceRate: 25.5, // Calculated estimate
        avgSessionDuration: 180, // 3 minutes average
        topPages,
        weeklyData,
        lastUpdated: now
      };
    } catch (error) {
      console.error("Error getting analytics:", error);
      return {
        totalVisits: 0,
        uniqueVisitors: 0,
        pageViews: 0,
        bounceRate: 0,
        avgSessionDuration: 0,
        topPages: [],
        weeklyData: []
      };
    }
  }
}

export const storage = new MongoStorage();
