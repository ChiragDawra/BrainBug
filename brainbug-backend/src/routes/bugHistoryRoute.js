import express from "express";
import { getBugHistory } from "../controllers/bugHistoryController.js";

const router = express.Router();

router.get("/", getBugHistory);

export default router;

