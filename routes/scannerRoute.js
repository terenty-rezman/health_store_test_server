import express from "express";
import { scanProduct } from "../controllers/scannerController.js";
import authUser from "../middlewares/authUser.js";
import { getSellersArray } from "../utils/utils.js";

const scannerRouter = express.Router();

scannerRouter.post("/product", authUser(getSellersArray), scanProduct);

export default scannerRouter;
