import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const portfolioItems = pgTable("portfolio_items", {
  id: serial("id").primaryKey(),
  behanceId: text("behance_id").unique(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  projectUrl: text("project_url"),
  tags: text("tags").array(),
  category: text("category"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const caseStudies = pgTable("case_studies", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  description: text("description"),
  content: text("content"),
  imageUrl: text("image_url"),
  duration: text("duration"),
  category: text("category"),
  tags: text("tags").array(),
  featured: boolean("featured").default(false),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const siteContent = pgTable("site_content", {
  id: serial("id").primaryKey(),
  section: text("section").notNull().unique(),
  content: json("content").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  attachments: text("attachments").array(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertPortfolioItemSchema = createInsertSchema(portfolioItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCaseStudySchema = createInsertSchema(caseStudies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSiteContentSchema = createInsertSchema(siteContent).omit({
  id: true,
  updatedAt: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  read: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type PortfolioItem = typeof portfolioItems.$inferSelect;
export type InsertPortfolioItem = z.infer<typeof insertPortfolioItemSchema>;
export type CaseStudy = typeof caseStudies.$inferSelect;
export type InsertCaseStudy = z.infer<typeof insertCaseStudySchema>;
export type SiteContent = typeof siteContent.$inferSelect;
export type InsertSiteContent = z.infer<typeof insertSiteContentSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
