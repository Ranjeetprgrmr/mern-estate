import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
import path from "path";

export const createListing = async (req, res, next) => {
  try {
    //     I think I see the issue. Here, you're trying to access req.body.imageUrls, but imageUrls is not a property of req.body. Instead, it's a property of req.files.

    // When you use multer to handle file uploads, it stores the uploaded files in req.files, not in req.body. So, you should access the uploaded files using req.files, not req.body.

    // console.log("req.body:", req.body); // add this line
    // const imageUrls = req.body.imageUrls; // doesn't work

    //     Each file object in the imageUrls array has properties such as fieldname, originalname, encoding, mimetype, size, destination, and filename.

    // So, when we access req.files.imageUrls, we're actually accessing an array of file objects, not a single property.

    // To access the file data, we need to iterate over the imageUrls array and access the file
    // console.log("req.files:", req.files); // add this line
    // This code snippet iterates over the imageUrls array and extracts the path property from each file object, which contains the file path on the server.

    const imageUrls = req.files.map((file) => file.path);
    req.body.imageUrls = imageUrls;

    console.log("req.files:", req.files); // add this line
    console.log("req.body:", req.body);

    const listing = await Listing.create(req.body);
    return res.status(201).send(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findByIdAndDelete(req.params.id);
  if (!listing) return next(errorHandler(404, "Listing not found"));
  if (req.user.id !== listing.userRef)
    return next(errorHandler(403, "You can only delete your listing"));
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted...");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  // console.log('this is req.files:', req.files);
  const listing = await Listing.findById(req.params.id);
  if (!listing) return next(errorHandler(404, "Listing not found"));
  if (req.user.id !== listing.userRef)
    return next(errorHandler(403, "You can only update your listing"));
  try {
    let imageUrls = listing.imageUrls || [];
    if (req.files && req.files.length > 0) {
      const newImage = req.files[req.files.length - 1];
      if (newImage) {
        imageUrls.push(newImage.path); // Append the new file path to the existing array
      }
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $set: { imageUrls } },
      { new: true }
    );

    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "Listing not found"));

    // Construct the correct URL for each image
    listing.imageUrls = listing.imageUrls.map((url) => {
      return `${req.protocol}://${req.get("host")}/api/uploads/${url}`;
    });
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};
