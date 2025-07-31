import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();

  return (
    <nav className="bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-foreground">
            SuperMockStart
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button
                variant={location.pathname === '/' ? 'default' : 'ghost'}
                size="sm"
              >
                Главная
              </Button>
            </Link>
            <Link to="/interview">
              <Button
                variant={
                  location.pathname === '/interview' ? 'default' : 'ghost'
                }
                size="sm"
              >
                Собеседование
              </Button>
            </Link>
            <Link to="/about">
              <Button
                variant={location.pathname === '/about' ? 'default' : 'ghost'}
                size="sm"
              >
                О проекте
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
