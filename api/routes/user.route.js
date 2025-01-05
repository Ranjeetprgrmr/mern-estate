import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import { test, updateUser, deleteUser, getUserListings } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/test", test);
router.put("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listings/:id", verifyToken, getUserListings)

export default router;
