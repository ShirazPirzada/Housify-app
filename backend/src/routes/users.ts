import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/auth";
import Model_CNIC from "../models/nadra-cnic-check";
import { UserType } from "../shared/types";
import bcrypt from "bcryptjs";
const { check, validationResult } = require("express-validator");
const router = express.Router();
var nodemailer = require('nodemailer');

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
    //Get user Details
    try {
      let user = await User.findOne({
        email: req.body.email,
      });
      let checkCnic = await Model_CNIC.findOne({
        National_Identity_CardNumber: req.body.CNIC,
      });
// Check User's Cnic if not found. User is not legitimate.
      if (!checkCnic) {
        return res.status(400).json({
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

router.post("/forgot-password", async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res.status(404).json({ message: "User does not exist!" });
    }

    const secret = process.env.JWT_SECRET_KEY + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "5m",
    });
    const link = `${process.env.FRONTEND_URL}/reset-password/${oldUser._id}/${token}`;
    //EMAIL SEND
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'shirazxpirzada@gmail.com',
        pass: 'eorb xjpf zjzw rgst'
      }
    });
    
    var mailOptions = {
      from: 'shirazxpirzada@gmail.com',
      to: oldUser.email,
      subject: 'Password Reset Link',
      text: 'Please click the following link to reset your password  '+link+''
    };
    
    transporter.sendMail(mailOptions, function(error: any, info: { response: string; }){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    return res.status(200).json({message:"Email Sent!"});
  } catch (error) {
    return res.status(500).json({message:"Something went wrong"})
  }
});

router.get("/reset-password/:userId/:token",async(req:Request,res:Response)=>{
  const userId=  req.params.userId;
  const token=  req.params.token;
  if(typeof userId === "undefined" && typeof token ==="undefined"){
    return res.status(500).json({ message: "Something went wrong!" });
  }
  const oldUser = await User.findOne({ _id:userId });
    if (!oldUser) {
      return res.json({ message: "User does not exist!" });
    }

    const secret = process.env.JWT_SECRET_KEY + oldUser.password;
    try {
      
       const verify = jwt.verify(token,secret);
      
       return res.status(200).json({message:"Token Valid"});
    } catch (error) {
      console.log("Error of token: ",error);
      return res.status(500).json({ message: "Token Invalid or Expired" });
    }
    
})

router.post("/reset-password/:userId/:token",async(req:Request,res:Response)=>{
  const userId=  req.params.userId;
  const token=  req.params.token;
  const {password} = req.body;
  if(typeof userId === "undefined" && typeof token ==="undefined"){
    return res.status(500).json({ message: "Something went wrong!" });
  }
  const oldUser = await User.findOne({ _id:userId });
    if (!oldUser) {
      return res.json({ message: "User does not exist!" });
    }

    const secret = process.env.JWT_SECRET_KEY + oldUser.password;
    try {
      jwt.verify(token,secret);
      const encryptedPassword = await bcrypt.hash(password, 8);
      const user = await User.findOneAndUpdate(
        {
          _id: userId,
        },
        {
          $set:{
            password:encryptedPassword
          },
        },
        { new: true }
        // password ? req.body : updatedUserWithoutPassword, // Update accordingly
        // { new: true }
      );
      res.json({message:"Password Resetted Successfully"});
    } catch (error) {
      res.json({message:"Token Invalid"});
    }

})


export default router;
