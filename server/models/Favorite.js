import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
    {
        user: { type: String, required: true },
        movie: { type: String, ref: 'Movie', required: true }
    },
    { timestamps: true }
);

const Favorite = mongoose.model('Favorite', favoriteSchema);

export default Favorite;
