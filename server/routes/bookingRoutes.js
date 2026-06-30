import express from "express";
import { requireAuth } from "@clerk/express";
import { createBooking, getMyBookings, getAllBookings, createRazorpayOrder, verifyRazorpayPayment } from "../controllers/bookingController.js";
import adminAuth from "../middleware/adminAuth.js";

const bookingRouter = express.Router();

bookingRouter.post("/book", requireAuth(), createBooking);
bookingRouter.post("/create-razorpay-order", requireAuth(), createRazorpayOrder);
bookingRouter.post("/verify-razorpay-payment", requireAuth(), verifyRazorpayPayment);
bookingRouter.get("/my-bookings", requireAuth(), getMyBookings);
bookingRouter.get("/all", adminAuth, getAllBookings);

export default bookingRouter;
