import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import { test, updateUser, deleteUser, getUserListings } from "../controllers/user.controller.js";
import { upload } from "../utils/upload.js";

const router = express.Router();

router.get("/test", test);
router.put("/update/:id", verifyToken, upload().single('avatar'), updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listings/:id", verifyToken, getUserListings)

export default router;
