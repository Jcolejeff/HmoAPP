/* eslint-disable @next/next/no-img-element */
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { Home, PlusCircleIcon, TrashIcon, Upload, UploadCloudIcon, X } from 'lucide-react';
import React from 'react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Input } from '@/components/ui/input';

import processError from '@/lib/error';
import { trunc } from '@/lib/utils';

import { useUploadImage } from '@/domains/files/hooks/use-upload-images';

import { Button } from '../../ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogDescription, DialogTitle } from '../../ui/dialog';

interface ImageUploadProps {
  title: string;
  refetch: () => void;
  entity: string;
  entityId: number;
}

const ImageUpload = ({ title, entity, entityId, refetch }: ImageUploadProps) => {
  const [open, setOpen] = React.useState(false);
  const [firstImage, setFirstImage] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [index, setIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isPending, mutate } = useUploadImage();

  const handleDrag = function (e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    console.log(e.type);
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = function (e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const imagesObj: FileList = e.dataTransfer.files;

    const imageFiles = Array.from(imagesObj).filter(file => file.type.startsWith('image/'));

    setFirstImage(URL.createObjectURL(imageFiles[0]));
    setSelectedImages(prevState => [...imageFiles, ...prevState] as never[]);
    setIndex(0);
  };

  const processImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e.target.files)

    const imagesObj = e.target.files;

    if (!imagesObj) {
      return;
    }

    if (imagesObj.length > 0) {
      setFirstImage(URL.createObjectURL(imagesObj[0]));
    }

    Object.values(imagesObj).map(image => {
      setSelectedImages(prevState => [image, ...prevState] as never[]);
    });
    setIndex(0);
  };

  const deleteImg = (index: number) => {
    const tempArray = [...selectedImages?.slice(0, index), ...selectedImages?.slice(index + 1)];
    setSelectedImages(tempArray);
  };

  const uploadImage = async (images: File[]) => {
    setIsSubmitting(true);
    let formData = new FormData();
    let imageUrls = [];

    for (let i = 0; i < images?.length; i++) {
      formData.append('files', images[i], images[i].name);
      imageUrls.push(URL.createObjectURL(images[i]));
    }
    formData.append('entity', entity);
    formData.append('entity_id', entityId.toString());

    try {
      await mutate(formData);
      toast.success(`Images uploaded successfully`);

      refetch();
      setOpen(false);
    } catch (error) {
      processError(error as AxiosError);
    }
    setIsSubmitting(false);
    return;
  };

  useEffect(() => {
    setFirstImage('');
    setSelectedImages([]);
  }, [open]);
  return (
    <section>
      <Button onClick={() => setOpen(true)} className=" hover:bg-accent-hover bg-white text-text-dim">
        Upload Image
        <UploadCloudIcon className="h-4 w-4" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen} modal={true}>
        <DialogContent className="w-full min-w-[450px] max-w-[600px] p-4">
          <section className="flex flex-col gap-3">
            <div className="flex flex-row justify-between">
              <DialogHeader>Upload {title} Images</DialogHeader>
              <DialogClose className=" hover:bg-gray/10 data-[state=open]:bg-accent data-[state=open]:text-muted-foreground right-4 top-4 w-fit border-none p-1 opacity-70 ring-offset-transparent transition-opacity hover:opacity-100 focus:shadow-none focus:outline-none focus:ring focus:ring-[#777979]/20 focus-visible:ring-1 focus-visible:ring-[#777979]/20 disabled:pointer-events-none">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </div>
          </section>
          <section className="flex h-full flex-col gap-3  py-32">
            <section
              id="image-file-upload"
              className="relative"
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="mb-4 flex w-full flex-col items-center justify-center  ">
                {dragActive && (
                  <div className=" my-4 flex items-center justify-center bg-white" onDragLeave={handleDrag}>
                    <div className="drop">Drag and drop your images here.</div>
                  </div>
                )}
                {selectedImages.length ? (
                  <div className="flex w-full flex-col items-center justify-center ">
                    <div className="">
                      <img
                        src={URL.createObjectURL(selectedImages[index])}
                        alt="img-preview"
                        className=" h-[15rem] w-[16rem] object-cover"
                      />
                    </div>
                    <div className="flex justify-center">
                      <small className=" mt-4">{trunc((selectedImages[index] as File)?.name, 50)}</small>
                    </div>
                  </div>
                ) : null}
              </div>

              <label
                className={` ${!firstImage.length ? 'mb-5' : 'mb-3'} flex w-full items-center justify-center rounded px-3 py-1`}
                role="button"
                htmlFor="imageTag"
              >
                <UploadCloudIcon />
                <span className=" ms-2">
                  Drop a file to add, or{' '}
                  <span className="text-primary" style={{ fontWeight: 600 }}>
                    Choose File
                  </span>
                </span>
              </label>
              <Input
                type="file"
                onChange={e => processImages(e)}
                accept="image/*"
                multiple
                id="imageTag"
                className="invisible mb-2"
              />
              {selectedImages.length ? (
                <div className="mb-4 flex flex-wrap">
                  {selectedImages?.map((imgs: File, i: number) => {
                    return (
                      <div key={i} className="mx-2 mb-2 flex flex-col justify-start">
                        <div className="relative w-24">
                          <img
                            src={URL.createObjectURL(imgs)}
                            onClick={() => setIndex(i)}
                            width={70}
                            height={70}
                            className="w-24 rounded"
                            alt="product-img-preview"
                            role="button"
                          />
                          <span
                            className="absolute right-[-19%] top-[-10%] pe-1"
                            onClick={() => deleteImg(i)}
                            role="button"
                          >
                            <TrashIcon className="text-red-600" />
                          </span>
                        </div>
                        <div>
                          <span className="color-2024 small ms-1">{trunc(imgs?.name, 6)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div></div>
              )}
            </section>

            <Button
              onClick={() => uploadImage(selectedImages)}
              className="mx-auto w-1/5  text-base text-white"
              // disabled={isPending || selectedImages.length < 1}
            >
              Upload
            </Button>
          </section>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ImageUpload;
