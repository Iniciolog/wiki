import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Trash2, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";

interface Section {
  id: string;
  title: string;
  level: number;
  content: string;
}

export default function ArticleEditorPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [intro, setIntro] = useState("");
  const [sections, setSections] = useState<Section[]>([
    { id: "section-1", title: "", level: 2, content: "" }
  ]);
  const [categoryNames, setCategoryNames] = useState("");
  const [seeAlso, setSeeAlso] = useState("");
  const [references, setReferences] = useState("");

  const submitMutation = useMutation({
    mutationFn: async (articleData: any) => {
      const response = await apiRequest("POST", "/api/submit-article", articleData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Статья отправлена",
        description: "Ваша статья отправлена на модерацию администратору",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/my-articles"] });
      setLocation("/my-articles");
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось отправить статью",
        variant: "destructive",
      });
    },
  });

  const addSection = () => {
    setSections([
      ...sections,
      { id: `section-${Date.now()}`, title: "", level: 2, content: "" }
    ]);
  };

  const removeSection = (id: string) => {
    if (sections.length > 1) {
      setSections(sections.filter(s => s.id !== id));
    }
  };

  const updateSection = (id: string, field: keyof Section, value: string | number) => {
    setSections(sections.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({ title: "Ошибка", description: "Введите заголовок статьи", variant: "destructive" });
      return;
    }
    if (!intro.trim()) {
      toast({ title: "Ошибка", description: "Введите введение статьи", variant: "destructive" });
      return;
    }

    const articleData = {
      title: title.trim(),
      intro: intro.trim(),
      sections: sections.map(s => ({
        id: s.id,
        title: s.title.trim(),
        level: s.level,
        content: `<p>${s.content.trim()}</p>`
      })).filter(s => s.title || s.content),
      categoryNames: categoryNames.split(",").map(c => c.trim()).filter(Boolean),
      seeAlso: seeAlso.split(",").map(s => s.trim()).filter(Boolean),
      references: references.split("\n").map(r => r.trim()).filter(Boolean),
    };

    submitMutation.mutate(articleData);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">
              Для создания статей необходимо войти в систему
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
            <h1 className="font-semibold text-lg">Создание статьи</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Автор: {user.username}
            </span>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto py-6 px-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Заголовок статьи *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Например: Энергетические каналы"
                  data-testid="input-article-title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="intro">Введение *</Label>
                <Textarea
                  id="intro"
                  value={intro}
                  onChange={(e) => setIntro(e.target.value)}
                  placeholder="Краткое описание статьи (первый абзац)"
                  rows={4}
                  data-testid="input-article-intro"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categories">Категории (через запятую)</Label>
                <Input
                  id="categories"
                  value={categoryNames}
                  onChange={(e) => setCategoryNames(e.target.value)}
                  placeholder="Основы, Практика, Энергетика"
                  data-testid="input-article-categories"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle>Разделы статьи</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addSection} data-testid="button-add-section">
                <Plus className="h-4 w-4 mr-1" />
                Добавить раздел
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {sections.map((section, index) => (
                <div key={section.id} className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Раздел {index + 1}
                    </span>
                    {sections.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSection(section.id)}
                        data-testid={`button-remove-section-${index}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                  <Input
                    value={section.title}
                    onChange={(e) => updateSection(section.id, "title", e.target.value)}
                    placeholder="Заголовок раздела"
                    data-testid={`input-section-title-${index}`}
                  />
                  <Textarea
                    value={section.content}
                    onChange={(e) => updateSection(section.id, "content", e.target.value)}
                    placeholder="Содержание раздела..."
                    rows={6}
                    data-testid={`input-section-content-${index}`}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Дополнительно</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seeAlso">См. также (через запятую)</Label>
                <Input
                  id="seeAlso"
                  value={seeAlso}
                  onChange={(e) => setSeeAlso(e.target.value)}
                  placeholder="Связанные статьи через запятую"
                  data-testid="input-article-seealso"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="references">Источники (каждый с новой строки)</Label>
                <Textarea
                  id="references"
                  value={references}
                  onChange={(e) => setReferences(e.target.value)}
                  placeholder="Каждый источник с новой строки"
                  rows={3}
                  data-testid="input-article-references"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Link href="/">
              <Button type="button" variant="outline" data-testid="button-cancel">
                Отмена
              </Button>
            </Link>
            <Button 
              type="submit" 
              disabled={submitMutation.isPending}
              data-testid="button-submit-article"
            >
              <Save className="h-4 w-4 mr-2" />
              {submitMutation.isPending ? "Отправка..." : "Отправить на модерацию"}
            </Button>
          </div>
        </form>

        <Card className="mt-6 bg-muted/50">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              После отправки статья будет проверена администратором. 
              Вы получите уведомление когда статья будет опубликована.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
