import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

function Navigation() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Главная' },
    { path: '/interview', label: 'Собеседование' },
    { path: '/feedback-history', label: 'Отзывы' },
    {
      path: '/test-feedback',
      label: '🧪 Тест отзывов',
      className: 'text-orange-600 hover:text-orange-700',
    },
    { path: '/about', label: 'О проекте' },
    { path: '/auth', label: 'Авторизация' },
    {
      path: '/token-check?userId=1736594064',
      label: '🔧 Тест',
      className: 'text-blue-600 hover:text-blue-700',
    },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Логотип */}
          <Link
            to="/"
            className="text-xl font-bold text-gray-900 flex-shrink-0"
          >
            <span className="hidden xs:inline">SuperMockStart</span>
            <span className="xs:hidden">SMS</span>
          </Link>

          {/* Десктопное меню */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
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
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary text-primary-foreground'
                      : 'text-gray-900 hover:bg-gray-100'
                  } ${item.className || ''}`}
                >
                  {item.label}
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
