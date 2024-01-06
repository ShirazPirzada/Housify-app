import express, { Request, Response } from "express";
import Apartment from "../models/apartment";
import { SearchReponse } from "../shared/types";

const router = express.Router();

router.get("/search", async (req: Request, res: Response) => {
  try {
    const pageSize = 5;
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );

    const skip = (pageNumber - 1) * pageSize;
    const apartments = await Apartment.find().skip(skip).limit(pageSize);

    const total = await Apartment.countDocuments();

    const response:SearchReponse = {
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
export default router;