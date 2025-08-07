import React from 'react';

const TailwindTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          Tailwind CSS Test
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Basic colors */}
          <div className="p-6 bg-primary text-primary-foreground rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Primary Color</h3>
            <p>This should be purple/blue gradient</p>
          </div>

          <div className="p-6 bg-secondary text-secondary-foreground rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Secondary Color</h3>
            <p>This should be light purple</p>
          </div>

          <div className="p-6 bg-accent text-accent-foreground rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Accent Color</h3>
            <p>This should be cyan</p>
          </div>

          <div className="p-6 bg-muted text-muted-foreground rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Muted Color</h3>
            <p>This should be gray</p>
          </div>

          <div className="p-6 bg-success text-success-foreground rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Success Color</h3>
            <p>This should be green</p>
          </div>

          <div className="p-6 bg-warning text-warning-foreground rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Warning Color</h3>
            <p>This should be yellow/orange</p>
          </div>

          <div className="p-6 bg-destructive text-destructive-foreground rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Destructive Color</h3>
            <p>This should be red</p>
          </div>

          <div className="p-6 bg-card text-card-foreground rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-2">Card Color</h3>
            <p>This should have a border</p>
          </div>

          <div className="p-6 bg-popover text-popover-foreground rounded-lg border border-border">
            <h3 className="text-lg font-semibold mb-2">Popover Color</h3>
            <p>This should have a border</p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gradient-primary rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Gradient Test</h2>
          <p className="text-white">This should be a gradient background</p>
        </div>

        <div className="mt-8 p-6 bg-gradient-secondary rounded-lg">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Secondary Gradient
          </h2>
          <p className="text-foreground">This should be a secondary gradient</p>
        </div>

        <div className="mt-8 p-6 bg-gradient-dark rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Dark Gradient</h2>
          <p className="text-white">This should be a dark gradient</p>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Shadow Tests
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-card rounded-lg shadow-elegant">
              <h3 className="text-lg font-semibold mb-2">Elegant Shadow</h3>
              <p>This should have an elegant shadow</p>
            </div>

            <div className="p-6 bg-card rounded-lg shadow-glow">
              <h3 className="text-lg font-semibold mb-2">Glow Shadow</h3>
              <p>This should have a glow shadow</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Animation Tests
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-card rounded-lg animate-fade-in">
              <h3 className="text-lg font-semibold mb-2">Fade In Animation</h3>
              <p>This should fade in</p>
            </div>

            <div className="p-6 bg-card rounded-lg animate-scale-in">
              <h3 className="text-lg font-semibold mb-2">Scale In Animation</h3>
              <p>This should scale in</p>
            </div>

            <div className="p-6 bg-card rounded-lg animate-glow-pulse">
              <h3 className="text-lg font-semibold mb-2">
                Glow Pulse Animation
              </h3>
              <p>This should pulse with glow</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Border Tests
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-card rounded-lg border-modern">
              <h3 className="text-lg font-semibold mb-2">Modern Border</h3>
              <p>This should have a modern border</p>
            </div>

            <div className="p-6 bg-card rounded-lg border-modern-elevated">
              <h3 className="text-lg font-semibold mb-2">Elevated Border</h3>
              <p>This should have an elevated border</p>
            </div>

            <div className="p-6 bg-card rounded-lg border-modern-colored">
              <h3 className="text-lg font-semibold mb-2">Colored Border</h3>
              <p>This should have a colored border</p>
            </div>

            <div className="p-6 bg-card rounded-lg border-modern-gradient">
              <h3 className="text-lg font-semibold mb-2">Gradient Border</h3>
              <p>This should have a gradient border</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Window Border Tests
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-card rounded-lg border-window-shadow">
              <h3 className="text-lg font-semibold mb-2">
                Window Shadow Border
              </h3>
              <p>This should have a window shadow border</p>
            </div>

            <div className="p-6 bg-card rounded-lg border-window-primary">
              <h3 className="text-lg font-semibold mb-2">
                Window Primary Border
              </h3>
              <p>This should have a window primary border</p>
            </div>

            <div className="p-6 bg-card rounded-lg border-window-accent">
              <h3 className="text-lg font-semibold mb-2">
                Window Accent Border
              </h3>
              <p>This should have a window accent border</p>
            </div>

            <div className="p-6 bg-card rounded-lg border-window-gradient">
              <h3 className="text-lg font-semibold mb-2">
                Window Gradient Border
              </h3>
              <p>This should have a window gradient border</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TailwindTest;
