import {
  boolean,
  date,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export type SkillGroup = {
  category: string;
  icon: string;
  items: string[];
};

export type FocusArea = {
  title: string;
  description: string;
  icon: string;
};

export type ProjectLinks = {
  repository?: string;
  demo?: string;
};

export type Gpa = {
  score: number;
  scale: number;
};

const createdAt = () =>
  timestamp("created_at", { withTimezone: true }).notNull().defaultNow();

const updatedAt = () =>
  timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date());

export const postStatus = pgEnum("post_status", ["draft", "published"]);

/** 사이트 주인 정보 (1건) */
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  intro: text("intro").notNull(),
  skills: jsonb("skills").$type<SkillGroup[]>().notNull().default([]),
  focusAreas: jsonb("focus_areas").$type<FocusArea[]>().notNull().default([]),
  githubUrl: text("github_url"),
  email: text("email"),
  photoUrl: text("photo_url"),
});

export const experiences = pgTable("experiences", {
  id: uuid("id").primaryKey().defaultRandom(),
  company: text("company").notNull(),
  department: text("department"),
  position: text("position"),
  startDate: date("start_date", { mode: "string" }).notNull(),
  endDate: date("end_date", { mode: "string" }),
  duties: text("duties").array().notNull().default([]),
  achievements: text("achievements").array().notNull().default([]),
});

export const educations = pgTable("educations", {
  id: uuid("id").primaryKey().defaultRandom(),
  school: text("school").notNull(),
  degree: text("degree").notNull(),
  major: text("major").notNull(),
  startDate: date("start_date", { mode: "string" }).notNull(),
  endDate: date("end_date", { mode: "string" }),
  gpa: jsonb("gpa").$type<Gpa>(),
});

export const certifications = pgTable("certifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  issuer: text("issuer").notNull(),
  acquiredAt: date("acquired_at", { mode: "string" }).notNull(),
});

export const languageScores = pgTable("language_scores", {
  id: uuid("id").primaryKey().defaultRandom(),
  exam: text("exam").notNull(),
  score: text("score").notNull(),
  organizer: text("organizer").notNull(),
  acquiredAt: date("acquired_at", { mode: "string" }).notNull(),
});

/** 학위 논문 */
export const theses = pgTable("theses", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  abstract: text("abstract"),
  keywords: text("keywords").array().notNull().default([]),
  degreeId: uuid("degree_id")
    .notNull()
    .references(() => educations.id),
  url: text("url"),
});

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  contentMdx: text("content_mdx").notNull().default(""),
  role: text("role"),
  period: text("period"),
  techStack: text("tech_stack").array().notNull().default([]),
  links: jsonb("links").$type<ProjectLinks>().notNull().default({}),
  isPublished: boolean("is_published").notNull().default(false),
  isFeatured: boolean("is_featured").notNull().default(false),
});

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  contentMdx: text("content_mdx").notNull().default(""),
  tags: text("tags").array().notNull().default([]),
  status: postStatus("status").notNull().default("draft"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  updatedAt: updatedAt(),
});

export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: createdAt(),
});

/** 공개 설정 (1건) */
export const siteSettings = pgTable("site_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  showLanguageScores: boolean("show_language_scores").notNull().default(true),
  resumeFilePath: text("resume_file_path"),
});

export type Profile = typeof profiles.$inferSelect;
export type Experience = typeof experiences.$inferSelect;
export type Education = typeof educations.$inferSelect;
export type Certification = typeof certifications.$inferSelect;
export type LanguageScore = typeof languageScores.$inferSelect;
export type Thesis = typeof theses.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type SiteSetting = typeof siteSettings.$inferSelect;
