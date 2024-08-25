import React, { useState, useCallback } from 'react';

import { Input } from '../ui/input';

interface IProps {
  items: any[];
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
  placeholder: string;
}
const ListInput = ({ items, setItems, placeholder }: IProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // e.preventDefault();
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      setItems(prevItems => [...prevItems, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleRemove = useCallback(
    (index: number) => {
      setItems(prevItems => prevItems.filter((_, i) => i !== index));
    },
    [setItems],
  );
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setInputValue(e.target.value);
  };

  return (
    <div className=" my-2 mt-4 flex  items-center gap-4  ">
      <Input
        name="hobby"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        placeholder={placeholder}
        className="  mx-2 w-full rounded-md border px-2 text-[0.8rem] shadow-none placeholder:text-[0.8rem]  focus-within:ring-0  focus:ring-0  focus-visible:ring-0 "
      />
    </div>
  );
};

export default ListInput;
