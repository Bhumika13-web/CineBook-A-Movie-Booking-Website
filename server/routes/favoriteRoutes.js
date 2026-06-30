import express from "express";
import { requireAuth } from "@clerk/express";
import { toggleFavorite, getUserFavorites } from "../controllers/favoriteController.js";

const favoriteRouter = express.Router();

favoriteRouter.post("/toggle", requireAuth(), toggleFavorite);
favoriteRouter.get("/my-favorites", requireAuth(), getUserFavorites);

export default favoriteRouter;
