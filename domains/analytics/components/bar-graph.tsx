import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

import { formatToNaira } from '@/lib/utils';

interface BarGraphProps {
  data: Record<string, number>[];
}

const BarGraph: React.FC<BarGraphProps> = ({ data }) => {
  const formattedData = data.map(department => {
    const [key, value] = Object.entries(department)[0];
    return {
      name: key,
      value: value !== null ? value : 0,
    };
  });

  return (
    <BarChart width={500} height={300} data={formattedData}>
      <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} textAnchor="end" />
      <YAxis tick={{ fontSize: 10 }} tickFormatter={formatToNaira} />
      <Tooltip formatter={(value: number) => [formatToNaira(value), 'Amount']} />
      <Bar dataKey="value" fill="#0F172A" />
    </BarChart>
  );
};

export default BarGraph;
