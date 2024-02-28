import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import { ApartmentType } from "../shared/types";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";
import Apartment from "../models/apartment";
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
      const imageUrls = await uploadImages(imageFiles);
      newApartment.imageUrls = imageUrls;
      newApartment.lastUpdated = new Date();
      newApartment.userId = req.userId;
      newApartment.isActive=false;
      newApartment.isRejected=false;
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

router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  try {
    const apartment = await Apartment.findOne({
      _id: id,
      userId: req.userId,
    });
    res.json(apartment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching apartments" });
  }
});

router.put(
  "/:apartmentId",
  verifyToken,
  upload.array("imageFiles"),
  async (req: Request, res: Response) => {
    try {
      const updatedApartment: ApartmentType = req.body;
      updatedApartment.lastUpdated = new Date();

      const apartment = await Apartment.findOneAndUpdate(
        {
          _id: req.params.apartmentId,
          userId: req.userId,
        },
        updatedApartment,
        { new: true }
      );

      if (!apartment) {
        return res.status(404).json({ message: "Apartment not found" });
      }
      const files = req.files as Express.Multer.File[];
      const updatedImgUrls = await uploadImages(files);
      apartment.imageUrls = [
        ...updatedImgUrls,
        ...(updatedApartment.imageUrls || []),
      ];
      await apartment.save();
      res.status(201).json(apartment);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    const base64 = Buffer.from(image.buffer).toString("base64");
    let dataURI = "data:" + image.mimetype + ";base64," + base64;
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
  });

  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}

export default router;
