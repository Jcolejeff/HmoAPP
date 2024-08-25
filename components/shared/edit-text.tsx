import { Edit } from 'lucide-react';
import React, { useEffect } from 'react';

import { cn } from '@/lib/utils/css';

import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface EditTextProps {
  onBlur: () => void;
  className?: string;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
}

const EditableText = ({ inputValue, setInputValue, onBlur, className }: EditTextProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);
  return (
    <Input
      ref={inputRef}
      value={inputValue}
      onChange={e => setInputValue(e.target.value)}
      onBlur={onBlur}
      className={cn(
        'border-none p-0 text-base font-semibold shadow-none focus-visible:border-none focus-visible:ring-0',
        className,
      )}
    />
  );
};

export default EditableText;
