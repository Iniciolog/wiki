import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import { FileText, Megaphone, Clock, CheckCircle, XCircle, AlertCircle, User, ArrowLeft } from "lucide-react";
import type { Article, Announcement } from "@shared/schema";

export default function ProfilePage() {
  const { user, isLoading: authLoading } = useAuth();

  const { data: myArticles, isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: ["/api/my-articles"],
    enabled: !!user,
  });

  const { data: myAnnouncements, isLoading: announcementsLoading } = useQuery<Announcement[]>({
    queryKey: ["/api/my-announcements"],
    enabled: !!user,
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge variant="default" className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Опубликовано</Badge>;
      case "pending":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />На модерации</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Отклонено</Badge>;
      default:
        return <Badge variant="outline"><AlertCircle className="h-3 w-3 mr-1" />{status}</Badge>;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Требуется авторизация</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Для просмотра профиля необходимо войти в систему.</p>
            <Link href="/">
              <Button data-testid="button-back-home">
                <ArrowLeft className="h-4 w-4 mr-2" />
                На главную
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.username}</h1>
              <p className="text-muted-foreground">
                {user.role === "admin" ? "Администратор" : "Пользователь"}
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="articles" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="articles" data-testid="tab-articles">
              <FileText className="h-4 w-4 mr-2" />
              Мои статьи ({myArticles?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="announcements" data-testid="tab-announcements">
              <Megaphone className="h-4 w-4 mr-2" />
              Мои объявления ({myAnnouncements?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="articles" className="mt-6">
            {articlesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : myArticles && myArticles.length > 0 ? (
              <div className="space-y-4">
                {myArticles.map((article) => (
                  <Card key={article.id} className="hover-elevate" data-testid={`card-article-${article.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          {article.status === "published" ? (
                            <Link href={`/article/${encodeURIComponent(article.title)}`}>
                              <h3 className="font-semibold text-lg hover:text-primary cursor-pointer">
                                {article.title}
                              </h3>
                            </Link>
                          ) : (
                            <h3 className="font-semibold text-lg">{article.title}</h3>
                          )}
                          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                            {article.intro}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(article.createdAt).toLocaleDateString("ru-RU")}
                          </div>
                        </div>
                        {getStatusBadge(article.status)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">У вас пока нет статей</p>
                  <Link href="/article/new">
                    <Button data-testid="button-create-article">Написать статью</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="announcements" className="mt-6">
            {announcementsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : myAnnouncements && myAnnouncements.length > 0 ? (
              <div className="space-y-4">
                {myAnnouncements.map((announcement) => (
                  <Card key={announcement.id} className="hover-elevate" data-testid={`card-announcement-${announcement.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{announcement.title}</h3>
                          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                            {announcement.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(announcement.createdAt).toLocaleDateString("ru-RU")}
                          </div>
                        </div>
                        {getStatusBadge(announcement.status)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Megaphone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">У вас пока нет объявлений</p>
                  <Link href="/announcement/new">
                    <Button data-testid="button-create-announcement">Создать объявление</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
