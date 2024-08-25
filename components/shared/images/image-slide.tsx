import { Link } from 'lucide-react';
import * as React from 'react';
import { useDropzone } from 'react-dropzone';

import Image from 'next/image';

import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';

import { getFileUrl } from '@/lib/utils';

import { FileObject } from '@/types';

import EmptyContentWrapper from '../empty-content-wrapper';

import ImagePreviewModal from './image-preview';
import ImageUpload from './image-upload';

interface ImageSlideProps {
  images: FileObject[];
  refetch: () => void;
  entity: string;
  entityId: number;
}
export const ImageSlide = ({ images, refetch, entity, entityId }: ImageSlideProps) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(images.length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div>
      <EmptyContentWrapper
        isEmpty={!images.length || images.length < 1}
        customMessage="No images uploaded"
        customButton={<ImageUpload title="Assets" entity={entity} entityId={entityId} refetch={refetch} />}
      >
        <>
          <Carousel setApi={setApi} className=" ">
            <CarouselContent>
              {images.map((img, index) => (
                <CarouselItem key={index} className="basis-1/2">
                  <Card className=" shadow-none">
                    <CardContent className="flex items-center   justify-center p-0 ">
                      <ImagePreviewModal
                        imageUrl={getFileUrl(img.url, '1200x1200')}
                        trigger={
                          <Image
                            src={getFileUrl(img.url)}
                            alt={img.description}
                            className="h-full w-full object-cover"
                            width={200}
                            height={200}
                          />
                        }
                      />
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="text-muted-foreground mx-auto flex w-fit items-center gap-6 py-2 text-sm">
              <CarouselPrevious />
              <p>
                {' '}
                Image {current} of {count}
              </p>
              <CarouselNext />
            </div>
          </Carousel>
          <div className="flex justify-end">
            <ImageUpload title={entity} entity={entity} entityId={entityId} refetch={refetch} />
          </div>
        </>
      </EmptyContentWrapper>
    </div>
  );
};
