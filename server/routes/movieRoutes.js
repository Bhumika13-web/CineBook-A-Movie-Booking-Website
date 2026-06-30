import express from "express";
import { getAllMovies, getMovieById } from "../controllers/movieController.js";

const movieRouter = express.Router();

movieRouter.get("/all", getAllMovies);
movieRouter.get("/:id", getMovieById);

export default movieRouter;
