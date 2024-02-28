import mongoose from "mongoose";
import { ApartmentType, BookingType } from "../shared/types";

const bookingSchema = new mongoose.Schema<BookingType>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  tenantCount: { type: Number, required: true },
  rentStartDate: { type: Date, required: true },
  rentEndDate: { type: Date, required: true },
  userId: { type: String, required: true },
  totalCost: { type: Number, required: true },
})

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
  isActive: {type:Boolean},
  bookings: [bookingSchema]
});

const Apartment = mongoose.model<ApartmentType>("Apartment",apartmentSchema);
export default Apartment;
