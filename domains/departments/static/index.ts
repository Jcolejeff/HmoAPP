import { ChipProps } from '@/types';

export const departmentsData = [
  {
    department: 'Finance Department',
    admin: 'Christian Jimenez, John Friday',
    openRequests: 52,
    coworkers: [
      '/path/to/image1.jpg',
      '/path/to/image2.jpg',
      '/path/to/image3.jpg',
      '/path/to/image27.jpg',
      '/path/to/image27.jpg',
      '/path/to/image27.jpg',
      '/path/to/image27.jpg',
      '/path/to/image27.jpg',
      '/path/to/image27.jpg',
    ],
  },
  {
    department: 'Human Resource Department',
    admin: 'Emily Clark, Robert Brown',
    openRequests: 34,
    coworkers: ['/path/to/image4.jpg', '/path/to/image5.jpg', '/path/to/image6.jpg'],
  },
  {
    department: 'Design Department',
    admin: 'Alice Johnson, Michael Smith',
    openRequests: 23,
    coworkers: [
      '/path/to/image7.jpg',
      '/path/to/image8.jpg',
      '/path/to/image9.jpg',
      '/path/to/image27.jpg',
      '/path/to/image27.jpg',
      '/path/to/image27.jpg',
    ],
  },
  {
    department: 'Product Department',
    admin: 'Laura Wilson, James Taylor',
    openRequests: 45,
    coworkers: ['/path/to/image10.jpg', '/path/to/image11.jpg', '/path/to/image12.jpg'],
  },
  {
    department: 'Marketing Department',
    admin: 'Sophia Martinez, David Lopez',
    openRequests: 38,
    coworkers: ['/path/to/image13.jpg', '/path/to/image14.jpg', '/path/to/image15.jpg'],
  },
  {
    department: 'Sales Department',
    admin: 'Olivia Lee, William Harris',
    openRequests: 27,
    coworkers: ['/path/to/image16.jpg', '/path/to/image17.jpg', '/path/to/image18.jpg'],
  },
  {
    department: 'IT Department',
    admin: 'Isabella Walker, Thomas Young',
    openRequests: 19,
    coworkers: ['/path/to/image19.jpg', '/path/to/image20.jpg', '/path/to/image21.jpg'],
  },
  {
    department: 'Operations Department',
    admin: 'Charlotte King, Christopher Allen',
    openRequests: 56,
    coworkers: ['/path/to/image22.jpg', '/path/to/image23.jpg', '/path/to/image24.jpg'],
  },
  {
    department: 'Customer Service Department',
    admin: 'Amelia Scott, Andrew Hall',
    openRequests: 31,
    coworkers: [
      '/path/to/image25.jpg',
      '/path/to/image26.jpg',
      '/path/to/image27.jpg',
      '/path/to/image27.jpg',
      '/path/to/image27.jpg',
      '/path/to/image27.jpg',
      '/path/to/image27.jpg',
      '/path/to/image27.jpg',
    ],
  },
  {
    department: 'Legal Department',
    admin: 'Mia Wright, Joshua Adams',
    openRequests: 22,
    coworkers: ['/path/to/image28.jpg', '/path/to/image29.jpg', '/path/to/image30.jpg', '/path/to/image27.jpg'],
  },
];

export const images = [
  '/images/dashboard/Ellipse 9.png',
  '/images/dashboard/Ellipse 10.png',
  '/images/dashboard/Ellipse 11.png',
];

export const chipItems: ChipProps[] = [
  { type: 'user', label: 'Mary Jane', imageUrl: '/images/dashboard/Ellipse 9.png' },
  { type: 'email', label: 'janie@gmail.com' },
];

export const coworkersData = [
  {
    name: 'Jordan Stevenson',
    email: 'jordan@example.com',
    dateAdded: '29 Oct 2019',
    image: '/images/dashboard/Ellipse 11.png',
    permissions: 'Department Owner',
  },
  {
    name: 'Richard Pyle',
    email: 'richard@example.com',
    dateAdded: '15 Oct 2019',
    image: '/images/dashboard/Ellipse 11.png',
    permissions: 'Admin (Approval Manager)',
  },
  {
    name: 'Jennifer Summers',
    email: 'jennifer@example.com',
    dateAdded: '01 Feb 2020',
    image: '/images/dashboard/Ellipse 11.png',
    permissions: 'Admin (Approval Manager)',
  },
  {
    name: 'Mr. Justin Richardson',
    email: 'justin@example.com',
    dateAdded: '31 Dec 2019',
    image: '/images/dashboard/Ellipse 11.png',
    permissions: 'Coworker',
  },
  {
    name: 'Nichole Traynor',
    email: 'nichole@example.com',
    dateAdded: '18 Sep 2019',
    image: '/images/dashboard/Ellipse 11.png',
    permissions: 'Coworker',
  },
  {
    name: 'Crystal Mayle',
    email: 'crystal@example.com',
    dateAdded: '30 Nov 2019',
    image: '/images/dashboard/Ellipse 11.png',
    permissions: 'Coworker',
  },
  {
    name: 'Larry Gracia',
    email: 'larry@example.com',
    dateAdded: '15 Apr 2020',
    image: '/images/dashboard/Ellipse 11.png',
    permissions: 'Coworker',
  },
  {
    name: 'Megan Roberts',
    email: 'megan@example.com',
    dateAdded: '15 Apr 2019',
    image: '/images/dashboard/Ellipse 11.png',
    permissions: 'Coworker',
  },
];
