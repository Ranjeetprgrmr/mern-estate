import express from 'express';
import { createListing, deleteListing, updateListing, getListing, getListings } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyToken.js';
import {upload}  from '../utils/upload.js';

const router = express.Router();

router.post('/create', verifyToken, upload().array('imageUrls', 6), createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.put('/update/:id', verifyToken, upload().array('imageUrls', 6),  updateListing);
router.get('/get/:id', getListing);
router.get('/get', getListings);


export default router;