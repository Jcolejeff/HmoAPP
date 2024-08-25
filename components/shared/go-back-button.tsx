import { ChevronLeft } from 'lucide-react';
import React from 'react';

import { Button } from '../ui/button';

const GoBackButton = () => {
  return (
    <Button
      onClick={() => history.back()}
      variant={'outline'}
      className="flex items-center rounded bg-transparent hover:bg-gray-100"
    >
      <ChevronLeft color="gray" className="h-4 w-4" />
      <span className="text-xs text-gray-700">Back</span>
    </Button>
  );
};

export default GoBackButton;
