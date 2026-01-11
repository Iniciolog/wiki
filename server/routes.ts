import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertArticleSchema, insertCategorySchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { ensureAuthenticated, ensureAdmin } from "./auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Article routes
  
  // Get all published articles (public)
  app.get("/api/articles", async (req, res) => {
    try {
      const articles = await storage.getPublishedArticles();
      res.json(articles);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Search articles
  app.get("/api/articles/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const articles = await storage.searchArticles(query);
      res.json(articles);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get recent articles (recent changes)
  app.get("/api/articles/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const articles = await storage.getRecentArticles(limit);
      res.json(articles);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get articles by category
  app.get("/api/articles/by-category/:categoryName", async (req, res) => {
    try {
      const { categoryName } = req.params;
      const articles = await storage.getArticlesByCategory(decodeURIComponent(categoryName));
      res.json(articles);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get article by title
  app.get("/api/articles/by-title/:title", async (req, res) => {
    try {
      const title = decodeURIComponent(req.params.title);
      const article = await storage.getArticleByTitle(title);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get random article
  app.get("/api/articles/random", async (req, res) => {
    try {
      const articles = await storage.getPublishedArticles();
      if (articles.length === 0) {
        return res.status(404).json({ message: "No articles found" });
      }
      const randomIndex = Math.floor(Math.random() * articles.length);
      res.json(articles[randomIndex]);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get single article by ID
  app.get("/api/articles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const article = await storage.getArticle(id);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create article
  app.post("/api/articles", async (req, res) => {
    try {
      const result = insertArticleSchema.safeParse(req.body);
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ message: validationError.message });
      }
      const article = await storage.createArticle(result.data);
      res.status(201).json(article);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update article
  app.patch("/api/articles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const article = await storage.updateArticle(id, req.body);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Delete article
  app.delete("/api/articles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteArticle(id);
      if (!success) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // User article submission routes (protected)
  
  // Get published articles (for public display)
  app.get("/api/articles/published", async (req, res) => {
    try {
      const articles = await storage.getPublishedArticles();
      res.json(articles);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get user's own articles
  app.get("/api/my-articles", ensureAuthenticated, async (req, res) => {
    try {
      const articles = await storage.getArticlesByAuthor(req.user!.id);
      res.json(articles);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Submit article for review (user)
  app.post("/api/submit-article", ensureAuthenticated, async (req, res) => {
    try {
      const result = insertArticleSchema.safeParse({
        ...req.body,
        status: "pending",
        authorId: req.user!.id,
        updatedBy: req.user!.username,
      });
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ message: validationError.message });
      }
      const article = await storage.createArticle(result.data);
      res.status(201).json(article);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin moderation routes

  // Get pending articles (admin only)
  app.get("/api/admin/pending-articles", ensureAdmin, async (req, res) => {
    try {
      const articles = await storage.getPendingArticles();
      res.json(articles);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Approve article (admin only)
  app.post("/api/admin/articles/:id/approve", ensureAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const article = await storage.approveArticle(id);
      if (!article) {
        return res.status(404).json({ message: "Статья не найдена" });
      }
      res.json(article);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Reject article (admin only)
  app.post("/api/admin/articles/:id/reject", ensureAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.rejectArticle(id);
      if (!success) {
        return res.status(404).json({ message: "Статья не найдена или уже опубликована" });
      }
      res.json({ message: "Статья отклонена" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Category routes

  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get categories with article counts
  app.get("/api/categories/with-counts", async (req, res) => {
    try {
      const categories = await storage.getCategoriesWithCounts();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get category by name
  app.get("/api/categories/:name", async (req, res) => {
    try {
      const name = decodeURIComponent(req.params.name);
      const category = await storage.getCategoryByName(name);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create category
  app.post("/api/categories", async (req, res) => {
    try {
      const result = insertCategorySchema.safeParse(req.body);
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ message: validationError.message });
      }
      const category = await storage.createCategory(result.data);
      res.status(201).json(category);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Delete category
  app.delete("/api/categories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteCategory(id);
      if (!success) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Seed database with initial articles
  app.post("/api/seed", async (req, res) => {
    try {
      const seedArticles = [
        {
          title: "Инициология",
          intro: "Инициология — энергоинформационная система нового поколения, направленная на оздоровление и повышение качества жизни. Метод базируется на взаимодействии с энергетическими каналами, по которым поступают потоки космической энергии. Эффективность системы подтверждена научными исследованиями, тысячами практикующих Инициологов и результатами их клиентов.",
          infobox: {
            title: "Инициология",
            rows: [
              { label: "Тип", value: "Энергопрактика" },
              { label: "Направление", value: "Энергоинформационная система" },
              { label: "Основа", value: "Космические каналы" },
              { label: "Ступени", value: "4 основные + РМТ" },
              { label: "Сайт", value: "iniciolog.ru" },
            ],
          },
          sections: [
            {
              id: "overview",
              title: "Общие сведения",
              level: 2,
              content: `<p>Инициология — это энергетическая практика, направленная на оздоровление и повышение качества жизни. Метод базируется на взаимодействии с энергетическими каналами, по которым поступают потоки космической энергии.</p>
<p>Эти потоки благоприятно влияют на все сферы жизнедеятельности человека. Благодаря работе с каналами происходит физическое исцеление, очищение тонких энергетических структур, качественное улучшение всех сфер жизни.</p>
<p>Инициологию как инструмент влияния активно используют представители элиты деловой и бизнес-среды — ведущие профессионалы и предприниматели, занимающие ключевые позиции в экономике и управлении.</p>`,
            },
            {
              id: "spheres",
              title: "Сферы применения",
              level: 2,
              content: `<p>В <strong>социальной сфере</strong> практика работы с каналами способствует улучшению общественного положения, удачи, карьерного роста, бизнес-успехов и реализации личных целей.</p>
<p>В <strong>личной сфере</strong> специализированные каналы помогают улучшить климат в семье, укрепить личные взаимоотношения, формировать благоприятное окружение и взаимовыгодные связи.</p>
<p>В <strong>сфере безопасности</strong> каналы оберегают от врагов и недоброжелателей, защищают от негативных воздействий со стороны социума и других людей.</p>
<p>Воздействие каналов ощущается всеми на физическом уровне и может быть зарегистрировано приборами магнитно-резонансной диагностики. Результаты подтверждаются данными медицинского обследования.</p>`,
            },
          ],
          categoryNames: ["Основы", "Энергопрактика", "Система"],
          seeAlso: ["Энергетические каналы", "РМТ-технологии", "Ступени обучения", "Космоэнергетика и Инициология"],
          references: [
            "Официальный сайт Инициологии — iniciolog.ru",
            "Научные исследования эффективности системы",
            "Отзывы практикующих Инициологов",
          ],
        },
        {
          title: "Энергетические каналы",
          intro: "Энергетические каналы — основной инструмент работы в Инициологии. Представляют собой потоки космической энергии, которые направляются на пациента для исцеления, очищения и улучшения различных сфер жизни. Каждый канал имеет свою специализацию и целенаправленно работает с определёнными проблемами.",
          infobox: {
            title: "Энергетические каналы",
            rows: [
              { label: "Тип", value: "Энергетический инструмент" },
              { label: "Источник", value: "Космическая энергия" },
              { label: "Передача", value: "Через инициацию" },
              { label: "Срок действия", value: "Пожизненный" },
            ],
          },
          sections: [
            {
              id: "principle",
              title: "Принцип работы",
              level: 2,
              content: `<p>Энергетические каналы — это потоки космической энергии, которые Инициолог направляет на решение конкретных задач. В отличие от других энергопрактик, где целитель использует свою личную энергию, в Инициологии вся работа выполняется каналами.</p>
<p>От Инициолога требуется только открыть канал в начале сеанса и закрыть его в конце. Всё остальное — работа самого канала.</p>`,
            },
          ],
          categoryNames: ["Практика", "Основы", "Инструменты"],
          seeAlso: ["Инициология", "Ступени обучения", "Инициация"],
          references: ["Материалы обучения Инициологии", "iniciolog.ru"],
        },
        {
          title: "РМТ-технологии",
          intro: "РМТ (Ра-Ману-Тан) — высшая ступень энергоинформационного развития в системе Инициологии. Представляет собой верхний предел реализации человека в энергоинформационном плане в рамках земного существования. Доступна только опытным Мастерам и Мастерам-Учителям Инициологии.",
          infobox: {
            title: "РМТ-технологии",
            rows: [
              { label: "Уровень", value: "Высшая ступень" },
              { label: "Требования", value: "4-я ступень + опыт" },
              { label: "Уроков", value: "12" },
              { label: "Направление", value: "Эгрегоры, безопасность" },
            ],
          },
          sections: [
            {
              id: "nature",
              title: "Природа РМТ",
              level: 2,
              content: `<p>РМТ — это настройка разрешений и обратных энергоинформационных связей, соединяющих сознание человека с энергоинформационным полотном Вселенной по заложенным в энергетической системе человека природным неактивированным схемам.</p>`,
            },
          ],
          categoryNames: ["Продвинутый уровень", "Обучение", "Эгрегоры"],
          seeAlso: ["Инициология", "Ступени обучения", "Эгрегоры", "Энергоинформационная безопасность"],
          references: ["Программа курса РМТ — iniciolog.ru/rmt", "Материалы для Мастеров-Учителей"],
        },
        {
          title: "Ступени обучения",
          intro: "Система обучения в Инициологии включает несколько последовательных ступеней, каждая из которых даёт ученику новые каналы, технологии и возможности. Путь от ученика до Мастера-Учителя предполагает постепенное освоение всё более мощных инструментов энергоинформационной работы.",
          infobox: {
            title: "Ступени обучения",
            rows: [
              { label: "Всего ступеней", value: "4 основные + РМТ" },
              { label: "Начальный уровень", value: "1-я ступень" },
              { label: "Мастерская", value: "4-я ступень" },
              { label: "Высшая", value: "РМТ" },
            ],
          },
          sections: [
            {
              id: "first",
              title: "Первая ступень",
              level: 2,
              content: `<p>На первой ступени ученик получает базовые каналы для работы с собой и близкими. Изучаются основы системы, принципы работы с энергией и техника безопасности.</p>`,
            },
          ],
          categoryNames: ["Обучение", "Развитие", "Практика"],
          seeAlso: ["Инициология", "РМТ-технологии", "Энергетические каналы", "Инициация"],
          references: ["Программы обучения — iniciolog.ru", "Информация о сессиях и курсах"],
        },
        {
          title: "Космоэнергетика и Инициология",
          intro: "Сравнение двух энергоинформационных систем: Космоэнергетики и Инициологии. Несмотря на некоторое внешнее сходство, системы имеют принципиальные различия в подходе, эффективности и безопасности практики.",
          infobox: {
            title: "Сравнение систем",
            rows: [
              { label: "Космоэнергетика", value: "Составная система" },
              { label: "Инициология", value: "Целостная система" },
              { label: "Уровень", value: "Планетарный / Космический" },
            ],
          },
          sections: [
            {
              id: "differences",
              title: "Основные различия",
              level: 2,
              content: `<p><strong>Инициология</strong> создавалась как система для исцеления и благополучия человека. Вся структура этой системы, включая каналы и блоки посвящения, служит общей цели: здоровью и благополучию человека.</p>`,
            },
          ],
          categoryNames: ["Сравнения", "Основы"],
          seeAlso: ["Инициология", "Космоэнергетика"],
          references: ["iniciolog.ru", "Материалы сравнительного анализа"],
        },
      ];

      // Check if database already has articles
      const existingArticles = await storage.getAllArticles();
      if (existingArticles.length > 0) {
        return res.status(400).json({ 
          message: "Database already contains articles. Clear the database before seeding.", 
          count: existingArticles.length 
        });
      }

      // Create all seed articles
      const created = [];
      for (const articleData of seedArticles) {
        const article = await storage.createArticle(articleData);
        created.push(article);
      }

      res.status(201).json({ 
        message: "Database seeded successfully", 
        count: created.length,
        articles: created 
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  return httpServer;
}
