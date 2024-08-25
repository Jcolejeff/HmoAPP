'use client';

import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils/css';
import { getInitialsFromSentence } from '@/lib/utils/string';

const avatarVariants = cva('relative flex items-center justify-center overflow-hidden rounded-full align-middle', {
  variants: {
    size: {
      xs: 'w-6 h-6 text-xs',
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-md',
      lg: 'w-12 h-12',
    },
  },
  defaultVariants: {
    size: 'xs',
  },
});

interface AvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const AvatarRoot = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Root>, AvatarProps>(
  ({ className, size, ...props }, ref) => (
    <AvatarPrimitive.Root ref={ref} className={cn(avatarVariants({ size }), className)} {...props} />
  ),
);
AvatarRoot.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image ref={ref} className={cn('aspect-square h-full w-full', className)} {...props} />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn('bg-muted flex h-full w-full items-center justify-center rounded-full', className)}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

const Avatar = React.forwardRef<
  HTMLDivElement,
  {
    name: string;
    image?: string;
    className?: string;
    fallbackClassName?: string;
    initialCount?: 1 | 2;
    size?: 'xs' | 'sm' | 'md' | 'lg';
  }
>(({ name, image, className, fallbackClassName, initialCount = 2, size = 'xs', ...props }, ref) => {
  let userInitial = getInitialsFromSentence(name || '');

  return (
    <AvatarRoot className={className} size={size} ref={ref} {...props}>
      <AvatarPrimitive.AvatarImage src={image} className="shrink-0" />
      <AvatarPrimitive.AvatarFallback className={cn('text-uppercase shrink-0', fallbackClassName)}>
        {userInitial.slice(0, initialCount)}
      </AvatarPrimitive.AvatarFallback>
    </AvatarRoot>
  );
});

Avatar.displayName = 'Avatar';

export { Avatar, AvatarImage, AvatarFallback, AvatarRoot };
