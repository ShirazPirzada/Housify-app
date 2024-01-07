export type UserType = {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  CNIC: string;
};

export type ApartmentType = {
  _id: string;
  userId: string;
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  tenantCount: number;
  facilities: string[];
  pricePerMonth: number;
  Rating: number;
  imageUrls: string[];
  lastUpdated: Date;
};
export type SearchReponse = {
  data: ApartmentType[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
};
