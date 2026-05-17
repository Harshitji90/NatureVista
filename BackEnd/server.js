import dotenv from "dotenv";
dotenv.config({ path: "./BackEnd/.env" });

// dotenv.config({
//     path:"./.env"
// });
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import dns from "dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);
import connectDB from "./config/mongoDb.js";

//=====For Payment==========
import qrcode from "qrcode";
import razopay from "razorpay";
import crypto from "crypto";
import session from "express-session";

const app = express();
const port = process.env.PORT || 3000;
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//Connect Mongo
// mongoose.connect(process.env.MONGO_URL)
// .then(() => console.log("Database connected Successfully"))
// .catch(err => console.log(err));

app.use(express.json());
import module from "module";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("FrontEnd"));

console.log(path.join(__dirname, "FrontEnd"));

// Signup Route
// Signup Page Open
app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/FrontEnd/signup.html");
});
import User from "./model/User.js";
import Razorpay from "razorpay";
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.send("All fields required");
    }

    // Check Email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.send("Email already exists");
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save User
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    // res.send("Signup Successful");
    res.redirect("/test.html");
  } catch (err) {
    console.log(err);
    res.send(err.massage);
  }
});

//Login Route
app.post("/login", async (req, res) => {
  try {
    console.log(req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.send("User Not Found");
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.send("Wrong Password");
    }

    // console.log(process.env.JWT_SECRET);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.redirect("/test.html");
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
});

// Home Route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "FrontEnd", "test.html"));
});

// Download Route
// app.get("/download", (req, res) => {
//   const filePath = path.join(
//     __dirname,
//     "..",
//     "FrontEnd",
//     "image",
//     "pexels-lauripoldre-29863712.jpg",
//   );

//   console.log(filePath);

//   res.download(filePath);
// });

// =============Session middleware==========
app.use(
  session({
    secret: "payment-secret",
    resave: false,
    saveUninitialized: false,
  }),
);
//=============Razorpay instance:===========
const razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});
// ==========Order Create route ===========
app.get("/create-order", async(req,res)=>{

    try{

        const order =
        await razorpay.orders.create({

            amount:100,
            currency:"INR"

        });

        res.json(order);

    }

    catch(err){

            console.log("ORDER ERROR:", err);

        res.status(500).json(err);

    }

});
//==========Verify Payment============
app.post("/verify-payment", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    req.session.paid = true;
    return res.json({
      success: true,
    });
  }
  res.json({
    success: false,
  });
});
//=======Download==========
app.get("/download", (req, res) => {
  if (!req.session.paid) {
    return res.send("Please complete payment first");
  }

  const filePath = path.join(
    __dirname,
    "..",
    "FrontEnd",
    "image",
    "pexels-lauripoldre-29863712.jpg",
  );

  res.download(filePath);
});
//===================
app.post("/DeshB", (req, res) => {});

//server
app.listen(3000, () => {
  console.log("Server Running on Port 3000"); 
});
