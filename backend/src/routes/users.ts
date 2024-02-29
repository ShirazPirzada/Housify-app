import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";
import Model_CNIC from "../models/nadra-cnic-check";
import { UserType } from "../shared/types";
import bcrypt from "bcryptjs";
const { check, validationResult } = require("express-validator");
const router = express.Router();

router.get("/me", verifyToken, async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.log("Backend user Error Fetch: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  try {
    const userData = await User.findOne({
      _id: id,
    });
    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching User" });
  }
});

router.post(
  "/register",
  [
    check("firstName", "First Name is required").isString(),
    check("lastName", "LastName is required").isString(),
    check("email", "Email is required").isEmail(),
    check("CNIC", "CNIC is required").isString(),
    check("userType", "User type is required").notEmpty().isString(),
    check("userReligion", "Religion is required").notEmpty().isString(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    // Check User's Cnic if not found. User is not legitimate.
    try {
      let user = await User.findOne({
        email: req.body.email,
      });
      let checkCnic = await Model_CNIC.findOne({
        National_Identity_CardNumber: req.body.CNIC,
      });

      if (!checkCnic) {
        return res
          .status(400)
          .json({
            message:
              "Cnic does not exists in Nadra! Please get yourself registered at nadra!",
          });
      }

      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }
      user = new User(req.body);
      await user.save();

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });
      return res.status(200).send({ message: "User registered OK" });
    } catch (error) {
      res.status(500).send({ message: "Something went wrong" });
    }
  }
);

//update profile route
router.put("/:userId", async (req: Request, res: Response) => {
  try {
    // Check if password is provided
  
    const { password, ...updatedUserWithoutPassword } = req.body;
    
    // If password is provided, hash it
    if (password) {
      req.body.password = await bcrypt.hash(password, 8);
    }
    const updatedUser: UserType = req.body;
    const user = await User.findOneAndUpdate(
      {
        _id: req.params.userId,
      },
      password ? req.body : updatedUserWithoutPassword, // Update accordingly
      { new: true }
    );
   
    if (!user) {
      return res
        .status(404)
        .json({ message: "User Profile could not be updated" });
    }
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
