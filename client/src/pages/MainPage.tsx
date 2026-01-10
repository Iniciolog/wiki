import { useState } from "react";
import { Link } from "wouter";
import { Search, Menu, X, Moon, Sun, BookOpen, FileText, Settings, History, User, Star, Bookmark, Home, ChevronRight, ExternalLink, Edit, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const recentChanges = [
  { title: "Квантовые вычисления", date: "10 янв 2026", user: "Админ" },
  { title: "Искусственный интеллект", date: "9 янв 2026", user: "Админ" },
  { title: "Машинное обучение", date: "8 янв 2026", user: "Админ" },
  { title: "Блокчейн", date: "7 янв 2026", user: "Админ" },
];

const featuredArticles = [
  { title: "Искусственный интеллект", description: "Раздел компьютерных наук, занимающийся созданием интеллектуальных машин", category: "Технологии" },
  { title: "Квантовые вычисления", description: "Вычисления на основе квантово-механических явлений", category: "Физика" },
  { title: "Машинное обучение", description: "Подраздел ИИ, позволяющий системам обучаться на данных", category: "Технологии" },
  { title: "Нейронные сети", description: "Вычислительные системы, вдохновленные биологическим мозгом", category: "Технологии" },
];

const categories = [
  { name: "Технологии", count: 42 },
  { name: "Наука", count: 38 },
  { name: "Программирование", count: 56 },
  { name: "Математика", count: 24 },
  { name: "Физика", count: 18 },
  { name: "История", count: 31 },
];

export default function MainPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

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
                <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-sidebar-accent text-sidebar-accent-foreground cursor-pointer">
                  <Home className="h-4 w-4" />
                  <span>Заглавная страница</span>
                </div>
              </Link>
              <Link href="/articles" data-testid="link-nav-articles">
                <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent transition-colors cursor-pointer">
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
              <Link href="/settings" data-testid="link-nav-settings">
                <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent transition-colors cursor-pointer">
                  <Settings className="h-4 w-4" />
                  <span>Настройки</span>
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
              </div>

              <h1>Добро пожаловать в Персональную Вики</h1>
              
              <p className="text-lg text-muted-foreground mb-6">
                Ваша личная база знаний и энциклопедия. Создавайте, редактируйте и организовывайте информацию по вашим интересам.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-card border border-border rounded-lg p-5">
                  <h3 className="flex items-center gap-2 text-lg font-serif font-semibold mb-4 mt-0 border-0">
                    <Star className="h-5 w-5 text-primary" />
                    Избранные статьи
                  </h3>
                  <div className="space-y-3">
                    {featuredArticles.map((article) => (
                      <Link href={`/article/${encodeURIComponent(article.title)}`} key={article.title} data-testid={`link-featured-${article.title}`}>
                        <div className="group cursor-pointer">
                          <div className="flex items-start gap-2">
                            <ChevronRight className="h-4 w-4 mt-1 text-muted-foreground group-hover:text-primary transition-colors" />
                            <div>
                              <div className="text-wiki-link group-hover:underline font-medium">
                                {article.title}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {article.description}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-5">
                  <h3 className="flex items-center gap-2 text-lg font-serif font-semibold mb-4 mt-0 border-0">
                    <Clock className="h-5 w-5 text-primary" />
                    Последние изменения
                  </h3>
                  <div className="space-y-3">
                    {recentChanges.map((change) => (
                      <Link href={`/article/${encodeURIComponent(change.title)}`} key={change.title} data-testid={`link-recent-${change.title}`}>
                        <div className="group cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-wiki-link group-hover:underline">{change.title}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{change.date}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <h2>О вики</h2>
              <p>
                Персональная Вики — это ваше пространство для хранения и организации знаний. 
                Вдохновленная <a href="https://www.mediawiki.org" className="external" target="_blank" rel="noopener">MediaWiki</a>, 
                эта платформа предоставляет удобный интерфейс для создания связанных статей, категоризации информации 
                и быстрого поиска нужных данных.
              </p>

              <h3>Возможности</h3>
              <ul>
                <li><strong>Создание статей</strong> — пишите статьи с форматированием, изображениями и ссылками</li>
                <li><strong>Категории</strong> — организуйте статьи по темам и разделам</li>
                <li><strong>Поиск</strong> — мгновенный поиск по всей базе знаний</li>
                <li><strong>История изменений</strong> — отслеживайте все редакции</li>
                <li><strong>Темная тема</strong> — комфортное чтение в любое время</li>
              </ul>

              <h3>Быстрый старт</h3>
              <ol>
                <li>Используйте поиск вверху страницы для навигации</li>
                <li>Изучите <Link href="/categories"><span className="text-wiki-link hover:underline cursor-pointer">категории</span></Link> в боковом меню</li>
                <li>Откройте любую <Link href="/random"><span className="text-wiki-link hover:underline cursor-pointer">случайную статью</span></Link></li>
                <li>Нажмите на редактирование для внесения изменений</li>
              </ol>

              <div className="wiki-notice">
                <div className="wiki-notice-title">💡 Совет дня</div>
                <p className="mb-0">
                  Используйте клавишу <code>/</code> для быстрого перехода к поиску из любого места на сайте.
                </p>
              </div>

              <div className="wiki-category-box">
                <span>Категории:</span>
                <Link href="/category/Справка"><span className="text-wiki-link hover:underline cursor-pointer">Справка</span></Link>
                {" • "}
                <Link href="/category/Главная"><span className="text-wiki-link hover:underline cursor-pointer">Главная</span></Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
