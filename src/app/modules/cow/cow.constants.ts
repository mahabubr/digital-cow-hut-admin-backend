type TType = string[];

export const location: TType = [
  'Dhaka',
  'Chattogram',
  'Barishal',
  'Rajshahi',
  'Sylhet',
  'Comilla',
  'Rangpur',
  'Mymensingh',
];

export const breed: TType = [
  'Brahman',
  'Nellore',
  'Sahiwal',
  'Gir',
  'Indigenous',
  'Tharparkar',
  'Kankrej',
];

export const label: TType = ['for sale', 'sold out'];

export const category: TType = ['Dairy', 'Beef', 'Dual Purpose'];

export const cowFilterableFields = [
  'searchTerm',
  'minPrice',
  'maxPrice',
  'location',
];
export const CowSearchableFields = ['location', 'breed', 'category'];
