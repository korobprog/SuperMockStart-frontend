import { Button } from '@/components/ui/button';
import { Moon, Sun, Monitor, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';
import { useState, useRef, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeToggle() {
  const { theme, setTheme, mounted } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="w-10 h-10 p-0 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10"
        disabled
      >
        <Sun className="h-4 w-4 animate-pulse" />
      </Button>
    );
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'system':
        return <Monitor className="h-4 w-4" />;
      default:
        return <Palette className="h-4 w-4" />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return 'Светлая';
      case 'dark':
        return 'Темная';
      case 'system':
        return 'Системная';
      default:
        return 'Тема';
    }
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    console.log('Changing theme from', theme, 'to', newTheme);
    setIsAnimating(true);
    setTheme(newTheme);
    setIsOpen(false);

    // Force immediate update with multiple checks
    setTimeout(() => {
      const root = document.documentElement;
      console.log('Current HTML classes:', root.className);
      console.log('Current theme state:', newTheme);

      // Force a repaint
      root.style.display = 'none';
      root.offsetHeight;
      root.style.display = '';

      // Additional force update
      requestAnimationFrame(() => {
        root.style.setProperty('--theme-update', Date.now().toString());
      });
    }, 100);
  };

  const themes = [
    {
      value: 'light',
      label: 'Светлая',
      icon: Sun,
      description: 'Светлая тема',
    },
    { value: 'dark', label: 'Темная', icon: Moon, description: 'Темная тема' },
    {
      value: 'system',
      label: 'Системная',
      icon: Monitor,
      description: 'Следует системным настройкам',
    },
  ];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          ref={buttonRef}
          variant="ghost"
          size="sm"
          className={cn(
            'w-10 h-10 p-0 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 hover:shadow-glow transition-all duration-300',
            isAnimating && 'animate-pulse'
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {getIcon()}
          <span className="sr-only">Переключить тему</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 p-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border shadow-elegant"
      >
        <div className="flex items-center justify-between px-2 py-1.5">
          <span className="text-sm font-medium">Тема</span>
          <span className="text-xs text-muted-foreground">
            {getThemeLabel()}
          </span>
        </div>
        <div className="space-y-1">
          {themes.map((themeOption) => {
            const Icon = themeOption.icon;
            return (
              <DropdownMenuItem
                key={themeOption.value}
                onClick={() => handleThemeChange(themeOption.value as any)}
                className={cn(
                  'flex items-center space-x-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors',
                  theme === themeOption.value
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium">{themeOption.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {themeOption.description}
                  </div>
                </div>
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
