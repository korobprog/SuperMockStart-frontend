import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Github, Twitter, Mail, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">SuperMock</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Современная платформа для подготовки к IT-собеседованиям.
              Практикуйтесь с реальными интервьюерами и стройте карьеру в IT.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Быстрые ссылки</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/interview"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Собеседования
                </Link>
              </li>
              <li>
                <Link
                  to="/practice"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Практика
                </Link>
              </li>
              <li>
                <Link
                  to="/hackathons"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Хакатоны
                </Link>
              </li>
              <li>
                <Link
                  to="/mentorship"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Менторство
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Поддержка</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/help"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Помощь
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Контакты
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Условия использования
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/40 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 SuperMockStart. Все права защищены.
          </p>
          <p className="text-sm text-muted-foreground flex items-center mt-2 md:mt-0">
            Сделано с <Heart className="w-4 h-4 mx-1 text-red-500" /> в России
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
