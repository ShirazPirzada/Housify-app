import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Apartment, { ApartmentType } from "../models/apartment";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";
const router = express.Router();

const storage = multer.memoryStorage(); //As the images come , will be send to cloudinary
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

router.post(
  "/",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("city is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Apartment Type is required"),
    body("pricePerMonth")
      .notEmpty()
      .isNumeric()
      .withMessage("Price Per Month is required and must be a number"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities are  required"),
  ],
  upload.array("imageFiles", 6),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newApartment: ApartmentType = req.body;

      //Iteration images from post reques, encoding images as base 64
      //, creating string , then using cloudinary sdk to upload it ,
      //if all goes well url gets return.
      const uploadPromises = imageFiles.map(async (image) => {
        const base64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + base64;
        const res = await cloudinary.v2.uploader.upload(dataURI);
        return res.url;
      });

      const imageUrls = await Promise.all(uploadPromises);
      newApartment.imageUrls = imageUrls;
      newApartment.lastUpdated = new Date();
      newApartment.userId = req.userId;

      const apartment = new Apartment(newApartment);
      await apartment.save();

      res.status(201).send(apartment);
    } catch (error) {
      console.log("Error creating apartment: ", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

// router.post();

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const apartments = await Apartment.find({ userId: req.userId });
    res.json(apartments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching apartments" });
  }
});
export default router;
