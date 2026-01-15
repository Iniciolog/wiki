import type { Article } from "@shared/schema";

export interface CategoryWithCount {
  name: string;
  count: number;
}

let articlesCache: Article[] | null = null;
let categoriesCache: CategoryWithCount[] | null = null;

// Get the base path for assets (works on both local and GitHub Pages)
const getBasePath = () => {
  if (typeof window !== 'undefined') {
    return new URL('.', window.location.href).pathname;
  }
  return '/';
};

export async function getArticles(): Promise<Article[]> {
  if (articlesCache) return articlesCache;
  
  const basePath = getBasePath();
  const response = await fetch(`${basePath}data/articles.json`);
  if (!response.ok) {
    throw new Error(`Failed to load articles: ${response.status}`);
  }
  articlesCache = await response.json();
  return articlesCache!;
}

export async function getCategories(): Promise<CategoryWithCount[]> {
  if (categoriesCache) return categoriesCache;
  
  const basePath = getBasePath();
  const response = await fetch(`${basePath}data/categories.json`);
  if (!response.ok) {
    throw new Error(`Failed to load categories: ${response.status}`);
  }
  categoriesCache = await response.json();
  return categoriesCache!;
}

export async function getArticleByTitle(title: string): Promise<Article | undefined> {
  const articles = await getArticles();
  return articles.find(a => a.title === title);
}

export async function getArticlesByCategory(categoryName: string): Promise<Article[]> {
  const articles = await getArticles();
  return articles.filter(a => a.categoryNames.includes(categoryName));
}

export async function getRecentArticles(limit: number = 10): Promise<Article[]> {
  const articles = await getArticles();
  return [...articles]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);
}

export async function searchArticles(query: string): Promise<Article[]> {
  const articles = await getArticles();
  const lowerQuery = query.toLowerCase();
  return articles.filter(a => 
    a.title.toLowerCase().includes(lowerQuery) ||
    a.intro.toLowerCase().includes(lowerQuery)
  );
}

export async function getRandomArticle(): Promise<Article | undefined> {
  const articles = await getArticles();
  if (articles.length === 0) return undefined;
  const randomIndex = Math.floor(Math.random() * articles.length);
  return articles[randomIndex];
}
