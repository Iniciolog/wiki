import { useState } from "react";
import { Link } from "wouter";
import { Search, Menu, X, Moon, Sun, BookOpen, FileText, Settings, History, User, Star, Bookmark, Home, ChevronRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const categories = [
  { name: "Технологии", count: 42 },
  { name: "Наука", count: 38 },
  { name: "Программирование", count: 56 },
  { name: "Математика", count: 24 },
  { name: "Физика", count: 18 },
  { name: "История", count: 31 },
];

const allArticles = [
  { title: "Искусственный интеллект", category: "Технологии", updated: "10 янв 2026" },
  { title: "Квантовые вычисления", category: "Физика", updated: "10 янв 2026" },
  { title: "Машинное обучение", category: "Технологии", updated: "9 янв 2026" },
  { title: "Нейронные сети", category: "Технологии", updated: "8 янв 2026" },
  { title: "Блокчейн", category: "Технологии", updated: "7 янв 2026" },
  { title: "Криптография", category: "Математика", updated: "6 янв 2026" },
  { title: "Алгоритмы", category: "Программирование", updated: "5 янв 2026" },
  { title: "Структуры данных", category: "Программирование", updated: "4 янв 2026" },
  { title: "Теория графов", category: "Математика", updated: "3 янв 2026" },
  { title: "Теория вероятностей", category: "Математика", updated: "2 янв 2026" },
  { title: "Квантовая механика", category: "Физика", updated: "1 янв 2026" },
  { title: "Термодинамика", category: "Физика", updated: "31 дек 2025" },
  { title: "JavaScript", category: "Программирование", updated: "30 дек 2025" },
  { title: "Python", category: "Программирование", updated: "29 дек 2025" },
  { title: "TypeScript", category: "Программирование", updated: "28 дек 2025" },
  { title: "React", category: "Программирование", updated: "27 дек 2025" },
  { title: "История Интернета", category: "История", updated: "26 дек 2025" },
  { title: "ARPANET", category: "История", updated: "25 дек 2025" },
  { title: "Компьютерное зрение", category: "Технологии", updated: "24 дек 2025" },
  { title: "Обработка естественного языка", category: "Технологии", updated: "23 дек 2025" },
];

export default function AllArticlesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const filteredArticles = allArticles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedArticles = filteredArticles.reduce((acc, article) => {
    const firstLetter = article.title[0].toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(article);
    return acc;
  }, {} as Record<string, typeof allArticles>);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              data-testid="button-toggle-sidebar"
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link href="/" data-testid="link-home">
              <div className="flex items-center gap-2 cursor-pointer">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="font-serif font-semibold text-xl hidden sm:inline">Персональная Вики</span>
              </div>
            </Link>
          </div>
          
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Поиск по вики..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50"
                data-testid="input-search"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              data-testid="button-toggle-theme"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" data-testid="button-user">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed lg:relative lg:translate-x-0 z-40 w-64 h-[calc(100vh-56px)] bg-sidebar border-r border-sidebar-border transition-transform duration-200`}
        >
          <ScrollArea className="h-full py-4">
            <nav className="px-3 space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Навигация
              </div>
              <Link href="/" data-testid="link-nav-main">
                <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent transition-colors cursor-pointer">
                  <Home className="h-4 w-4" />
                  <span>Заглавная страница</span>
                </div>
              </Link>
              <Link href="/articles" data-testid="link-nav-articles">
                <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-sidebar-accent text-sidebar-accent-foreground cursor-pointer">
                  <FileText className="h-4 w-4" />
                  <span>Все статьи</span>
                </div>
              </Link>
              <Link href="/categories" data-testid="link-nav-categories">
                <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent transition-colors cursor-pointer">
                  <Bookmark className="h-4 w-4" />
                  <span>Категории</span>
                </div>
              </Link>
              <Link href="/random" data-testid="link-nav-random">
                <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent transition-colors cursor-pointer">
                  <Star className="h-4 w-4" />
                  <span>Случайная статья</span>
                </div>
              </Link>

              <div className="px-3 py-2 mt-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Инструменты
              </div>
              <Link href="/recent" data-testid="link-nav-recent">
                <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent transition-colors cursor-pointer">
                  <History className="h-4 w-4" />
                  <span>Свежие правки</span>
                </div>
              </Link>

              <div className="px-3 py-2 mt-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Категории
              </div>
              {categories.map((cat) => (
                <Link href={`/category/${cat.name}`} key={cat.name} data-testid={`link-category-${cat.name}`}>
                  <div className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-sidebar-accent transition-colors cursor-pointer">
                    <span className="text-sm">{cat.name}</span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {cat.count}
                    </span>
                  </div>
                </Link>
              ))}
            </nav>
          </ScrollArea>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="wiki-content">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Link href="/" data-testid="breadcrumb-home">
                  <span className="hover:text-wiki-link cursor-pointer">Заглавная</span>
                </Link>
                <ChevronRight className="h-3 w-3" />
                <span>Все статьи</span>
              </div>

              <h1>Все статьи</h1>
              
              <p className="text-muted-foreground mb-6">
                Всего статей в вики: <strong>{allArticles.length}</strong>
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  data-testid="filter-all"
                >
                  Все
                </Button>
                {categories.map((cat) => (
                  <Button
                    key={cat.name}
                    variant={selectedCategory === cat.name ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.name)}
                    data-testid={`filter-${cat.name}`}
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>

              {Object.entries(groupedArticles)
                .sort(([a], [b]) => a.localeCompare(b, 'ru'))
                .map(([letter, articles]) => (
                  <div key={letter} className="mb-6">
                    <h2 className="text-2xl font-serif">{letter}</h2>
                    <ul className="space-y-2">
                      {articles.map((article) => (
                        <li key={article.title} className="flex items-center justify-between">
                          <Link href={`/article/${encodeURIComponent(article.title)}`} data-testid={`link-article-${article.title}`}>
                            <span className="text-wiki-link hover:underline cursor-pointer">{article.title}</span>
                          </Link>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Badge variant="secondary" className="font-normal">{article.category}</Badge>
                            <span>{article.updated}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
