import { useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Search, Menu, X, Moon, Sun, FileText, History, Star, Bookmark, Home, Clock, ChevronDown, ChevronRight, Printer, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { getArticleByTitle, getCategories } from "@/lib/staticData";
import type { Article } from "@shared/schema";

export default function ArticlePage() {
  const params = useParams<{ title: string }>();
  const articleTitle = decodeURIComponent(params.title || "Инициология");
  
  const { data: article, isLoading: isLoadingArticle, error } = useQuery<Article | undefined>({
    queryKey: ["static-article", articleTitle],
    queryFn: () => getArticleByTitle(articleTitle),
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery<{ name: string; count: number }[]>({
    queryKey: ["static-categories"],
    queryFn: getCategories,
  });
  
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tocOpen, setTocOpen] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(true);
      const timer = setTimeout(() => {
        setSidebarOpen(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

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
                placeholder={t('search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50"
                data-testid="input-search"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              data-testid="button-toggle-theme"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
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
                {t('nav.navigation')}
              </div>
              <Link href="/" data-testid="link-nav-main">
                <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent transition-colors cursor-pointer">
                  <Home className="h-4 w-4" />
                  <span>{t('nav.mainPage')}</span>
                </div>
              </Link>
              <Link href="/articles" data-testid="link-nav-articles">
                <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent transition-colors cursor-pointer">
                  <FileText className="h-4 w-4" />
                  <span>{t('nav.allArticles')}</span>
                </div>
              </Link>
              <Link href="/categories" data-testid="link-nav-categories">
                <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent transition-colors cursor-pointer">
                  <Bookmark className="h-4 w-4" />
                  <span>{t('nav.categories')}</span>
                </div>
              </Link>
              <Link href="/random" data-testid="link-nav-random">
                <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent transition-colors cursor-pointer">
                  <Star className="h-4 w-4" />
                  <span>{t('nav.randomArticle')}</span>
                </div>
              </Link>

              <div className="px-3 py-2 mt-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t('nav.tools')}
              </div>
              <Link href="/recent" data-testid="link-nav-recent">
                <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent transition-colors cursor-pointer">
                  <History className="h-4 w-4" />
                  <span>{t('nav.recentChanges')}</span>
                </div>
              </Link>

              <div className="px-3 py-2 mt-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t('nav.sections')}
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
            {isLoadingArticle ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-48 w-full mt-8" />
                <Skeleton className="h-6 w-full mt-4" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
              </div>
            ) : error || !article ? (
              <div className="text-center py-12">
                <h1 className="text-4xl font-bold mb-4">Статья не найдена</h1>
                <p className="text-lg text-muted-foreground mb-6">
                  К сожалению, статья "{articleTitle}" не существует.
                </p>
                <Link href="/">
                  <Button>Вернуться на главную</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Link href="/" data-testid="breadcrumb-home">
                    <span className="hover:text-wiki-link cursor-pointer">Заглавная</span>
                  </Link>
                  <ChevronRight className="h-3 w-3" />
                  <span>{article.title}</span>
                </div>

                <div className="flex items-center justify-end mb-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" data-testid="button-print">
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" data-testid="button-share">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="wiki-content">
                  <h1>{article.title}</h1>
                  
                  {article.infobox && (
                    <div className="wiki-infobox">
                      <div className="wiki-infobox-header">{article.infobox.title}</div>
                      {article.infobox.rows.map((row, i) => (
                        <div key={i} className="wiki-infobox-row">
                          <div className="wiki-infobox-label">{row.label}</div>
                          <div className="wiki-infobox-value">{row.value}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <p>{article.intro}</p>

                  <Collapsible open={tocOpen} onOpenChange={setTocOpen}>
                    <div className="wiki-toc">
                      <CollapsibleTrigger className="flex items-center justify-between w-full">
                        <div className="wiki-toc-title">Содержание</div>
                        {tocOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <ol className="wiki-toc-list mt-2">
                          {article.sections.map((section, i) => (
                            <li key={section.id} className={`level-${section.level}`}>
                              <a href={`#${section.id}`}>{i + 1}. {section.title}</a>
                            </li>
                          ))}
                          <li className="level-2">
                            <a href="#see-also">{article.sections.length + 1}. См. также</a>
                          </li>
                          <li className="level-2">
                            <a href="#references">{article.sections.length + 2}. Источники</a>
                          </li>
                        </ol>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>

                  {article.sections.map((section) => {
                    const Tag = section.level === 2 ? 'h2' : 'h3';
                    return (
                      <div key={section.id}>
                        <Tag id={section.id}>
                          {section.title}
                        </Tag>
                        <div dangerouslySetInnerHTML={{ __html: section.content }} />
                      </div>
                    );
                  })}

                  <h2 id="see-also">См. также</h2>
                  <ul>
                    {article.seeAlso.map((item) => (
                      <li key={item}>
                        <Link href={`/article/${encodeURIComponent(item)}`}>
                          <span className="text-wiki-link hover:underline cursor-pointer">{item}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <h2 id="references">Источники</h2>
                  <ol>
                    {article.references.map((ref, i) => (
                      <li key={i}>{ref}</li>
                    ))}
                  </ol>

                  <div className="wiki-category-box">
                    <span>Категории:</span>
                    {article.categoryNames.map((cat, i) => (
                      <span key={cat}>
                        <Link href={`/category/${cat}`}>
                          <span className="text-wiki-link hover:underline cursor-pointer">{cat}</span>
                        </Link>
                        {i < article.categoryNames.length - 1 && " • "}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-border text-sm text-muted-foreground flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                      Последнее изменение: {new Date(article.updatedAt).toLocaleDateString('ru-RU', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div>
                    <span>Редактор: {article.updatedBy}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
