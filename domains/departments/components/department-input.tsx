import React from 'react';

import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';

import { DepartmentInputProps } from '../type';

const DepartmentInput: React.FC<DepartmentInputProps> = ({
  departmentNameLabel,
  textValue,
  setTextValue,
  placeHolder,
}) => {
  return (
    <div className="border-1 mt-3 flex w-full items-center rounded-lg border border-gray-200 bg-white px-5 py-3">
      <div className="w-fit">
        <Text size={'xs'} className="w-full text-nowrap">
          {departmentNameLabel}
        </Text>
      </div>
      <Input
        value={textValue}
        placeholder={placeHolder}
        onChange={e => setTextValue(e.target.value)}
        className="ms-3 w-full border-0 border-none"
      />
    </div>
  );
};

export default DepartmentInput;
