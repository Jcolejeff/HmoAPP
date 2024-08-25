import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '@/lib/utils/css';

import { Skeleton } from '../ui/skeleton';

interface IContentLoader {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
  blocksClassName?: string;
  numberOfBlocks?: number;
}

const ContentLoader = ({ isLoading, blocksClassName, className, children, numberOfBlocks = 3 }: IContentLoader) => {
  return isLoading ? (
    <div
      className={cn(
        'grid w-full grid-cols-1 gap-x-[1.5rem] gap-y-[3.875rem]  sm:grid-cols-2 md:grid-cols-3',
        className,
      )}
    >
      {[...Array(numberOfBlocks)]?.map((_, idx) => (
        <div key={idx} className={cn('flex w-full flex-col gap-4', blocksClassName)}>
          <Skeleton className="h-[15rem] w-full" />
          <Skeleton className="h-[2rem] w-[80%]" />
          <Skeleton className="h-[2rem] w-full" />
        </div>
      ))}
    </div>
  ) : (
    <AnimatePresence>
      <motion.div
        initial={{ x: 300, opacity: 0, transitionDuration: '0.1s' }}
        animate={{ x: 0, opacity: 1, transitionDuration: '0.1s' }}
        exit={{ x: -300, opacity: 0, transitionDuration: '0.1s' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default ContentLoader;
