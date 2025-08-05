import { Button } from './ui/button';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useTelegramAuth } from '../hooks/useTelegramAuth';

function Navigation() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useTelegramAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Главная', showWhenAuth: false },
    { path: '/interview', label: 'Собеседование', showWhenAuth: true },
    { path: '/feedback-history', label: 'Отзывы', showWhenAuth: true },
    {
      path: '/test-feedback',
      label: '🧪 Тест отзывов',
      className: 'text-orange-600 hover:text-orange-700',
      showWhenAuth: false,
    },
    { path: '/about', label: 'О проекте', showWhenAuth: false },
    { path: '/auth', label: 'Авторизация', showWhenAuth: false },
    {
      path: '/token-check?userId=1736594064',
      label: '🔧 Тест',
      className: 'text-blue-600 hover:text-blue-700',
      showWhenAuth: false,
    },
    {
      path: '/auth-fix',
      label: '🔧 Исправить авторизацию',
      className: 'text-red-600 hover:text-red-700',
      showWhenAuth: false,
    },
  ];

  // Фильтруем элементы меню в зависимости от статуса авторизации
  const filteredNavItems = navItems.filter((item) => {
    if (isAuthenticated) {
      // Если пользователь авторизован, показываем только элементы с showWhenAuth: true
      return item.showWhenAuth === true;
    } else {
      // Если пользователь не авторизован, показываем все элементы
      return true;
    }
  });

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Логотип */}
          <Link
            to="/"
            className="text-xl font-bold text-foreground flex-shrink-0"
          >
            <span className="hidden xs:inline">SuperMock</span>
          </Link>

          {/* Десктопное меню */}
          <div className="hidden md:flex items-center space-x-2">
            {filteredNavItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={closeMobileMenu}>
                <Button
                  variant={
                    location.pathname === item.path ? 'default' : 'ghost'
                  }
                  size="sm"
                  className={item.className || ''}
                >
                  {item.label}
                </Button>
              </Link>
            ))}

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>

          {/* Мобильная кнопка меню */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Мобильное меню */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700">
            <div className="px-4 py-2 space-y-1">
              {filteredNavItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={closeMobileMenu}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    size="sm"
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
