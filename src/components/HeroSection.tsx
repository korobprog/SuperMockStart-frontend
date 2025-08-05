import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Play, Star, Users, Clock, Zap } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-primary/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-dark opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 hover-lift">
            <Star className="w-4 h-4" />
            Платформа #1 для IT-собеседований в России
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-gradient">
            Прокачай навыки для <br />
            IT-собеседований
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Практикуйся с реальными интервьюерами, участвуй в хакатонах, получай
            менторство от Senior-разработчиков и строй карьеру в IT
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="gradient" size="xl" className="group hover-glow">
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Начать собеседование
            </Button>
            <Button variant="outline" size="xl" className="hover-lift">
              Смотреть демо
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Card className="p-6 bg-gradient-secondary border-0 card-hover">
              <CardContent className="p-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold">15,000+</div>
                    <div className="text-sm text-muted-foreground">
                      Участников
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 bg-gradient-secondary border-0 card-hover">
              <CardContent className="p-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-accent" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold">50,000+</div>
                    <div className="text-sm text-muted-foreground">
                      Собеседований
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 bg-gradient-secondary border-0 card-hover">
              <CardContent className="p-0">
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
