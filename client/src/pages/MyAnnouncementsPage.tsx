import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Megaphone, Plus, Clock, CheckCircle, Phone } from "lucide-react";
import { useAuth } from "@/lib/auth";
import type { Announcement } from "@shared/schema";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export default function MyAnnouncementsPage() {
  const { user } = useAuth();
  
  const { data: announcements, isLoading } = useQuery<Announcement[]>({
    queryKey: ["/api/my-announcements"],
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Для просмотра ваших объявлений необходимо войти в систему
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    if (status === "published") {
      return (
        <Badge variant="default" className="bg-green-600">
          <CheckCircle className="h-3 w-3 mr-1" />
          Опубликовано
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        <Clock className="h-3 w-3 mr-1" />
        На модерации
      </Badge>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Megaphone className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Мои объявления</h1>
        </div>
        <Link href="/announcement/new">
          <Button data-testid="button-create-announcement">
            <Plus className="h-4 w-4 mr-2" />
            Новое объявление
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : announcements && announcements.length > 0 ? (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id} data-testid={`card-my-announcement-${announcement.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-xl">{announcement.title}</CardTitle>
                  {getStatusBadge(announcement.status)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Создано: {format(new Date(announcement.createdAt), "d MMMM yyyy, HH:mm", { locale: ru })}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-wrap mb-4 line-clamp-3">
                  {announcement.description}
                </p>
                
                {announcement.images && announcement.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {announcement.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Фото ${idx + 1}`}
                        className="w-16 h-16 object-cover rounded-md border"
                      />
                    ))}
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{announcement.contact}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Megaphone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">У вас пока нет объявлений</p>
            <Link href="/announcement/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Создать первое объявление
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
