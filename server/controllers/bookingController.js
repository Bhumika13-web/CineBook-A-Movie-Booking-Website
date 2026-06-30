import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import { getAuth } from "@clerk/express";

export const createRazorpayOrder = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { amount } = req.body;

        const razorpay = new Razorpay({
            key_id: process.env.RAZOR_API_KEY || process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
            key_secret: process.env.RAZOR_SECRET_KEY || process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder'
        });

        const options = {
            amount: amount * 100, // amount in smallest currency unit (paise)
            currency: "INR",
            receipt: `receipt_order_${new Date().getTime()}`
        };

        const order = await razorpay.orders.create(options);

        res.json({ 
            success: true, 
            order, 
            key_id: process.env.RAZOR_API_KEY || process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder' 
        });
    } catch (error) {
        console.error("Razorpay Error:", error);
        const errorMsg = error.error?.description || error.message || "Error creating Razorpay order";
        res.json({ success: false, message: errorMsg });
    }
};

export const verifyRazorpayPayment = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingDetails } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto.createHmac("sha256", process.env.RAZOR_SECRET_KEY || process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // Payment is verified, create booking
            const { movieId, showId, seats, totalAmount } = bookingDetails;
            
            const show = await Show.findById(showId);
            if (!show) return res.json({ success: false, message: "Show not found" });

            const occupiedSeats = show.occupiedSeats || {};
            for (const seat of seats) {
                if (occupiedSeats[seat]) return res.json({ success: false, message: `Seat ${seat} is already booked.` });
            }

            const booking = await Booking.create({
                user: userId,
                movie: movieId,
                show: showId,
                seats,
                totalAmount,
                paymentId: razorpay_payment_id,
                isPaid: true
            });

            const updatedOccupiedSeats = { ...occupiedSeats };
            for (const seat of seats) {
                updatedOccupiedSeats[seat] = userId;
            }
            await Show.findByIdAndUpdate(showId, { occupiedSeats: updatedOccupiedSeats });

            res.json({ success: true, message: "Payment verified successfully", booking });
        } else {
            res.json({ success: false, message: "Invalid signature" });
        }
    } catch (error) {
        console.error("Razorpay Verification Error:", error);
        const errorMsg = error.error?.description || error.message || "An error occurred during verification.";
        res.json({ success: false, message: errorMsg });
    }
};

export const createBooking = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { movieId, showId, seats, totalAmount } = req.body;

        // Fetch the show
        const show = await Show.findById(showId);
        if (!show) {
            return res.json({ success: false, message: "Show not found" });
        }

        // Verify seats aren't already occupied
        const occupiedSeats = show.occupiedSeats || {};
        for (const seat of seats) {
            if (occupiedSeats[seat]) {
                return res.json({ success: false, message: `Seat ${seat} is already booked.` });
            }
        }

        // Create booking (simulate successful payment)
        const booking = await Booking.create({
            user: userId,
            movie: movieId,
            show: showId,
            seats,
            totalAmount
        });

        // Update occupied seats
        const updatedOccupiedSeats = { ...occupiedSeats };
        for (const seat of seats) {
            updatedOccupiedSeats[seat] = userId;
        }

        await Show.findByIdAndUpdate(showId, { occupiedSeats: updatedOccupiedSeats });

        res.json({ success: true, message: "Booking created successfully", booking });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message || "An error occurred during booking." });
    }
};

export const getMyBookings = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const bookings = await Booking.find({ user: userId })
            .populate('movie')
            .populate('show')
            .sort({ createdAt: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message || "Error fetching bookings." });
    }
};

export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({})
            .populate('movie')
            .populate('show')
            .sort({ createdAt: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message || "Error fetching all bookings." });
    }
};
