import Listing from "../models/listing.model.js";

export const createListing = async (req, res, next) => {
  try {
    //     I think I see the issue. Here, you're trying to access req.body.imageUrls, but imageUrls is not a property of req.body. Instead, it's a property of req.files.

    // When you use multer to handle file uploads, it stores the uploaded files in req.files, not in req.body. So, you should access the uploaded files using req.files, not req.body.

    // console.log("req.body:", req.body); // add this line
    // const imageUrls = req.body.imageUrls;

    //     Each file object in the imageUrls array has properties such as fieldname, originalname, encoding, mimetype, size, destination, and filename.

    // So, when we access req.files.imageUrls, we're actually accessing an array of file objects, not a single property.

    // To access the file data, we need to iterate over the imageUrls array and access the file
    console.log("req.files:", req.files); // add this line
    // This code snippet iterates over the imageUrls array and extracts the path property from each file object, which contains the file path on the server.
    const imageUrls = req.files.map((file) => file.path);
    const listing = await Listing.create({ ...req.body, imageUrls });
    return res.status(201).send(listing);
  } catch (error) {
    next(error);
  }
};
