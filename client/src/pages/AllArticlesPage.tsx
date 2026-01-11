import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, Menu, X, Moon, Sun, FileText, Settings, History, User, Star, Bookmark, Home, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Article } from "@shared/schema";
import { useAuth } from "@/lib/auth";

export default function AllArticlesPage() {
  const { user } = useAuth();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(true);
      const timer = setTimeout(() => {
        setSidebarOpen(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const params = useParams<{ name?: string }>();
  const [location, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setSearchQuery(decodeURIComponent(searchParam));
    }
  }, [location]);
  
  useEffect(() => {
    if (params.name) {
      setSelectedCategory(decodeURIComponent(params.name));
    } else {
      setSelectedCategory(null);
    }
  }, [params.name]);

  const { data: articlesData, isLoading: isLoadingArticles } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery<{ name: string; count: number }[]>({
    queryKey: ["/api/categories/with-counts"],
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const allArticles = articlesData?.map(article => ({
    title: article.title,
    categoryNames: article.categoryNames || [],
    category: article.categoryNames[0] || "",
    updated: new Date(article.updatedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
  })) || [];

  const filteredArticles = allArticles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || article.categoryNames.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });
  
  const handleCategoryClick = (categoryName: string | null) => {
    if (categoryName) {
      setLocation(`/category/${encodeURIComponent(categoryName)}`);
    } else {
      setLocation('/articles');
    }
  };

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
                <img 
                  src="https://static.tildacdn.com/tild3862-6363-4664-a438-316536343535/___.png" 
                  alt="Initiology" 
                  className="h-8 w-auto"
                />
                <span className="font-serif font-semibold text-xl hidden sm:inline">Wiki Initiology</span>
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
            {user && (
              <Link href="/profile">
                <Button variant="ghost" size="icon" data-testid="button-user-profile">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            data-testid="sidebar-backdrop"
          />
        )}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed lg:relative lg:translate-x-0 z-40 w-64 h-[calc(100vh-56px)] bg-sidebar border-r border-sidebar-border transition-transform duration-300`}
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
                Разделы
              </div>
              {isLoadingCategories ? (
                <div className="px-3 space-y-2">
                  {[1, 2, 3, 4, 5, 6].map(i => (
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
                <ChevronRight className="h-3 w-3" />
                <span>Все статьи</span>
              </div>

              <h1>{searchQuery ? `Результаты поиска: "${searchQuery}"` : "Все статьи"}</h1>
              
              {isLoadingArticles ? (
                <Skeleton className="h-6 w-48 mb-6" />
              ) : (
                <p className="text-muted-foreground mb-6">
                  {searchQuery 
                    ? <>Найдено статей: <strong>{filteredArticles.length}</strong></>
                    : <>Всего статей в вики: <strong>{allArticles.length}</strong></>
                  }
                </p>
              )}

              {isLoadingCategories ? (
                <div className="flex flex-wrap gap-2 mb-6">
                  <Skeleton className="h-8 w-16" />
                  {[1, 2, 3, 4, 5].map(i => (
                    <Skeleton key={i} className="h-8 w-24" />
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 mb-6">
                  <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategoryClick(null)}
                    data-testid="filter-all"
                  >
                    Все
                  </Button>
                  {categories?.map((cat) => (
                    <Button
                      key={cat.name}
                      variant={selectedCategory === cat.name ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleCategoryClick(cat.name)}
                      data-testid={`filter-${cat.name}`}
                    >
                      {cat.name}
                    </Button>
                  ))}
                </div>
              )}

              {isLoadingArticles ? (
                <div className="space-y-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-8 w-12 mb-2" />
                      {[1, 2, 3, 4].map(j => (
                        <Skeleton key={j} className="h-6 w-full" />
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                Object.entries(groupedArticles)
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
                  ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
