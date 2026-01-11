import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Megaphone, Plus, X, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";

const announcementFormSchema = z.object({
  title: z.string().min(5, "Заголовок должен содержать минимум 5 символов"),
  description: z.string().min(20, "Описание должно содержать минимум 20 символов"),
  contact: z.string().min(5, "Укажите контактную информацию"),
});

type AnnouncementFormData = z.infer<typeof announcementFormSchema>;

export default function AnnouncementEditorPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [images, setImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");

  const form = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: {
      title: "",
      description: "",
      contact: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: AnnouncementFormData) => {
      const response = await apiRequest("POST", "/api/submit-announcement", {
        ...data,
        images,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/my-announcements"] });
      toast({
        title: "Объявление отправлено",
        description: "Ваше объявление отправлено на модерацию. После проверки оно появится на доске.",
      });
      setLocation("/my-announcements");
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addImage = () => {
    if (imageUrl && !images.includes(imageUrl)) {
      setImages([...images, imageUrl]);
      setImageUrl("");
    }
  };

  const removeImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Для размещения объявления необходимо войти в систему
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Megaphone className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Новое объявление</CardTitle>
              <CardDescription>
                После отправки объявление будет проверено модератором
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => submitMutation.mutate(data))} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Заголовок</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Краткий заголовок объявления"
                        {...field}
                        data-testid="input-announcement-title"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Описание</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Подробное описание вашего объявления..."
                        className="min-h-[150px]"
                        {...field}
                        data-testid="input-announcement-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <FormLabel>Фотографии (необязательно)</FormLabel>
                <FormDescription>
                  Добавьте ссылки на изображения (URL)
                </FormDescription>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    data-testid="input-image-url"
                  />
                  <Button type="button" variant="outline" onClick={addImage} data-testid="button-add-image">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img}
                          alt={`Фото ${idx + 1}`}
                          className="w-20 h-20 object-cover rounded-md border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          data-testid={`button-remove-image-${idx}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Контактная информация</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Телефон, email или другой способ связи"
                        {...field}
                        data-testid="input-announcement-contact"
                      />
                    </FormControl>
                    <FormDescription>
                      Эта информация будет видна всем посетителям
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={submitMutation.isPending}
                  data-testid="button-submit-announcement"
                >
                  {submitMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Отправить на модерацию
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/announcements")}
                  data-testid="button-cancel"
                >
                  Отмена
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
