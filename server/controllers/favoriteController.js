import Favorite from "../models/Favorite.js";
import { getAuth } from "@clerk/express";

export const toggleFavorite = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { movieId } = req.body;
        if (!movieId) {
            return res.status(400).json({ success: false, message: "Movie ID is required" });
        }

        const existingFavorite = await Favorite.findOne({ user: userId, movie: movieId });

        if (existingFavorite) {
            await Favorite.findByIdAndDelete(existingFavorite._id);
            res.json({ success: true, message: "Removed from favorites", isFavorite: false });
        } else {
            await Favorite.create({ user: userId, movie: movieId });
            res.json({ success: true, message: "Added to favorites", isFavorite: true });
        }
    } catch (error) {
        console.error("Toggle Favorite Error:", error);
        res.json({ success: false, message: error.message || "An error occurred." });
    }
};

export const getUserFavorites = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const favorites = await Favorite.find({ user: userId }).populate("movie").sort({ createdAt: -1 });
        const movies = favorites.map(f => f.movie).filter(Boolean);

        res.json({ success: true, movies });
    } catch (error) {
        console.error("Get Favorites Error:", error);
        res.json({ success: false, message: error.message || "An error occurred." });
    }
};
