import { Link, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Check, X, Clock, FileText, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import type { Article } from "@shared/schema";

export default function AdminPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pendingArticles, isLoading } = useQuery<Article[]>({
    queryKey: ["/api/admin/pending-articles"],
    enabled: user?.role === "admin",
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("POST", `/api/admin/articles/${id}/approve`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Статья опубликована",
        description: "Статья успешно одобрена и опубликована",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-articles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось одобрить статью",
        variant: "destructive",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("POST", `/api/admin/articles/${id}/reject`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Статья отклонена",
        description: "Статья была отклонена и удалена",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-articles"] });
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось отклонить статью",
        variant: "destructive",
      });
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">
              Для доступа к панели администратора необходимо войти
            </p>
            <Link href="/login">
              <Button data-testid="button-login">Войти</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">
              Доступ к этой странице разрешён только администраторам
            </p>
            <Link href="/">
              <Button data-testid="button-home">На главную</Button>
            </Link>
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
            <h1 className="font-semibold text-lg">Панель администратора</h1>
          </div>
          <Badge variant="secondary">
            <User className="h-3 w-3 mr-1" />
            {user.username}
          </Badge>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto py-6 px-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Статьи на модерации
            </CardTitle>
            <CardDescription>
              Проверьте и одобрите или отклоните статьи пользователей
            </CardDescription>
          </CardHeader>
        </Card>

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
        ) : pendingArticles && pendingArticles.length > 0 ? (
          <div className="space-y-4">
            {pendingArticles.map((article) => (
              <Card key={article.id} data-testid={`card-pending-article-${article.id}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-semibold text-lg truncate">{article.title}</h3>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {article.intro}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.categoryNames.map((cat) => (
                          <Badge key={cat} variant="outline" className="text-xs">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Автор: {article.updatedBy}</span>
                        <span>
                          {new Date(article.createdAt).toLocaleDateString("ru-RU", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        <span>{article.sections.length} разделов</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button
                      onClick={() => approveMutation.mutate(article.id)}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                      data-testid={`button-approve-${article.id}`}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Одобрить
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => rejectMutation.mutate(article.id)}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                      data-testid={`button-reject-${article.id}`}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Отклонить
                    </Button>
                    <Link href={`/article/${encodeURIComponent(article.title)}`}>
                      <Button variant="ghost" data-testid={`button-preview-${article.id}`}>
                        Просмотр
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Нет статей, ожидающих модерации
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
