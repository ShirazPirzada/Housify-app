import mongoose from "mongoose";

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

const apartmentSchema = new mongoose.Schema<ApartmentType>({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  tenantCount: { type: Number, required: true },
  facilities: [{ type: String, required: true }],
  pricePerMonth: { type: Number, required: true },
  Rating: { type: Number, required: true, min: 1, max: 5 },
  imageUrls: [{ type: String, required: true }],
  lastUpdated: { type: Date, required: true },
});

const Apartment = mongoose.model<ApartmentType>("Apartment",apartmentSchema);
export default Apartment;
