import React, { useEffect, useState } from 'react';

const CSSVariablesTest: React.FC = () => {
  const [cssVariables, setCssVariables] = useState<Record<string, string>>({});

  useEffect(() => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    const variables = {
      '--color-background':
        computedStyle.getPropertyValue('--color-background'),
      '--color-foreground':
        computedStyle.getPropertyValue('--color-foreground'),
      '--color-primary': computedStyle.getPropertyValue('--color-primary'),
      '--color-secondary': computedStyle.getPropertyValue('--color-secondary'),
      '--color-accent': computedStyle.getPropertyValue('--color-accent'),
      '--color-muted': computedStyle.getPropertyValue('--color-muted'),
      '--color-success': computedStyle.getPropertyValue('--color-success'),
      '--color-warning': computedStyle.getPropertyValue('--color-warning'),
      '--color-destructive': computedStyle.getPropertyValue(
        '--color-destructive'
      ),
      '--color-card': computedStyle.getPropertyValue('--color-card'),
      '--color-popover': computedStyle.getPropertyValue('--color-popover'),
      '--color-border': computedStyle.getPropertyValue('--color-border'),
      '--gradient-primary':
        computedStyle.getPropertyValue('--gradient-primary'),
      '--gradient-secondary': computedStyle.getPropertyValue(
        '--gradient-secondary'
      ),
      '--gradient-dark': computedStyle.getPropertyValue('--gradient-dark'),
      '--shadow-elegant': computedStyle.getPropertyValue('--shadow-elegant'),
      '--shadow-glow': computedStyle.getPropertyValue('--shadow-glow'),
    };

    setCssVariables(variables);
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          CSS Variables Test
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-card rounded-lg border border-border">
            <h2 className="text-2xl font-semibold mb-4">
              CSS Variables Values
            </h2>
            <div className="space-y-2 text-sm">
              {Object.entries(cssVariables).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-mono text-muted-foreground">
                    {key}:
                  </span>
                  <span className="font-mono text-foreground">
                    {value || 'not set'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-card rounded-lg border border-border">
            <h2 className="text-2xl font-semibold mb-4">Color Tests</h2>
            <div className="space-y-4">
              <div className="p-4 bg-primary text-primary-foreground rounded">
                Primary Color
              </div>
              <div className="p-4 bg-secondary text-secondary-foreground rounded">
                Secondary Color
              </div>
              <div className="p-4 bg-accent text-accent-foreground rounded">
                Accent Color
              </div>
              <div className="p-4 bg-muted text-muted-foreground rounded">
                Muted Color
              </div>
              <div className="p-4 bg-success text-success-foreground rounded">
                Success Color
              </div>
              <div className="p-4 bg-warning text-warning-foreground rounded">
                Warning Color
              </div>
              <div className="p-4 bg-destructive text-destructive-foreground rounded">
                Destructive Color
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gradient-primary rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Gradient Test</h2>
          <p className="text-white">Primary Gradient Background</p>
        </div>

        <div className="mt-8 p-6 bg-gradient-secondary rounded-lg">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Secondary Gradient
          </h2>
          <p className="text-foreground">Secondary Gradient Background</p>
        </div>

        <div className="mt-8 p-6 bg-gradient-dark rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Dark Gradient</h2>
          <p className="text-white">Dark Gradient Background</p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </div>
  );
};

export default CSSVariablesTest;
