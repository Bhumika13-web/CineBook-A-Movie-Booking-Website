import Movie from "../models/Movie.js";
import Show from "../models/Show.js";

// Get all movies that have shows, or just all movies
export const getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find({});
        res.json({ success: true, movies });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message || "An unknown error occurred" });
    }
};

// Get a single movie and its upcoming shows
export const getMovieById = async (req, res) => {
    try {
        const { id } = req.params;
        const movie = await Movie.findById(id);

        if (!movie) {
            return res.json({ success: false, message: "Movie not found" });
        }

        const shows = await Show.find({ movie: id, showDateTime: { $gte: new Date() } }).sort({ showDateTime: 1 });

        // Fetch 4 random recommended movies
        const recommendedMovies = await Movie.aggregate([
            { $match: { _id: { $ne: id } } },
            { $sample: { size: 4 } }
        ]);

        res.json({ success: true, movie, shows, recommendedMovies });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message || "An unknown error occurred" });
    }
};
