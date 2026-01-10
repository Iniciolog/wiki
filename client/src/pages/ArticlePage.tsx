import { useState } from "react";
import { Link, useParams } from "wouter";
import { Search, Menu, X, Moon, Sun, FileText, Settings, History, User, Star, Bookmark, Home, Edit, Clock, ChevronDown, ChevronRight, Printer, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const categories = [
  { name: "Основы", count: 8 },
  { name: "Практика", count: 12 },
  { name: "Обучение", count: 6 },
  { name: "Здоровье", count: 15 },
  { name: "Безопасность", count: 7 },
  { name: "Сравнения", count: 4 },
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
  "Инициология": {
    title: "Инициология",
    intro: "Инициология — энергоинформационная система нового поколения, направленная на оздоровление и повышение качества жизни. Метод базируется на взаимодействии с энергетическими каналами, по которым поступают потоки космической энергии. Эффективность системы подтверждена научными исследованиями, тысячами практикующих Инициологов и результатами их клиентов.",
    infobox: {
      title: "Инициология",
      rows: [
        { label: "Тип", value: "Энергопрактика" },
        { label: "Направление", value: "Энергоинформационная система" },
        { label: "Основа", value: "Космические каналы" },
        { label: "Ступени", value: "4 основные + РМТ" },
        { label: "Сайт", value: "iniciolog.ru" },
      ],
    },
    sections: [
      {
        id: "overview",
        title: "Общие сведения",
        level: 2,
        content: `<p>Инициология — это энергетическая практика, направленная на оздоровление и повышение качества жизни. Метод базируется на взаимодействии с энергетическими каналами, по которым поступают потоки космической энергии.</p>
<p>Эти потоки благоприятно влияют на все сферы жизнедеятельности человека. Благодаря работе с каналами происходит физическое исцеление, очищение тонких энергетических структур, качественное улучшение всех сфер жизни.</p>
<p>Инициологию как инструмент влияния активно используют представители элиты деловой и бизнес-среды — ведущие профессионалы и предприниматели, занимающие ключевые позиции в экономике и управлении.</p>`,
      },
      {
        id: "spheres",
        title: "Сферы применения",
        level: 2,
        content: `<p>В <strong>социальной сфере</strong> практика работы с каналами способствует улучшению общественного положения, удачи, карьерного роста, бизнес-успехов и реализации личных целей.</p>
<p>В <strong>личной сфере</strong> специализированные каналы помогают улучшить климат в семье, укрепить личные взаимоотношения, формировать благоприятное окружение и взаимовыгодные связи.</p>
<p>В <strong>сфере безопасности</strong> каналы оберегают от врагов и недоброжелателей, защищают от негативных воздействий со стороны социума и других людей.</p>
<p>Воздействие каналов ощущается всеми на физическом уровне и может быть зарегистрировано приборами магнитно-резонансной диагностики. Результаты подтверждаются данными медицинского обследования.</p>`,
      },
      {
        id: "learning",
        title: "Обучение",
        level: 2,
        content: `<p>Каждый желающий может обучиться работе с каналами и освоить метод Инициологии. Для этого не требуется обладать особыми способностями или задатками.</p>
<p>Доступ к энергетическим каналам передается от мастера-учителя к ученику через <strong>инициацию</strong> (сонастройку, подключение), после чего ученик сразу может приступить к работе с каналами и получать соответствующие результаты.</p>
<p>Ученик приступает к работе с каналами с первых дней обучения. Каналы передаются один раз и доступ к ним сохраняется на всю жизнь.</p>
<p>Метод Инициологии позволяет каждому человеку стать профессиональным целителем и экстрасенсом для себя, без упорных тренировок и врождённых способностей.</p>`,
      },
      {
        id: "advantages",
        title: "Преимущества системы",
        level: 2,
        content: `<p>Инициолог <strong>не затрачивает своей энергии</strong> на работу с проблемой или заболеванием. Всю работу выполняют каналы, по которым поступает энергия космоса. Ресурс каналов безграничен — они могут дать столько энергии, сколько нужно пациенту.</p>
<p>Каналы обеспечивают <strong>энергетическую защиту</strong> от переноса болезнетворной информации и негативных программ с пациента на Инициолога во время сеанса.</p>
<p>Инициология обладает арсеналом <strong>целевых каналов</strong>, целенаправленно работающих с определёнными заболеваниями и типами проблем. На каждую проблему и заболевание — свой целенаправленно настроенный энергетический канал.</p>
<p>Это позволяет достигать исцеления хронических заболеваний и решения тяжёлых проблем, сокращая продолжительность работы до нескольких сеансов. Стандартный курс длится 7 сеансов, за которые восстанавливается 7 энергоцентров.</p>`,
      },
      {
        id: "energy-source",
        title: "Источник энергии",
        level: 2,
        content: `<p>В Инициологии используется чистый и универсальный источник энергии, общий для всех форм жизни и природных сил на нашей планете. Все каналы подключены к этому источнику.</p>
<p>Это естественная энергетическая цепь нашей Солнечной системы и Галактики в целом, которая не использует магические и прочие нижестоящие структуры. Она также не потребляет ресурсы планеты.</p>
<p>Работа этой системы основана на концепции энергоинформационной модели мира, которая не имеет отношения к магии, сверхъестественным силам или религиозным верованиям.</p>`,
      },
    ],
    categories: ["Основы", "Энергопрактика", "Система"],
    seeAlso: ["Энергетические каналы", "РМТ-технологии", "Ступени обучения", "Космоэнергетика и Инициология"],
    references: [
      "Официальный сайт Инициологии — iniciolog.ru",
      "Научные исследования эффективности системы",
      "Отзывы практикующих Инициологов",
    ],
  },
  "Энергетические каналы": {
    title: "Энергетические каналы",
    intro: "Энергетические каналы — основной инструмент работы в Инициологии. Представляют собой потоки космической энергии, которые направляются на пациента для исцеления, очищения и улучшения различных сфер жизни. Каждый канал имеет свою специализацию и целенаправленно работает с определёнными проблемами.",
    infobox: {
      title: "Энергетические каналы",
      rows: [
        { label: "Тип", value: "Энергетический инструмент" },
        { label: "Источник", value: "Космическая энергия" },
        { label: "Передача", value: "Через инициацию" },
        { label: "Срок действия", value: "Пожизненный" },
      ],
    },
    sections: [
      {
        id: "principle",
        title: "Принцип работы",
        level: 2,
        content: `<p>Энергетические каналы — это потоки космической энергии, которые Инициолог направляет на решение конкретных задач. В отличие от других энергопрактик, где целитель использует свою личную энергию, в Инициологии вся работа выполняется каналами.</p>
<p>От Инициолога требуется только открыть канал в начале сеанса и закрыть его в конце. Всё остальное — работа самого канала. Это обеспечивает:</p>
<ul>
<li>Безграничный ресурс энергии для работы</li>
<li>Защиту практикующего от негативного переноса</li>
<li>Целенаправленное воздействие на проблему</li>
<li>Стабильные и предсказуемые результаты</li>
</ul>`,
      },
      {
        id: "types",
        title: "Типы каналов",
        level: 2,
        content: `<p>В системе Инициологии существует множество специализированных каналов:</p>
<ul>
<li><strong>Целительные каналы</strong> — для работы с физическим телом и заболеваниями</li>
<li><strong>Очищающие каналы</strong> — для чистки энергетических структур</li>
<li><strong>Защитные каналы</strong> — для энергоинформационной безопасности</li>
<li><strong>Социальные каналы</strong> — для улучшения положения в обществе</li>
<li><strong>Каналы отношений</strong> — для гармонизации личной сферы</li>
</ul>
<p>На каждую проблему и заболевание существует свой целенаправленно настроенный энергетический канал.</p>`,
      },
      {
        id: "initiation",
        title: "Получение каналов",
        level: 2,
        content: `<p>Доступ к энергетическим каналам передаётся от Мастера-Учителя к ученику через процесс <strong>инициации</strong> (сонастройки, подключения).</p>
<p>После инициации ученик сразу получает возможность работать с каналами и достигать результатов. Каналы передаются один раз и доступ к ним сохраняется на всю жизнь.</p>
<p>С каждой ступенью обучения ученик получает доступ к новым, более мощным каналам и технологиям.</p>`,
      },
    ],
    categories: ["Практика", "Основы", "Инструменты"],
    seeAlso: ["Инициология", "Ступени обучения", "Инициация"],
    references: [
      "Материалы обучения Инициологии",
      "iniciolog.ru",
    ],
  },
  "РМТ-технологии": {
    title: "РМТ-технологии",
    intro: "РМТ (Ра-Ману-Тан) — высшая ступень энергоинформационного развития в системе Инициологии. Представляет собой верхний предел реализации человека в энергоинформационном плане в рамках земного существования. Доступна только опытным Мастерам и Мастерам-Учителям Инициологии.",
    infobox: {
      title: "РМТ-технологии",
      rows: [
        { label: "Уровень", value: "Высшая ступень" },
        { label: "Требования", value: "4-я ступень + опыт" },
        { label: "Уроков", value: "12" },
        { label: "Направление", value: "Эгрегоры, безопасность" },
      ],
    },
    sections: [
      {
        id: "nature",
        title: "Природа РМТ",
        level: 2,
        content: `<p>РМТ — это настройка разрешений и обратных энергоинформационных связей, соединяющих сознание человека с энергоинформационным полотном Вселенной по заложенным в энергетической системе человека природным неактивированным схемам.</p>
<p>Человек, сознание которого становится видимым для энергоинформационных систем Вселенной и восприимчивым к излучениям и потокам энергоинформационного плана, может объединяться с системным сознанием любых структур и объектов во Вселенной.</p>
<p>Это становится возможным благодаря наличию у человеческого вида такой сознательной функции. Энергоинформационные структуры природного происхождения лишены такой способности и действуют большей частью бессознательно.</p>`,
      },
      {
        id: "applications",
        title: "Сферы применения",
        level: 2,
        content: `<p>РМТ-технологии применяются для достижения практических задач в различных сферах жизни:</p>
<ul>
<li><strong>Здоровье</strong> — генерация долгосрочных эгрегоров для выздоровления</li>
<li><strong>Энергоинформационная безопасность</strong> — создание защитных станций и клонов</li>
<li><strong>Бизнес и социальные структуры</strong> — создание эгрегоров для развития проектов</li>
<li><strong>Отношения</strong> — эгрегоры для семьи и партнёрства</li>
</ul>`,
      },
      {
        id: "program",
        title: "Программа курса",
        level: 2,
        content: `<p>Курс РМТ включает 12 уроков:</p>
<ol>
<li><strong>INICIO LOGOS</strong> — запрос на получение прямых инициаций в любые системы</li>
<li>Установление контроля над эгрегорами социума</li>
<li>Создание эгрегоров</li>
<li>Технология массовых дистанционных сеансов</li>
<li>Технология ликвидации эгрегоров</li>
<li>Эгрегор для бизнеса и коммерческих проектов</li>
<li>Эгрегор для семьи, отношений, личных целей</li>
<li>Запрос энергоинформационных космических каналов</li>
<li>Подключение Союзника</li>
<li>Энергоинформационная безопасность. Создание клона</li>
<li>Система силовых защитных станций</li>
<li>Генерация эгрегоров для тяжёлых случаев</li>
</ol>`,
      },
      {
        id: "requirements",
        title: "Требования к кандидатам",
        level: 2,
        content: `<p>Для получения права на посвящение в РМТ необходимо:</p>
<ul>
<li>Полностью освоить Мастерскую (4-ю) ступень</li>
<li>Получить достаточный опыт работы на этой ступени</li>
<li>Чётко ориентироваться в производимых энергоинформационных процессах</li>
<li>Иметь ясную цель и обоснованную потребность</li>
<li>Отсутствие сильного чувства вины, страхов и фобий</li>
</ul>
<p>РМТ-посвящение доступно только для зрелых практиков, готовых к работе на высшем уровне.</p>`,
      },
    ],
    categories: ["Продвинутый уровень", "Обучение", "Эгрегоры"],
    seeAlso: ["Инициология", "Ступени обучения", "Эгрегоры", "Энергоинформационная безопасность"],
    references: [
      "Программа курса РМТ — iniciolog.ru/rmt",
      "Материалы для Мастеров-Учителей",
    ],
  },
  "Ступени обучения": {
    title: "Ступени обучения",
    intro: "Система обучения в Инициологии включает несколько последовательных ступеней, каждая из которых даёт ученику новые каналы, технологии и возможности. Путь от ученика до Мастера-Учителя предполагает постепенное освоение всё более мощных инструментов энергоинформационной работы.",
    infobox: {
      title: "Ступени обучения",
      rows: [
        { label: "Всего ступеней", value: "4 основные + РМТ" },
        { label: "Начальный уровень", value: "1-я ступень" },
        { label: "Мастерская", value: "4-я ступень" },
        { label: "Высшая", value: "РМТ" },
      ],
    },
    sections: [
      {
        id: "first",
        title: "Первая ступень",
        level: 2,
        content: `<p>На первой ступени ученик получает базовые каналы для работы с собой и близкими. Изучаются основы системы, принципы работы с энергией и техника безопасности.</p>
<p>После первой ступени ученик уже может:</p>
<ul>
<li>Проводить сеансы для себя и близких</li>
<li>Работать с базовыми проблемами здоровья</li>
<li>Использовать защитные каналы</li>
</ul>`,
      },
      {
        id: "second",
        title: "Вторая ступень",
        level: 2,
        content: `<p>Вторая ступень расширяет арсенал каналов и даёт возможность работать с более сложными случаями. Ученик получает доступ к специализированным каналам для различных органов и систем организма.</p>`,
      },
      {
        id: "third",
        title: "Третья ступень",
        level: 2,
        content: `<p>Третья ступень — уровень продвинутого практика. Добавляются каналы для работы с социальной сферой, бизнесом, отношениями. Изучаются технологии дистанционной работы.</p>`,
      },
      {
        id: "master",
        title: "Мастерская ступень",
        level: 2,
        content: `<p>Четвёртая (Мастерская) ступень — полный арсенал Инициолога. Мастерские технологии позволяют провести полную энергетическую чистку за 1–3 сеанса.</p>
<p>Мастер получает право обучать других и передавать инициации. После накопления опыта на этой ступени открывается путь к РМТ-технологиям.</p>`,
      },
    ],
    categories: ["Обучение", "Развитие", "Практика"],
    seeAlso: ["Инициология", "РМТ-технологии", "Энергетические каналы", "Инициация"],
    references: [
      "Программы обучения — iniciolog.ru",
      "Информация о сессиях и курсах",
    ],
  },
  "Космоэнергетика и Инициология": {
    title: "Космоэнергетика и Инициология",
    intro: "Сравнение двух энергоинформационных систем: Космоэнергетики и Инициологии. Несмотря на некоторое внешнее сходство, системы имеют принципиальные различия в подходе, эффективности и безопасности практики.",
    infobox: {
      title: "Сравнение систем",
      rows: [
        { label: "Космоэнергетика", value: "Составная система" },
        { label: "Инициология", value: "Целостная система" },
        { label: "Уровень", value: "Планетарный / Космический" },
      ],
    },
    sections: [
      {
        id: "differences",
        title: "Основные различия",
        level: 2,
        content: `<p><strong>Инициология</strong> создавалась как система для исцеления и благополучия человека. Вся структура этой системы, включая каналы и блоки посвящения, служит общей цели: здоровью и благополучию человека.</p>
<p><strong>Космоэнергетика</strong> — это собирательная, составная система, включающая в том числе посвящения в разные магические и астральные структуры планетарного уровня.</p>`,
      },
      {
        id: "power",
        title: "Уровень силы",
        level: 2,
        content: `<p>Все силы планетарного уровня, включая магические и астральные структуры, подчиняются силам и энергии космического уровня, применяемым в Инициологии.</p>
<p>Это делает Инициологию сильнейшей системой энергоинформационной безопасности на сегодняшний день.</p>`,
      },
      {
        id: "efficiency",
        title: "Эффективность",
        level: 2,
        content: `<p>Мастерские технологии Инициологии позволяют провести полную энергетическую чистку за 1–3 сеанса.</p>
<p>В космоэнергетике для достижения такого результата может потребоваться от 10 сеансов и значительно больше.</p>
<p>За последнее десятилетие многие космоэнергеты перешли и продолжают переходить в Инициологию, чтобы использовать более эффективные инструменты в своей практике.</p>`,
      },
    ],
    categories: ["Сравнения", "Космоэнергетика", "Основы"],
    seeAlso: ["Инициология", "Рэйки и Инициология", "Энергетические каналы"],
    references: [
      "Сравнительный анализ энергопрактик",
      "Отзывы практиков, перешедших в Инициологию",
    ],
  },
  "Рэйки и Инициология": {
    title: "Рэйки и Инициология",
    intro: "Сравнение систем Рэйки и Инициологии. Обе практики работают с энергией, но имеют существенные различия в механизме воздействия и области применения.",
    infobox: {
      title: "Сравнение систем",
      rows: [
        { label: "Рэйки", value: "Гармонизация тонких тел" },
        { label: "Инициология", value: "Целенаправленное исцеление" },
        { label: "Роль практика", value: "Проводник / Оператор" },
      ],
    },
    sections: [
      {
        id: "reiki",
        title: "Особенности Рэйки",
        level: 2,
        content: `<p>Энергия Рэйки в первую очередь помогает гармонизировать тонкие тела человека. Она не предназначена для целенаправленного исцеления тяжёлых состояний физического тела.</p>
<p>В практике Рэйки целитель выступает в роли <strong>проводника</strong> тонкой энергии. Он пропускает эту энергию через себя и направляет её на пациента.</p>`,
      },
      {
        id: "initiology",
        title: "Особенности Инициологии",
        level: 2,
        content: `<p>В Инициологии ученик действует как <strong>оператор</strong> энергетических потоков космоса. Он направляет поток энергии через каналы прямо на пациента, не вмешиваясь в сам процесс исцеления.</p>
<p>Во время сеанса работают только эти каналы. От ученика требуется только открыть и закрыть каналы в начале и конце сеанса.</p>
<p>Каналы оказывают целенаправленное воздействие на все органы и системы организма, а также на энергетические центры и поле.</p>`,
      },
    ],
    categories: ["Сравнения", "Рэйки", "Основы"],
    seeAlso: ["Инициология", "Космоэнергетика и Инициология", "Энергетические каналы"],
    references: [
      "Сравнение методов энергетического целительства",
    ],
  },
};

export default function ArticlePage() {
  const params = useParams<{ title: string }>();
  const articleTitle = decodeURIComponent(params.title || "Инициология");
  const article = articlesData[articleTitle] || articlesData["Инициология"];
  
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
                <img 
                  src="https://static.tildacdn.com/tild3862-6363-4664-a438-316536343535/___.png" 
                  alt="Initiology" 
                  className="h-8 w-auto"
                />
                <span className="font-serif font-semibold text-xl hidden sm:inline">Initiology Wiki</span>
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
                Разделы
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
                Источники
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
