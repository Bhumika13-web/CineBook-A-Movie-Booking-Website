import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        user: { type: String, required: true, ref: 'User' },
        movie: { type: String, required: true, ref: 'Movie' },
        show: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Show' },
        seats: { type: [String], required: true },
        totalAmount: { type: Number, required: true },
        status: { type: String, enum: ['Booked', 'Cancelled'], default: 'Booked' },
        paymentId: { type: String },
        isPaid: { type: Boolean, default: false }
    },
    { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
