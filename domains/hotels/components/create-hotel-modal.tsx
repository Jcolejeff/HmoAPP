'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { useHotelContext } from '../context/hotel-context';

import CreateHotelForm from './create-hotel-form';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode | string;
}

const CreateHotelModal: React.FC<ModalProps> = ({ isOpen, onClose, title }) => {
  const { open, onOpenChange } = useHotelContext();

  return (
    <Dialog open={open} onOpenChange={() => onOpenChange(!open)} modal={false}>
      <DialogContent className="min-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {/* <div
          className={`relative m-auto flex w-full max-w-[90%] flex-col rounded-lg px-8 pt-4 md:max-w-[500px] lg:max-w-[700px]`}
        >
          <section className="flex flex-col">
            <section className="flex h-full w-full max-w-[1700px] flex-col items-center gap-8 overflow-scroll">
              <div className="h-full w-full">Modal</div>
            </section>
          </section>
        </div> */}
        <CreateHotelForm />
      </DialogContent>
    </Dialog>
  );
};

export default CreateHotelModal;
