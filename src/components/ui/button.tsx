import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-emerald-700 text-white shadow-xs hover:bg-emerald-800 active:bg-emerald-900 border border-emerald-800',
        secondary:
          'bg-zinc-100 text-zinc-900 shadow-xs hover:bg-zinc-200 border border-zinc-200/80',
        outline:
          'border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50 hover:text-zinc-900',
        ghost:
          'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900',
        destructive:
          'bg-red-600 text-white shadow-xs hover:bg-red-700',
        success:
          'bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200',
        dark:
          'bg-black text-white hover:bg-zinc-800 border border-zinc-800',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-lg px-6 text-base',
        icon: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
