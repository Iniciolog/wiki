import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, Menu, X, Moon, Sun, FileText, History, User, Star, Bookmark, Home, ChevronRight, Edit, Clock, Sparkles, Shield, Heart, Zap, PenSquare, FolderOpen, ShieldCheck, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import type { Article } from "@shared/schema";

export default function MainPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/articles?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const { data: recentArticles, isLoading: isLoadingRecent } = useQuery<Article[]>({
    queryKey: ["/api/articles/recent"],
  });

  const { data: allArticles } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery<{ name: string; count: number }[]>({
    queryKey: ["/api/categories/with-counts"],
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const featuredArticles = allArticles?.slice(0, 4).map(article => ({
    title: article.title,
    description: article.intro.substring(0, 100) + "...",
    category: article.categoryNames[0] || "Основы"
  })) || [];

  const recentChanges = recentArticles?.slice(0, 4).map(article => ({
    title: article.title,
    date: new Date(article.updatedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }),
    user: article.updatedBy
  })) || [];

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
                <img 
                  src="https://static.tildacdn.com/tild3862-6363-4664-a438-316536343535/___.png" 
                  alt="Initiology" 
                  className="h-8 w-auto"
                />
                <span className="font-serif font-semibold text-xl hidden sm:inline">Wiki Initiology</span>
              </div>
            </Link>
          </div>
          
          <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4">
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
          </form>

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
              <Link href="/announcements" data-testid="link-nav-announcements">
                <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent transition-colors cursor-pointer">
                  <Megaphone className="h-4 w-4" />
                  <span>Доска объявлений</span>
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
              {user && (
                <>
                  <Link href="/create-article" data-testid="link-nav-create-article">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent transition-colors cursor-pointer">
                      <PenSquare className="h-4 w-4" />
                      <span>Создать статью</span>
                    </div>
                  </Link>
                  <Link href="/my-articles" data-testid="link-nav-my-articles">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent transition-colors cursor-pointer">
                      <FolderOpen className="h-4 w-4" />
                      <span>Мои статьи</span>
                    </div>
                  </Link>
                  <Link href="/my-announcements" data-testid="link-nav-my-announcements">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent transition-colors cursor-pointer">
                      <Megaphone className="h-4 w-4" />
                      <span>Мои объявления</span>
                    </div>
                  </Link>
                </>
              )}
              {user?.role === "admin" && (
                <Link href="/admin" data-testid="link-nav-admin">
                  <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent transition-colors cursor-pointer">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Панель админа</span>
                  </div>
                </Link>
              )}

              <div className="px-3 py-2 mt-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Разделы
              </div>
              {isLoadingCategories ? (
                <div className="px-3 space-y-2">
                  {[1, 2, 3, 4].map(i => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : (
                categories?.map((cat) => (
                  <Link href={`/category/${cat.name}`} key={cat.name} data-testid={`link-category-${cat.name}`}>
                    <div className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-sidebar-accent transition-colors cursor-pointer">
                      <span className="text-sm">{cat.name}</span>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {cat.count}
                      </span>
                    </div>
                  </Link>
                ))
              )}
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

              <h1>Добро пожаловать в Wiki Initiology</h1>
              
              <p className="text-lg text-muted-foreground mb-6">
                База знаний по <strong>Инициологии</strong> — комплементарной системе оздоровления, повышения качества жизни и энергоинформационной безопасности.
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
                  <h4 className="font-semibold mb-1 mt-0 border-0">Энергия</h4>
                  <p className="text-sm text-muted-foreground mb-0">Работа с энергоинформационными космическими каналами</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <Heart className="h-8 w-8 text-green-600 dark:text-green-400 mb-2" />
                  <h4 className="font-semibold mb-1 mt-0 border-0">Здоровье</h4>
                  <p className="text-sm text-muted-foreground mb-0">Исцеление и восстановление организма</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                  <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-2" />
                  <h4 className="font-semibold mb-1 mt-0 border-0">Защита</h4>
                  <p className="text-sm text-muted-foreground mb-0">Энергоинформационная безопасность</p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <Zap className="h-8 w-8 text-amber-600 dark:text-amber-400 mb-2" />
                  <h4 className="font-semibold mb-1 mt-0 border-0">Развитие</h4>
                  <p className="text-sm text-muted-foreground mb-0">Ступени мастерства и РМТ</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-card border border-border rounded-lg p-5">
                  <h3 className="flex items-center gap-2 text-lg font-serif font-semibold mb-4 mt-0 border-0">
                    <Star className="h-5 w-5 text-primary" />
                    Избранные статьи
                  </h3>
                  {isLoadingRecent ? (
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : (
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
                  )}
                </div>

                <div className="bg-card border border-border rounded-lg p-5">
                  <h3 className="flex items-center gap-2 text-lg font-serif font-semibold mb-4 mt-0 border-0">
                    <Clock className="h-5 w-5 text-primary" />
                    Последние изменения
                  </h3>
                  {isLoadingRecent ? (
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="h-10 w-full" />
                      ))}
                    </div>
                  ) : (
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
                  )}
                </div>
              </div>

              <h2>Что такое Инициология?</h2>
              <p>
                <strong>Инициология</strong> — это комплементарная система оздоровления, повышения качества жизни и энергоинформационной безопасности. 
                Метод базируется на взаимодействии с энергетическими каналами, по которым поступают потоки космической энергии.
              </p>
              <p>
                Эти потоки благоприятно влияют на все сферы жизнедеятельности человека. Благодаря работе с каналами происходит 
                физическое исцеление, очищение тонких энергетических структур, качественное улучшение всех сфер жизни.
              </p>

              <h3>Сферы применения</h3>
              <ul>
                <li><strong>Здоровье</strong> — физическое исцеление, восстановление энергоцентров</li>
                <li><strong>Социальная сфера</strong> — улучшение положения, карьерный рост, бизнес-успех</li>
                <li><strong>Личная сфера</strong> — гармонизация отношений, укрепление семьи</li>
                <li><strong>Безопасность</strong> — защита от негативных воздействий и недоброжелателей</li>
              </ul>

              <h3>Преимущества системы</h3>
              <p>
                Инициолог не затрачивает своей энергии на работу с проблемой. Всю работу выполняют каналы, 
                по которым поступает энергия космоса. Ресурс каналов безграничен — они могут дать столько энергии, 
                сколько нужно пациенту.
              </p>

              <div className="wiki-notice">
                <div className="wiki-notice-title">📚 Начните изучение</div>
                <p className="mb-0">
                  Рекомендуем начать со статьи <Link href="/article/Инициология"><span className="text-wiki-link hover:underline cursor-pointer">«Инициология»</span></Link>, 
                  где подробно описаны основы системы и её отличия от других энергопрактик.
                </p>
              </div>

              <div className="wiki-category-box">
                <span>Категории:</span>
                <Link href="/category/Основы"><span className="text-wiki-link hover:underline cursor-pointer">Основы</span></Link>
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
