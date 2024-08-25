import { cn } from '@/lib/utils/css';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-md bg-slate-100 dark:bg-slate-900', className)} {...props} />;
}

export { Skeleton };
