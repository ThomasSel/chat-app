import express from "express";
import { create } from "../controllers/REST/user";

const router = express.Router();

router.post("/", create);

export default router;
