import { X } from 'lucide-react';
import React from 'react';

import Image from 'next/image';

import { url } from '@/lib/utils';

import { Button } from '../../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog';

interface ImagePreviewModalProps {
  imageUrl: string;
  trigger: React.ReactNode;
}

const ImagePreviewModal = ({ imageUrl, trigger }: ImagePreviewModalProps) => {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen} modal={false}>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent className="min-w-[750px] p-4">
        <section className="flex flex-col gap-3">
          <div className="flex flex-row justify-between">
            <DialogHeader>Full Image</DialogHeader>
            <DialogClose className=" hover:bg-gray/10 data-[state=open]:bg-accent data-[state=open]:text-muted-foreground right-4 top-4 w-fit border-none p-1 opacity-70 ring-offset-transparent transition-opacity hover:opacity-100 focus:shadow-none focus:outline-none focus:ring focus:ring-[#777979]/20 focus-visible:ring-1 focus-visible:ring-[#777979]/20 disabled:pointer-events-none">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>
        </section>
        <section className="h-full w-full">
          <Image src={url(imageUrl)} alt="asset" className="h-full w-full object-cover" width={200} height={200} />
        </section>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewModal;
