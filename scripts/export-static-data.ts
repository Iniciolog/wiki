import { db } from "../server/db";
import { articles, categories } from "../shared/schema";
import { eq, sql } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

async function exportStaticData() {
  console.log("Exporting static data...");

  const publishedArticles = await db
    .select()
    .from(articles)
    .where(eq(articles.status, "published"));

  console.log(`Found ${publishedArticles.length} published articles`);

  const categoriesWithCounts = await db.execute(sql`
    SELECT name, COUNT(*) as count 
    FROM (SELECT unnest(category_names) as name FROM articles WHERE status = 'published') sub 
    GROUP BY name 
    ORDER BY name
  `);

  const outputDir = path.join(process.cwd(), "client/public/data");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(outputDir, "articles.json"),
    JSON.stringify(publishedArticles, null, 2)
  );

  fs.writeFileSync(
    path.join(outputDir, "categories.json"),
    JSON.stringify(categoriesWithCounts.rows, null, 2)
  );

  console.log("Static data exported to client/public/data/");
  console.log(`- articles.json: ${publishedArticles.length} articles`);
  console.log(`- categories.json: ${categoriesWithCounts.rows.length} categories`);
}

exportStaticData()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error exporting data:", err);
    process.exit(1);
  });
