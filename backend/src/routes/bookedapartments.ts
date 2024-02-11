import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
import { ApartmentType } from "../shared/types";
import Apartment from "../models/apartment";

const router = express.Router();

// /api/my-bookings
router.get("/", verifyToken, async (req: Request, res: Response) => {
    
  try {
        const apartment = await Apartment.find({
      bookings: { $elemMatch: { userId: req.userId } },
    });

    const results = apartment.map((apartment) => {
      const userBookings = apartment.bookings.filter(
        (booking) => booking.userId === req.userId
      );

      const ApartmentWithUserBookings: ApartmentType = {
        ...apartment.toObject(),
        bookings: userBookings,
      };

      return ApartmentWithUserBookings;
    });

    res.status(200).send(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to fetch bookings" });
  }
});

export default router;