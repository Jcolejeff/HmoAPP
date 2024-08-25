/* eslint-disable @next/next/no-img-element */
import { url } from '@/lib/utils';
import { cn } from '@/lib/utils/css';

interface IEmptyContentWrapper {
  className?: string;
  isEmpty?: boolean;
  children?: React.ReactNode;
  customMessage?: string;
  customButton?: React.ReactNode;
}

const EmptyContentWrapper = ({ className, customMessage, isEmpty, children, customButton }: IEmptyContentWrapper) => {
  return isEmpty ? (
    <div className={cn('flex h-full w-full flex-grow  flex-col items-center justify-center gap-4 ', className)}>
      <img src={'/svg/dashboard/empty-icon.svg'} alt="" />
      <p className=" text-[0.9rem] capitalize leading-[20px] tracking-[0.15px] ">
        {customMessage ? customMessage : `This is currently unavailable, pls check back`}
      </p>
      {customButton && customButton}
    </div>
  ) : (
    <>{children}</>
  );
};

export default EmptyContentWrapper;
