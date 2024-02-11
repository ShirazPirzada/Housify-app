import express, { Request, Response } from "express";
import Apartment from "../models/apartment";
import { BookingType, SearchReponse } from "../shared/types";
import { param, validationResult } from "express-validator";
import Stripe from "stripe";
import verifyToken from "../middleware/auth";

const stripe  = new Stripe(process.env.STRIPE_API_KEY as string);
const router = express.Router();


router.get("/search", async (req: Request, res: Response) => {
  try {
    // console.log("Params: ",req.query);
    const query = constructSearchQuery(req.query);

    let sortOptions = {};
    switch (req.query.sortOption) {
      case "starRating":
        sortOptions = { starRating: -1 };
        break;
      case "pricePerMonthAsc":
        sortOptions = { pricePerMonth: 1 };
        break;
      case "pricePerMonthDesc":
        sortOptions = { pricePerMonth: -1 };
        break;
    }

    const pageSize = 5;
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );

    const skip = (pageNumber - 1) * pageSize;
    const apartments = await Apartment.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    const total = await Apartment.countDocuments(query);

    const response: SearchReponse = {
      data: apartments,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };
    res.json(response);
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});
router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Apartment ID is required")],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = req.params.id.toString();

    try {
      const apartment = await Apartment.findById(id);
      res.json(apartment);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error fetching Apartment" });
    }
  }
);

router.post("/:apartmentId/bookings/payment-intent",verifyToken,async(req:Request,res:Response)=>{
 
  const { numberOfMonths } = req.body;
  const apartmentId = req.params.apartmentId;

  const apartment = await Apartment.findById(apartmentId);
  if (!apartment) {
    return res.status(400).json({ message: "Apartment not found" });
  }

  const totalCost = (apartment.pricePerMonth * numberOfMonths) * .2;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalCost * 100,
    currency: "inr",
    metadata: {
      apartmentId: apartmentId,
      userId: req.userId,
    },
  });

  if (!paymentIntent.client_secret) {
    return res.status(500).json({ message: "Error creating payment intent" });
  }

  const response = {
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret.toString(),
    totalCost,
  };

  res.send(response);
});

router.post(
  "/:apartmentId/bookings",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
     
      const paymentIntentId = req.body.paymentIntentId;

      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId as string
      );

      if (!paymentIntent) {
        return res.status(400).json({ message: "payment intent not found" });
      }

      if (
        paymentIntent.metadata.apartmentId !== req.params.apartmentId ||
        paymentIntent.metadata.userId !== req.userId
      ) {
        return res.status(400).json({ message: "payment intent mismatch" });
      }

      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({
          message: `payment intent not succeeded. Status: ${paymentIntent.status}`,
        });
      }

      const newBooking: BookingType = {
        ...req.body,
        userId: req.userId,
      };
    
      const apartment = await Apartment.findOneAndUpdate(
        { _id: req.params.apartmentId },
        {
          $push: { bookings: newBooking },
        },
        { new: true } // This ensures you get the updated document in the response
      );
        console.log("Apartment Data: ",apartment);
      if (!apartment) {
        return res.status(400).json({ message: "apartment not found" });
      }

      await apartment.save();
      res.status(200).send();
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "something went wrong" });
    }
  }
);

const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};

  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { country: new RegExp(queryParams.destination, "i") },
    ];
  }

  if (queryParams.tenantCount) {
    constructedQuery.tenantCount = {
      $gte: parseInt(queryParams.tenantCount),
    };
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }

  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.Rating)
      ? queryParams.Rating.map((star: string) => parseInt(star))
      : parseInt(queryParams.stars);

    constructedQuery.Rating = { $in: starRatings };
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerMonth = {
      $lte: parseInt(queryParams.maxPrice).toString(),
    };
  }

  return constructedQuery;
};

export default router;
