import { formatToNaira } from '@/lib/utils';

export const formatData = (data: any[]) => {
  return data.map(item => ({
    ...item,
    total_requests: item.total_requests ? item.total_requests.toLocaleString() : 0,
    total_spend: `${formatToNaira(item?.total_spend ?? 0)}` ?? 0,
    travel_count: item.travel_count ? item.travel_count.toLocaleString() : 0,
  }));
};
