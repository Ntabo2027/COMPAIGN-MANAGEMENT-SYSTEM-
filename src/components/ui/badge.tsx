import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-emerald-700 text-white shadow-xs',
        secondary:
          'border-zinc-200 bg-zinc-100 text-zinc-900 border',
        success:
          'border-emerald-200 bg-emerald-50 text-emerald-800 border',
        warning:
          'border-amber-200 bg-amber-50 text-amber-800 border',
        danger:
          'border-red-200 bg-red-50 text-red-800 border',
        info:
          'border-sky-200 bg-sky-50 text-sky-800 border',
        outline:
          'text-zinc-800 border border-zinc-300 bg-white',
        black:
          'border-transparent bg-black text-white shadow-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
