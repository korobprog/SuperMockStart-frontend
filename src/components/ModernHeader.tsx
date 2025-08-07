import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from './ui/button';
import Avatar from './ui/avatar';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './ui/navigation-menu';
import { ThemeToggle } from './ThemeToggle';
import { useTelegramAuth } from '../hooks/useTelegramAuth';
import { User, BookOpen, Calendar, LogOut, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

const ModernHeader: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useTelegramAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // Запрашиваем подтверждение перед выходом
    const confirmed = window.confirm(
      'Вы уверены, что хотите выйти из системы?'
    );

    if (!confirmed) {
      return;
    }

    console.log('🚪 Выход из системы');
    logout();
    navigate('/');
  };

  const menuItems = [
    { href: '/', label: 'Главная', showWhenAuth: false },
    { href: '/dashboard', label: 'Дашборд', showWhenAuth: true },
    { href: '/interview', label: 'Интервью', showWhenAuth: true },
    { href: '/profile', label: 'Профиль', showWhenAuth: true },
    { href: '/about', label: 'О проекте', showWhenAuth: false },
  ];

  // Фильтруем элементы меню в зависимости от статуса авторизации
  const filteredMenuItems = menuItems.filter((item) => {
    if (isAuthenticated) {
      // Если пользователь авторизован, показываем только элементы с showWhenAuth: true
      return item.showWhenAuth === true;
    } else {
      // Если пользователь не авторизован, показываем все элементы
      return true;
    }
  });

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl text-gradient">SuperMock</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {filteredMenuItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <Link
                  to={item.href}
                  className={`px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${
                    isActive(item.href)
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* User Menu / Auth */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <ThemeToggle />

          {isAuthenticated && user ? (
            <div className="hidden md:flex items-center space-x-2">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="flex items-center space-x-2">
                      <Avatar
                        user={user}
                        alt={user.first_name || user.username || 'Пользователь'}
                        size="md"
                        variant="header"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.first_name || user.username || 'Пользователь'}
                      </span>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-48 p-2">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => navigate('/profile')}
                        >
                          <User className="w-4 h-4 mr-2" />
                          Профиль
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => navigate('/dashboard')}
                        >
                          <BookOpen className="w-4 h-4 mr-2" />
                          Дашборд
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => navigate('/interview')}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Интервью
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-destructive hover:text-destructive"
                          onClick={handleLogout}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Выйти
                        </Button>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/auth')}
              className="hidden md:flex"
            >
              Войти
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col space-y-4 mt-8">
                {filteredMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${
                      isActive(item.href)
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <hr className="my-4" />
                {isAuthenticated && user ? (
                  <>
                    <div className="px-4 py-2">
                      <div className="text-sm font-medium">
                        {user.first_name || user.username || 'Пользователь'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        @{user.username}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        navigate('/profile');
                        setIsOpen(false);
                      }}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Профиль
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        navigate('/dashboard');
                        setIsOpen(false);
                      }}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Дашборд
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        navigate('/interview');
                        setIsOpen(false);
                      }}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Интервью
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-destructive hover:text-destructive"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Выйти
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigate('/auth');
                      setIsOpen(false);
                    }}
                  >
                    Войти
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default ModernHeader;
