import * as React from 'react';

import { cn } from '../../lib/utils';

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn(
        'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm',
        className
      )}
      {...props}
    />
  );
}

// Новые карточки с современными границами
function ModernCard({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="modern-card"
      className={cn(
        'bg-card text-card-foreground flex flex-col gap-6 rounded-xl card-modern py-6',
        className
      )}
      {...props}
    />
  );
}

function ElevatedCard({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="elevated-card"
      className={cn(
        'bg-card text-card-foreground flex flex-col gap-6 rounded-xl card-modern-elevated py-6',
        className
      )}
      {...props}
    />
  );
}

function ColoredCard({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="colored-card"
      className={cn(
        'bg-card text-card-foreground flex flex-col gap-6 rounded-xl card-modern-colored py-6',
        className
      )}
      {...props}
    />
  );
}

function GradientCard({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="gradient-card"
      className={cn(
        'bg-card text-card-foreground flex flex-col gap-6 rounded-xl card-modern-gradient py-6',
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('leading-none font-semibold', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('px-6', className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  );
}

export {
  Card,
  ModernCard,
  ElevatedCard,
  ColoredCard,
  GradientCard,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
