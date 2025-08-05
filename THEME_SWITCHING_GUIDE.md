# Современное переключение тем в Tailwind CSS 4

## Обзор

Это руководство демонстрирует, как реализовать современное переключение тем в Tailwind CSS 4 с использованием CSS переменных, красивых анимаций и выпадающего меню.

## Ключевые особенности

### 1. CSS переменные с @theme директивой

```css
@theme {
  --color-primary: #8b5cf6;
  --color-background: #ffffff;
  --color-foreground: #0f172a;
}

.dark {
  @theme {
    --color-background: #1e293b;
    --color-foreground: #fafafa;
  }
}

.light {
  @theme {
    --color-background: #ffffff;
    --color-foreground: #0f172a;
  }
}
```

### 2. Плавные анимации

```css
/* Анимация переключения тем */
@keyframes theme-switch {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.1);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}

.animate-theme-switch {
  animation: theme-switch 0.6s ease-in-out;
}
```

### 3. Градиентные эффекты

```css
.theme-toggle-button {
  background: linear-gradient(
    135deg,
    var(--color-primary),
    var(--color-accent)
  );
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}
```

## Компоненты

### ThemeToggle

Основной компонент переключения тем с выпадающим меню:

```tsx
import { ThemeToggle } from '@/components/ThemeToggle';

// Использование
<ThemeToggle />;
```

### ThemeMenu

Демонстрационный компонент с полной информацией о темах:

```tsx
import { ThemeMenu } from '@/components/ThemeMenu';

// Использование
<ThemeMenu />;
```

### useTheme Hook

Хук для управления темами:

```tsx
import { useTheme } from '@/hooks/useTheme';

const { theme, setTheme, getCurrentTheme, isDark, isLight, isSystem } =
  useTheme();
```

## Функциональность

### Поддерживаемые темы

- **Светлая** - для дневного использования
- **Темная** - для комфортного просмотра в темноте
- **Системная** - автоматически следует настройкам системы

### Автоматическое сохранение

Выбор темы сохраняется в `localStorage` и восстанавливается при следующем посещении.

### Отслеживание системных изменений

При выборе системной темы приложение автоматически реагирует на изменения настроек системы.

## Анимации и эффекты

### 1. Hover эффекты

- Масштабирование иконок при наведении
- Плавные переходы цветов
- Градиентные подложки

### 2. Переходы между темами

- Плавная анимация смены цветов
- Вращение иконок при переключении
- Ripple эффекты при клике

### 3. Визуальная обратная связь

- Индикаторы активной темы
- Подсветка выбранных опций
- Анимированные иконки

## Структура файлов

```
src/
├── components/
│   ├── ThemeToggle.tsx      # Основной компонент переключения
│   ├── ThemeMenu.tsx        # Демонстрационный компонент
│   └── ui/
│       └── dropdown-menu.tsx # Dropdown меню
├── hooks/
│   └── useTheme.ts          # Хук управления темами
├── styles/
│   └── tailwind.css         # CSS переменные и анимации
└── pages/
    └── ThemeDemo.tsx        # Демонстрационная страница
```

## Использование в проекте

### 1. Добавление в навигацию

```tsx
import { ThemeToggle } from '@/components/ThemeToggle';

function Navigation() {
  return (
    <nav>
      {/* ... другие элементы навигации */}
      <ThemeToggle />
    </nav>
  );
}
```

### 2. Интеграция с существующими компонентами

```tsx
import { useTheme } from '@/hooks/useTheme';

function MyComponent() {
  const { isDark } = useTheme();

  return (
    <div className={isDark() ? 'dark-theme' : 'light-theme'}>
      {/* Контент */}
    </div>
  );
}
```

## Преимущества

1. **Производительность** - CSS переменные обеспечивают быстрые переключения
2. **Доступность** - Поддержка системных настроек и клавиатурной навигации
3. **UX** - Плавные анимации и визуальная обратная связь
4. **Гибкость** - Легко расширяется для новых тем
5. **Совместимость** - Работает с Tailwind CSS 4 и современными браузерами

## Демонстрация

Запустите проект и перейдите на страницу `/theme-demo` для просмотра полной демонстрации:

```bash
pnpm dev:full
```

## Заключение

Этот подход к переключению тем обеспечивает современный, производительный и удобный пользовательский опыт, полностью соответствующий принципам Tailwind CSS 4.
