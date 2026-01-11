import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, FileText, Clock, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import type { Article } from "@shared/schema";

export default function MyArticlesPage() {
  const { user } = useAuth();

  const { data: myArticles, isLoading } = useQuery<Article[]>({
    queryKey: ["/api/my-articles"],
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">
              Для просмотра ваших статей необходимо войти
            </p>
            <div className="flex gap-2 justify-center">
              <Link href="/login">
                <Button data-testid="button-login">Войти</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" data-testid="button-register">Регистрация</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" data-testid="button-back">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="font-semibold text-lg">Мои статьи</h1>
          </div>
          <Link href="/create-article">
            <Button size="sm" data-testid="button-create-article">
              <Plus className="h-4 w-4 mr-2" />
              Создать статью
            </Button>
          </Link>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto py-6 px-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-8 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : myArticles && myArticles.length > 0 ? (
          <div className="space-y-4">
            {myArticles.map((article) => (
              <Card key={article.id} data-testid={`card-my-article-${article.id}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-semibold text-lg truncate">{article.title}</h3>
                        <Badge 
                          variant={article.status === "published" ? "default" : "secondary"}
                          className="ml-2"
                        >
                          {article.status === "published" ? (
                            <>
                              <Check className="h-3 w-3 mr-1" />
                              Опубликована
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              На модерации
                            </>
                          )}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {article.intro}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {article.categoryNames.map((cat) => (
                          <Badge key={cat} variant="outline" className="text-xs">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Создана: {new Date(article.createdAt).toLocaleDateString("ru-RU", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                  {article.status === "published" && (
                    <div className="mt-4 pt-4 border-t">
                      <Link href={`/article/${encodeURIComponent(article.title)}`}>
                        <Button variant="outline" size="sm" data-testid={`button-view-${article.id}`}>
                          Просмотреть статью
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                У вас пока нет статей
              </p>
              <Link href="/create-article">
                <Button data-testid="button-create-first-article">
                  <Plus className="h-4 w-4 mr-2" />
                  Создать первую статью
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
