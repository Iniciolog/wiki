import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Megaphone, Plus, User, Phone, Calendar } from "lucide-react";
import { useAuth } from "@/lib/auth";
import type { Announcement } from "@shared/schema";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export default function AnnouncementsPage() {
  const { user } = useAuth();
  
  const { data: announcements, isLoading } = useQuery<Announcement[]>({
    queryKey: ["/api/announcements"],
  });

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Megaphone className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Доска объявлений</h1>
        </div>
        {user && (
          <Link href="/announcement/new">
            <Button data-testid="button-create-announcement">
              <Plus className="h-4 w-4 mr-2" />
              Разместить объявление
            </Button>
          </Link>
        )}
      </div>

      {!user && (
        <Card className="mb-6 bg-muted/50">
          <CardContent className="py-4">
            <p className="text-muted-foreground text-center">
              <Link href="/login" className="text-primary hover:underline">Войдите</Link> или{" "}
              <Link href="/register" className="text-primary hover:underline">зарегистрируйтесь</Link>,
              чтобы разместить своё объявление
            </p>
          </CardContent>
        </Card>
      )}

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
            <Card key={announcement.id} className="hover-elevate" data-testid={`card-announcement-${announcement.id}`}>
              <CardHeader>
                <CardTitle className="text-xl">{announcement.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {announcement.authorName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(announcement.createdAt), "d MMMM yyyy", { locale: ru })}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-wrap mb-4">{announcement.description}</p>
                
                {announcement.images && announcement.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {announcement.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Фото ${idx + 1}`}
                        className="w-24 h-24 object-cover rounded-md border"
                      />
                    ))}
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-primary">
                  <Phone className="h-4 w-4" />
                  <span className="font-medium">{announcement.contact}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Megaphone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Пока нет объявлений</p>
            {user && (
              <Link href="/announcement/new">
                <Button variant="outline" className="mt-4">
                  Разместить первое объявление
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
