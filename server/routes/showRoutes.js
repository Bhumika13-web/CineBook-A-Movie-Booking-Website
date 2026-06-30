import express from "express";
import { addShow, getNowPlayingMovies, getAllShows } from "../controllers/showController.js";
import adminAuth from "../middleware/adminAuth.js";

const showRouter = express.Router();

showRouter.get('/now-playing', getNowPlayingMovies);
showRouter.get('/all', adminAuth, getAllShows);
showRouter.post('/add', adminAuth, addShow);

export default showRouter;