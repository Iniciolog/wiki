import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Check, X, Clock, FileText, User, Megaphone, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import type { Article, Announcement } from "@shared/schema";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export default function AdminPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pendingArticles, isLoading: loadingArticles } = useQuery<Article[]>({
    queryKey: ["/api/admin/pending-articles"],
    enabled: user?.role === "admin",
  });

  const { data: pendingAnnouncements, isLoading: loadingAnnouncements } = useQuery<Announcement[]>({
    queryKey: ["/api/admin/pending-announcements"],
    enabled: user?.role === "admin",
  });

  const approveArticleMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("POST", `/api/admin/articles/${id}/approve`);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Статья опубликована", description: "Статья успешно одобрена и опубликована" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-articles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
    },
    onError: (error: any) => {
      toast({ title: "Ошибка", description: error.message || "Не удалось одобрить статью", variant: "destructive" });
    },
  });

  const rejectArticleMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("POST", `/api/admin/articles/${id}/reject`);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Статья отклонена", description: "Статья была отклонена и удалена" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-articles"] });
    },
    onError: (error: any) => {
      toast({ title: "Ошибка", description: error.message || "Не удалось отклонить статью", variant: "destructive" });
    },
  });

  const approveAnnouncementMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("POST", `/api/admin/announcements/${id}/approve`);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Объявление опубликовано", description: "Объявление успешно одобрено" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-announcements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
    },
    onError: (error: any) => {
      toast({ title: "Ошибка", description: error.message || "Не удалось одобрить объявление", variant: "destructive" });
    },
  });

  const rejectAnnouncementMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("POST", `/api/admin/announcements/${id}/reject`);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Объявление отклонено", description: "Объявление было отклонено и удалено" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-announcements"] });
    },
    onError: (error: any) => {
      toast({ title: "Ошибка", description: error.message || "Не удалось отклонить объявление", variant: "destructive" });
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">Для доступа к панели администратора необходимо войти</p>
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
            <p className="text-muted-foreground mb-4">Доступ к этой странице разрешён только администраторам</p>
            <Link href="/">
              <Button data-testid="button-home">На главную</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const articleCount = pendingArticles?.length || 0;
  const announcementCount = pendingAnnouncements?.length || 0;

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
        <Tabs defaultValue="articles" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="articles" className="flex items-center gap-2" data-testid="tab-articles">
              <FileText className="h-4 w-4" />
              Статьи
              {articleCount > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 px-1.5">{articleCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="announcements" className="flex items-center gap-2" data-testid="tab-announcements">
              <Megaphone className="h-4 w-4" />
              Объявления
              {announcementCount > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 px-1.5">{announcementCount}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="articles">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Статьи на модерации
                </CardTitle>
                <CardDescription>Проверьте и одобрите или отклоните статьи пользователей</CardDescription>
              </CardHeader>
            </Card>

            {loadingArticles ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
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
                          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{article.intro}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {article.categoryNames.map((cat) => (
                              <Badge key={cat} variant="outline" className="text-xs">{cat}</Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Автор: {article.updatedBy}</span>
                            <span>{format(new Date(article.createdAt), "d MMMM yyyy", { locale: ru })}</span>
                            <span>{article.sections.length} разделов</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4 pt-4 border-t">
                        <Button
                          onClick={() => approveArticleMutation.mutate(article.id)}
                          disabled={approveArticleMutation.isPending || rejectArticleMutation.isPending}
                          data-testid={`button-approve-article-${article.id}`}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Одобрить
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => rejectArticleMutation.mutate(article.id)}
                          disabled={approveArticleMutation.isPending || rejectArticleMutation.isPending}
                          data-testid={`button-reject-article-${article.id}`}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Отклонить
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Нет статей, ожидающих модерации</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="announcements">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Объявления на модерации
                </CardTitle>
                <CardDescription>Проверьте и одобрите или отклоните объявления пользователей</CardDescription>
              </CardHeader>
            </Card>

            {loadingAnnouncements ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Card key={i}>
                    <CardContent className="pt-6">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-4" />
                      <Skeleton className="h-8 w-32" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : pendingAnnouncements && pendingAnnouncements.length > 0 ? (
              <div className="space-y-4">
                {pendingAnnouncements.map((announcement) => (
                  <Card key={announcement.id} data-testid={`card-pending-announcement-${announcement.id}`}>
                    <CardContent className="pt-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Megaphone className="h-4 w-4 text-muted-foreground" />
                          <h3 className="font-semibold text-lg">{announcement.title}</h3>
                        </div>
                        <p className="text-muted-foreground text-sm mb-3 whitespace-pre-wrap line-clamp-4">
                          {announcement.description}
                        </p>
                        {announcement.images && announcement.images.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {announcement.images.map((img, idx) => (
                              <img key={idx} src={img} alt={`Фото ${idx + 1}`} className="w-16 h-16 object-cover rounded-md border" />
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Phone className="h-4 w-4" />
                          <span>{announcement.contact}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Автор: {announcement.authorName}</span>
                          <span>{format(new Date(announcement.createdAt), "d MMMM yyyy, HH:mm", { locale: ru })}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4 pt-4 border-t">
                        <Button
                          onClick={() => approveAnnouncementMutation.mutate(announcement.id)}
                          disabled={approveAnnouncementMutation.isPending || rejectAnnouncementMutation.isPending}
                          data-testid={`button-approve-announcement-${announcement.id}`}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Одобрить
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => rejectAnnouncementMutation.mutate(announcement.id)}
                          disabled={approveAnnouncementMutation.isPending || rejectAnnouncementMutation.isPending}
                          data-testid={`button-reject-announcement-${announcement.id}`}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Отклонить
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Нет объявлений, ожидающих модерации</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
