import { 
  users, 
  articles, 
  categories,
  type User, 
  type InsertUser,
  type Article,
  type InsertArticle,
  type Category,
  type InsertCategory
} from "@shared/schema";
import { db } from "./db";
import { eq, ilike, or, desc, sql, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Article operations
  getArticle(id: string): Promise<Article | undefined>;
  getArticleByTitle(title: string): Promise<Article | undefined>;
  getAllArticles(): Promise<Article[]>;
  getPublishedArticles(): Promise<Article[]>;
  getPendingArticles(): Promise<Article[]>;
  getArticlesByAuthor(authorId: string): Promise<Article[]>;
  searchArticles(query: string): Promise<Article[]>;
  getArticlesByCategory(categoryName: string): Promise<Article[]>;
  getRecentArticles(limit?: number): Promise<Article[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: string, article: Partial<InsertArticle>): Promise<Article | undefined>;
  approveArticle(id: string): Promise<Article | undefined>;
  rejectArticle(id: string): Promise<boolean>;
  deleteArticle(id: string): Promise<boolean>;
  
  // Category operations
  getCategory(id: string): Promise<Category | undefined>;
  getCategoryByName(name: string): Promise<Category | undefined>;
  getAllCategories(): Promise<Category[]>;
  getCategoriesWithCounts(): Promise<{ name: string; count: number }[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  deleteCategory(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Article operations
  async getArticle(id: string): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.id, id));
    return article || undefined;
  }

  async getArticleByTitle(title: string): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.title, title));
    return article || undefined;
  }

  async getAllArticles(): Promise<Article[]> {
    return await db.select().from(articles).orderBy(articles.title);
  }

  async getPublishedArticles(): Promise<Article[]> {
    return await db.select().from(articles).where(eq(articles.status, "published")).orderBy(articles.title);
  }

  async getPendingArticles(): Promise<Article[]> {
    return await db.select().from(articles).where(eq(articles.status, "pending")).orderBy(desc(articles.createdAt));
  }

  async getArticlesByAuthor(authorId: string): Promise<Article[]> {
    return await db.select().from(articles).where(eq(articles.authorId, authorId)).orderBy(desc(articles.createdAt));
  }

  async searchArticles(query: string): Promise<Article[]> {
    return await db
      .select()
      .from(articles)
      .where(
        and(
          eq(articles.status, "published"),
          or(
            ilike(articles.title, `%${query}%`),
            ilike(articles.intro, `%${query}%`)
          )
        )
      )
      .orderBy(articles.title);
  }

  async getArticlesByCategory(categoryName: string): Promise<Article[]> {
    return await db
      .select()
      .from(articles)
      .where(and(
        eq(articles.status, "published"),
        sql`${categoryName} = ANY(${articles.categoryNames})`
      ))
      .orderBy(articles.title);
  }

  async getRecentArticles(limit: number = 10): Promise<Article[]> {
    return await db
      .select()
      .from(articles)
      .where(eq(articles.status, "published"))
      .orderBy(desc(articles.updatedAt))
      .limit(limit);
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const [article] = await db
      .insert(articles)
      .values(insertArticle as any)
      .returning();
    return article;
  }

  async updateArticle(id: string, updateData: Partial<InsertArticle>): Promise<Article | undefined> {
    const [article] = await db
      .update(articles)
      .set({ ...updateData, updatedAt: new Date() } as any)
      .where(eq(articles.id, id))
      .returning();
    return article || undefined;
  }

  async approveArticle(id: string): Promise<Article | undefined> {
    const [article] = await db
      .update(articles)
      .set({ status: "published", updatedAt: new Date() })
      .where(eq(articles.id, id))
      .returning();
    return article || undefined;
  }

  async rejectArticle(id: string): Promise<boolean> {
    const result = await db.delete(articles).where(and(eq(articles.id, id), eq(articles.status, "pending")));
    return result.rowCount !== null && result.rowCount > 0;
  }

  async deleteArticle(id: string): Promise<boolean> {
    const result = await db.delete(articles).where(eq(articles.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Category operations
  async getCategory(id: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async getCategoryByName(name: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.name, name));
    return category || undefined;
  }

  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.name);
  }

  async getCategoriesWithCounts(): Promise<{ name: string; count: number }[]> {
    const publishedArticles = await db.select().from(articles).where(eq(articles.status, "published"));
    const categoryCounts = new Map<string, number>();

    for (const article of publishedArticles) {
      for (const categoryName of article.categoryNames) {
        categoryCounts.set(categoryName, (categoryCounts.get(categoryName) || 0) + 1);
      }
    }

    return Array.from(categoryCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values(insertCategory)
      .returning();
    return category;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();
