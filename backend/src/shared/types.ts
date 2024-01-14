export type UserType = {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  CNIC: string;
  userType: string;
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
  bookings: BookingType[];
};
export type SearchReponse = {
  data: ApartmentType[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
};

export type BookingType = {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  tenantCount: number;
  rentStartDate: Date;
  rentEndDate: Date;
  totalCost: number;
};

export type PaymentIntentResponse = {
  paymentIntentId:string;
  clientSecret:string;
  totalCost:number;
}
