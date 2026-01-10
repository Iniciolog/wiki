import { useState } from "react";
import { Link, useParams } from "wouter";
import { Search, Menu, X, Moon, Sun, BookOpen, FileText, Settings, History, User, Star, Bookmark, Home, Edit, Clock, ExternalLink, ChevronDown, ChevronRight, Printer, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const categories = [
  { name: "Технологии", count: 42 },
  { name: "Наука", count: 38 },
  { name: "Программирование", count: 56 },
  { name: "Математика", count: 24 },
  { name: "Физика", count: 18 },
  { name: "История", count: 31 },
];

const articlesData: Record<string, {
  title: string;
  intro: string;
  infobox?: {
    title: string;
    image?: string;
    rows: { label: string; value: string }[];
  };
  sections: { id: string; title: string; level: number; content: string }[];
  categories: string[];
  seeAlso: string[];
  references: string[];
}> = {
  "Искусственный интеллект": {
    title: "Искусственный интеллект",
    intro: "Искусственный интеллект (ИИ, англ. Artificial Intelligence, AI) — свойство искусственных интеллектуальных систем выполнять творческие функции, которые традиционно считаются прерогативой человека; наука и технология создания интеллектуальных машин, особенно интеллектуальных компьютерных программ.",
    infobox: {
      title: "Искусственный интеллект",
      rows: [
        { label: "Область", value: "Информатика" },
        { label: "Подраздел", value: "Машинное обучение" },
        { label: "Год создания", value: "1956" },
        { label: "Основатели", value: "Джон Маккарти, Марвин Минский" },
        { label: "Применение", value: "Робототехника, NLP, CV" },
      ],
    },
    sections: [
      {
        id: "history",
        title: "История",
        level: 2,
        content: `<p>История искусственного интеллекта как нового научного направления начинается в середине XX века. К этому времени уже было сформировано множество предпосылок его зарождения: среди философов давно шли споры о природе человека и процессе познания мира, нейрофизиологи и психологи разработали ряд теорий относительно работы человеческого мозга и мышления.</p>
<p>Термин «искусственный интеллект» был предложен в 1956 году на семинаре в Дартмутском колледже (США). Участники семинара — Джон Маккарти, Марвин Минский, Клод Шеннон и другие — заложили основы новой науки.</p>`,
      },
      {
        id: "approaches",
        title: "Подходы к созданию ИИ",
        level: 2,
        content: `<p>Существует несколько основных подходов к созданию систем искусственного интеллекта:</p>
<ul>
<li><strong>Символьный подход</strong> — основан на манипулировании символами и логическими правилами</li>
<li><strong>Коннекционизм</strong> — использует искусственные нейронные сети, имитирующие структуру мозга</li>
<li><strong>Гибридный подход</strong> — комбинирует символьные и коннекционистские методы</li>
<li><strong>Эволюционный подход</strong> — применяет генетические алгоритмы и эволюционные стратегии</li>
</ul>`,
      },
      {
        id: "machine-learning",
        title: "Машинное обучение",
        level: 2,
        content: `<p><a href="/article/Машинное обучение">Машинное обучение</a> — это подраздел искусственного интеллекта, изучающий методы построения алгоритмов, способных обучаться на данных.</p>
<p>Основные типы машинного обучения:</p>
<ul>
<li><strong>Обучение с учителем</strong> — алгоритм обучается на размеченных данных</li>
<li><strong>Обучение без учителя</strong> — поиск закономерностей в неразмеченных данных</li>
<li><strong>Обучение с подкреплением</strong> — обучение через взаимодействие со средой</li>
</ul>`,
      },
      {
        id: "deep-learning",
        title: "Глубокое обучение",
        level: 3,
        content: `<p>Глубокое обучение (Deep Learning) — совокупность методов машинного обучения, основанных на обучении представлениям (признакам), а не на специализированных алгоритмах для конкретных задач.</p>
<p>Глубокие нейронные сети состоят из множества слоёв и способны автоматически извлекать иерархические признаки из данных.</p>`,
      },
      {
        id: "applications",
        title: "Применение",
        level: 2,
        content: `<p>Искусственный интеллект находит применение в самых разных областях:</p>
<ul>
<li><strong>Компьютерное зрение</strong> — распознавание образов, лиц, объектов</li>
<li><strong>Обработка естественного языка</strong> — машинный перевод, чат-боты, анализ текстов</li>
<li><strong>Робототехника</strong> — автономные транспортные средства, промышленные роботы</li>
<li><strong>Медицина</strong> — диагностика заболеваний, разработка лекарств</li>
<li><strong>Финансы</strong> — алгоритмическая торговля, оценка рисков</li>
<li><strong>Игры</strong> — создание интеллектуальных противников</li>
</ul>`,
      },
      {
        id: "ethics",
        title: "Этические вопросы",
        level: 2,
        content: `<p>Развитие ИИ поднимает ряд важных этических вопросов:</p>
<blockquote>С большой силой приходит большая ответственность. Разработчики ИИ должны учитывать возможные последствия своих технологий.</blockquote>
<ul>
<li>Влияние на рынок труда и автоматизация рабочих мест</li>
<li>Конфиденциальность данных и слежка</li>
<li>Предвзятость алгоритмов</li>
<li>Автономное оружие</li>
<li>Проблема «чёрного ящика» в принятии решений</li>
</ul>`,
      },
    ],
    categories: ["Технологии", "Информатика", "Машинное обучение"],
    seeAlso: ["Машинное обучение", "Нейронные сети", "Робототехника", "Обработка естественного языка"],
    references: [
      "Russell, S., Norvig, P. Artificial Intelligence: A Modern Approach",
      "Goodfellow, I. Deep Learning",
      "McCarthy, J. What Is Artificial Intelligence?",
    ],
  },
  "Квантовые вычисления": {
    title: "Квантовые вычисления",
    intro: "Квантовые вычисления — вычисления, использующие квантово-механические явления, такие как суперпозиция и квантовая запутанность для обработки данных. Квантовые компьютеры способны решать определённые задачи экспоненциально быстрее классических компьютеров.",
    infobox: {
      title: "Квантовые вычисления",
      rows: [
        { label: "Область", value: "Физика, Информатика" },
        { label: "Базовая единица", value: "Кубит" },
        { label: "Ключевые явления", value: "Суперпозиция, Запутанность" },
        { label: "Первый КК", value: "1998" },
      ],
    },
    sections: [
      {
        id: "basics",
        title: "Основы",
        level: 2,
        content: `<p>В отличие от классических компьютеров, использующих биты (0 или 1), квантовые компьютеры оперируют кубитами, которые могут находиться в суперпозиции состояний.</p>
<p>Это позволяет квантовому компьютеру обрабатывать множество вариантов одновременно, что делает его эффективным для определённых типов задач.</p>`,
      },
      {
        id: "qubit",
        title: "Кубит",
        level: 2,
        content: `<p>Кубит (квантовый бит) — основная единица квантовой информации. В отличие от классического бита, кубит может находиться в состоянии суперпозиции |0⟩ и |1⟩ одновременно.</p>
<p>Математически состояние кубита описывается как: <code>|ψ⟩ = α|0⟩ + β|1⟩</code></p>`,
      },
      {
        id: "algorithms",
        title: "Квантовые алгоритмы",
        level: 2,
        content: `<p>Наиболее известные квантовые алгоритмы:</p>
<ul>
<li><strong>Алгоритм Шора</strong> — факторизация больших чисел за полиномиальное время</li>
<li><strong>Алгоритм Гровера</strong> — поиск в неструктурированной базе данных с квадратичным ускорением</li>
<li><strong>Квантовое моделирование</strong> — симуляция квантовых систем</li>
</ul>`,
      },
    ],
    categories: ["Физика", "Технологии", "Вычисления"],
    seeAlso: ["Квантовая механика", "Криптография", "Алгоритм Шора"],
    references: [
      "Nielsen, M., Chuang, I. Quantum Computation and Quantum Information",
      "Preskill, J. Quantum Computing in the NISQ era and beyond",
    ],
  },
  "Машинное обучение": {
    title: "Машинное обучение",
    intro: "Машинное обучение (МО, англ. Machine Learning, ML) — класс методов искусственного интеллекта, характерной чертой которых является не прямое решение задачи, а обучение за счёт применения решений множества сходных задач.",
    infobox: {
      title: "Машинное обучение",
      rows: [
        { label: "Область", value: "Искусственный интеллект" },
        { label: "Подразделы", value: "Deep Learning, NLP, CV" },
        { label: "Языки", value: "Python, R, Julia" },
        { label: "Фреймворки", value: "TensorFlow, PyTorch" },
      ],
    },
    sections: [
      {
        id: "types",
        title: "Типы обучения",
        level: 2,
        content: `<p>Существует три основных типа машинного обучения:</p>
<ul>
<li><strong>Обучение с учителем (Supervised Learning)</strong> — модель обучается на размеченных данных</li>
<li><strong>Обучение без учителя (Unsupervised Learning)</strong> — поиск скрытых закономерностей</li>
<li><strong>Обучение с подкреплением (Reinforcement Learning)</strong> — обучение через награды</li>
</ul>`,
      },
      {
        id: "algorithms",
        title: "Алгоритмы",
        level: 2,
        content: `<p>Популярные алгоритмы машинного обучения:</p>
<ul>
<li>Линейная и логистическая регрессия</li>
<li>Деревья решений и случайные леса</li>
<li>Метод опорных векторов (SVM)</li>
<li>k-ближайших соседей (k-NN)</li>
<li>Нейронные сети</li>
<li>Градиентный бустинг</li>
</ul>`,
      },
    ],
    categories: ["Технологии", "Искусственный интеллект", "Data Science"],
    seeAlso: ["Искусственный интеллект", "Нейронные сети", "Data Science"],
    references: [
      "Bishop, C. Pattern Recognition and Machine Learning",
      "Murphy, K. Machine Learning: A Probabilistic Perspective",
    ],
  },
  "Нейронные сети": {
    title: "Нейронные сети",
    intro: "Искусственная нейронная сеть (ИНС) — математическая модель, а также её программное или аппаратное воплощение, построенная по принципу организации и функционирования биологических нейронных сетей.",
    infobox: {
      title: "Нейронные сети",
      rows: [
        { label: "Тип", value: "Вычислительная модель" },
        { label: "Основа", value: "Искусственный нейрон" },
        { label: "Применение", value: "CV, NLP, RL" },
      ],
    },
    sections: [
      {
        id: "structure",
        title: "Структура",
        level: 2,
        content: `<p>Нейронная сеть состоит из слоёв искусственных нейронов:</p>
<ul>
<li><strong>Входной слой</strong> — принимает данные</li>
<li><strong>Скрытые слои</strong> — обрабатывают информацию</li>
<li><strong>Выходной слой</strong> — выдаёт результат</li>
</ul>`,
      },
      {
        id: "types",
        title: "Типы сетей",
        level: 2,
        content: `<p>Основные архитектуры нейронных сетей:</p>
<ul>
<li>Полносвязные сети (MLP)</li>
<li>Свёрточные сети (CNN)</li>
<li>Рекуррентные сети (RNN, LSTM)</li>
<li>Трансформеры</li>
<li>Генеративные сети (GAN, VAE)</li>
</ul>`,
      },
    ],
    categories: ["Технологии", "Машинное обучение"],
    seeAlso: ["Машинное обучение", "Глубокое обучение", "Искусственный интеллект"],
    references: [
      "Haykin, S. Neural Networks and Learning Machines",
      "Goodfellow, I. Deep Learning",
    ],
  },
};

export default function ArticlePage() {
  const params = useParams<{ title: string }>();
  const articleTitle = decodeURIComponent(params.title || "Искусственный интеллект");
  const article = articlesData[articleTitle] || articlesData["Искусственный интеллект"];
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tocOpen, setTocOpen] = useState(true);

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
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="font-serif font-semibold text-xl hidden sm:inline">Персональная Вики</span>
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
            <Button variant="ghost" size="icon" data-testid="button-user">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed lg:relative lg:translate-x-0 z-40 w-64 h-[calc(100vh-56px)] bg-sidebar border-r border-sidebar-border transition-transform duration-200`}
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
                <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent transition-colors cursor-pointer">
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
                Категории
              </div>
              {categories.map((cat) => (
                <Link href={`/category/${cat.name}`} key={cat.name} data-testid={`link-category-${cat.name}`}>
                  <div className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-sidebar-accent transition-colors cursor-pointer">
                    <span className="text-sm">{cat.name}</span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {cat.count}
                    </span>
                  </div>
                </Link>
              ))}
            </nav>
          </ScrollArea>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link href="/" data-testid="breadcrumb-home">
                <span className="hover:text-wiki-link cursor-pointer">Заглавная</span>
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span>{article.title}</span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Button variant="ghost" size="sm" className="h-8 gap-1.5" data-testid="button-edit-article">
                  <Edit className="h-3.5 w-3.5" />
                  Редактировать
                </Button>
                <Button variant="ghost" size="sm" className="h-8 gap-1.5" data-testid="button-history">
                  <History className="h-3.5 w-3.5" />
                  История
                </Button>
              </div>
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
                        <a href="#references">{article.sections.length + 2}. Литература</a>
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
                      <button className="wiki-edit-section ml-2" data-testid={`button-edit-${section.id}`}>
                        [ред.]
                      </button>
                    </Tag>
                    <div dangerouslySetInnerHTML={{ __html: section.content }} />
                  </div>
                );
              })}

              <h2 id="see-also">
                См. также
                <button className="wiki-edit-section ml-2">[ред.]</button>
              </h2>
              <ul>
                {article.seeAlso.map((item) => (
                  <li key={item}>
                    <Link href={`/article/${encodeURIComponent(item)}`}>
                      <span className="text-wiki-link hover:underline cursor-pointer">{item}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              <h2 id="references">
                Литература
                <button className="wiki-edit-section ml-2">[ред.]</button>
              </h2>
              <ol>
                {article.references.map((ref, i) => (
                  <li key={i}>{ref}</li>
                ))}
              </ol>

              <div className="wiki-category-box">
                <span>Категории:</span>
                {article.categories.map((cat, i) => (
                  <span key={cat}>
                    <Link href={`/category/${cat}`}>
                      <span className="text-wiki-link hover:underline cursor-pointer">{cat}</span>
                    </Link>
                    {i < article.categories.length - 1 && " • "}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-border text-sm text-muted-foreground flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Последнее изменение: 10 января 2026, 14:32</span>
              </div>
              <div>
                <span>Просмотров: 1,247</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
