
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
  