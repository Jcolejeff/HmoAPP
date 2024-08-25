import React from 'react';

import Image from 'next/image';

import { url } from '@/lib/utils';

interface ImageStackProps {
  images: string[];
}

const ImageStack: React.FC<ImageStackProps> = ({ images }) => {
  return (
    <div className="flex items-center">
      {images.map((src, index) => (
        <Image
          key={index}
          src={url(src)}
          alt={`User ${index + 1}`}
          width={35}
          height={35}
          className={`rounded-full border-2 border-white ${index !== 0 ? '-ml-2' : ''} transition-transform duration-200 ease-in-out hover:scale-105`}
        />
      ))}
    </div>
  );
};

export default ImageStack;
