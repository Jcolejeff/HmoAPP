import { AlignJustify, LayoutGrid } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { GridToggleProps } from '@/domains/departments/type';

const GridToggle: React.FC<GridToggleProps> = ({ onListView, onGridView, state }) => {
  const [isGridView, setIsGridView] = useState(false);

  const handleListViewClick = () => {
    setIsGridView(false);
    onListView();
  };

  const handleGridViewClick = () => {
    setIsGridView(true);
    onGridView();
  };

  useEffect(() => {
    setIsGridView(state);
  }, []);

  return (
    <div className="flex">
      <button
        className={`rounded p-2 ${!isGridView ? 'bg-gray-300' : 'bg-transparent'} h-fit`}
        onClick={handleListViewClick}
      >
        <AlignJustify size={16} />
      </button>
      <button
        className={`rounded p-2 ${isGridView ? 'bg-gray-300' : 'bg-transparent'} h-fit`}
        onClick={handleGridViewClick}
      >
        <LayoutGrid size={16} />
      </button>
    </div>
  );
};

export default GridToggle;
