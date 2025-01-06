import express from 'express';
import { createListing } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyToken.js';
import { upload } from '../utils/upload.js';

const router = express.Router();

router.post('/create', verifyToken,  upload().array('imageUrls', 6), createListing);

export default router;