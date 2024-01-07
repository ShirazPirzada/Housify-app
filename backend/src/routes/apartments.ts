import express, { Request, Response } from "express";
import Apartment from "../models/apartment";
import { SearchReponse } from "../shared/types";

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
