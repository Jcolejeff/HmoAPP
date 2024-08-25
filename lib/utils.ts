import { isNotNil, startsWith } from 'ramda';

export const url = (url: string) => {
  //If the URL starts with "/" and ASSET_HOST environment variable exists
  //then prefix ASSET_HOST environment variable, else check if BASE_URL exists
  const result =
    startsWith('/', url) && isNotNil(process.env.NEXT_PUBLIC_ASSET_HOST)
      ? `${process.env.NEXT_PUBLIC_ASSET_HOST}${url}`
      : url;
  return result;
};
export const trunc = (str: string, limit: number) => {
  if (str.length > limit) {
    return str.slice(0, limit) + '...';
  }
  return str;
};

export const getFileUrl = (url: string, size = '800x800') => {
  return `${process.env.NEXT_PUBLIC_API_URL}/files${url}`;
};

/**
 * Formats a number to Nigerian Naira (₦) without kobo.
 *
 * @param amount - The amount to format.
 * @returns A string representing the formatted amount in Naira.
 */
export function formatToNaira(amount: number): string {
  if (isNaN(amount)) {
    throw new Error('Invalid number provided');
  }

  // Create a new NumberFormat object for Nigerian Naira without decimal places
  const formatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  // Format the amount
  return formatter.format(amount);
}
export const checkIfLocalStorageExists = () => {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem('store') || '{}');
  }
  return '{}';
};

/**
 * Calculate the number of days between two dates.
 * @param startDate - The start date in the format 'YYYY-MM-DD'.
 * @param endDate - The end date in the format 'YYYY-MM-DD'.
 * @returns The number of days between the start date and end date.
 */
export const calculateDaysBetweenDates = (startDate: string, endDate: string): number => {
  // Parse the start and end dates
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Ensure both dates are valid
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Invalid date format. Please use YYYY-MM-DD.');
  }

  // Calculate the difference in time
  const differenceInTime = end.getTime() - start.getTime();

  // Convert the time difference to days
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);

  return differenceInDays;
};

export const timeAgo = (dateCreated: string): string => {
  const createdDate = new Date(dateCreated);
  const currentDate = new Date();

  if (isNaN(createdDate.getTime())) {
    throw new Error('Invalid date format. Please use YYYY-MM-DDTHH:mm:ss.');
  }

  const seconds = Math.floor((currentDate.getTime() - createdDate.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return years === 1 ? '1 year ago' : `${years} years ago`;
  } else if (months > 0) {
    return months === 1 ? '1 month ago' : `${months} months ago`;
  } else if (days > 0) {
    return days === 1 ? '1 day ago' : `${days} days ago`;
  } else if (hours > 0) {
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  } else if (minutes > 0) {
    return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
  } else {
    return seconds === 1 ? '1 second ago' : `${seconds} seconds ago`;
  }
};

export function reverseArray<T>(arr: T[]): T[] {
  const reversedArr: T[] = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    reversedArr.push(arr[i]);
  }
  return reversedArr;
}
/**
 * Extracts the file extension from a URL or file path and returns it
 
 *
 * @param url - The URL or file path to extract the extension from.
 * @returns The file extension formatted
 */
export function getFileExtensionFromUrl(url: string): string {
  const extensionMatch = url.match(/\.[0-9a-z]+$/i);

  if (extensionMatch) {
    return `${extensionMatch[0].slice(1).toLowerCase()}`;
  }

  return 'File';
}
