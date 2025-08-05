import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Star, Users, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTelegramAuth } from '@/hooks/useTelegramAuth';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useTelegramAuth();

  const handleStartInterview = () => {
    if (isAuthenticated) {
      navigate('/interview');
    } else {
      // Если не авторизован, показываем авторизацию прямо на этой странице
      const authSection = document.getElementById('auth-section');
      if (authSection) {
        authSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-dark opacity-50" />

      <div className="container mx-auto px-4 relative">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-fade-in">
            <Star className="w-4 h-4" />
            Платформа #1 для IT-собеседований в России
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-gradient animate-scale-in">
            Прокачай навыки для <br />
            IT-собеседований
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
            Практикуйся с реальными интервьюерами, участвуй в хакатонах, получай
            менторство от Senior-разработчиков и строй карьеру в IT
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in">
            <Button
              onClick={handleStartInterview}
              size="lg"
              className="group bg-gradient-primary hover:shadow-glow transition-all duration-300 px-8 py-4 text-lg"
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              {isAuthenticated ? 'Начать собеседование' : 'Войти и начать'}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/about')}
              className="px-8 py-4 text-lg border-primary/20 hover:border-primary/40 hover-lift"
            >
              Узнать больше
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Card className="p-6 bg-gradient-secondary border-0 card-hover animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold">1,500+</div>
                  <div className="text-sm text-muted-foreground">
                    Участников
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-secondary border-0 card-hover animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Play className="w-6 h-6 text-accent" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold">5,000+</div>
                  <div className="text-sm text-muted-foreground">
                    Собеседований
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-secondary border-0 card-hover animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-success" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-sm text-muted-foreground">
                    Доступность
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
