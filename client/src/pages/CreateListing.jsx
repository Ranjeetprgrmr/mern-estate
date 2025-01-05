import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {

  const [files, setFiles] = useState([]);
  // console.log('files', files);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: "1",
    bathrooms: "1",
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  // console.log("formdata", formData);

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useSelector((state) => state.user);

  const navigate = useNavigate();

  const handleImageSubmit = () => {
    if (files.length === 0) {
      //   toast.error("Please select an image to upload.");
      setImageUploadError("Please select an image to upload.");
      setTimeout(() => setImageUploadError(""), 3000); // clear error message after 3 seconds
      return;
    }
    if (files.length > 0 && files.length + formData.imageUrls.length > 6) {
      //   toast.error("Maximum of 6 images allowed.");
      setImageUploadError("Maximum of 6 images allowed.");
      setTimeout(() => setImageUploadError(""), 3000); // clear error message after 3 seconds
      return;
    }

    const newImageUrls = [];

    try {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          newImageUrls.push(reader.result);
          setFormData({
            ...formData,
            imageUrls: [...formData.imageUrls, ...newImageUrls],
          });
          setUploading(false); // add this line here
        };
        reader.onerror = () => {
          toast.error("Error uploading image.");
        };
        setUploading(true); // add this line here
        reader.readAsDataURL(file);
      });
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("this is formdata", formData);

    try {
      if(formData.imageUrls.length < 1) return setError('You must upload at least one image');
      if(+formData.regularPrice < +formData.discountPrice) return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);

      // We create a new FormData object using the new FormData() constructor.
      const formDataToSend = new FormData();

      // We append multiple fields to the FormData object using the append() method, including userRef, imageUrls, and other fields from the formData object.
      formDataToSend.append("userRef", currentUser._id);
      Object.keys(formData).forEach((key) => {
        if (key !== "imageUrls") {
          formDataToSend.append(key, formData[key]);
        }
      });
      // We also append multiple files to the FormData object using the append() method, specifically the imageUrls field.
      // Append each file individually
      for (let i = 0; i < files.length; i++) {
        formDataToSend.append("imageUrls", files[i]);
      }

      // We set the Content-Type header of the request to multipart/form-data implicitly by passing the FormData object as the body of the request.
      const res = await fetch("/api/listing/create", {
        method: "POST",
        body: formDataToSend,
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        return;
      }
      console.log(data);
      navigate(`/listing/${data._id}`);
    } catch (error) {
      console.log(error);
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-3">
      <h1 className="text-3xl text-center my-7 font-semibold">
        Create Listing
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-10"
      >
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <input
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="border p-3 rounded-lg border-gray-300"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <span>Bed</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="border p-3 rounded-lg border-gray-300"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <span>Bathrooms</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="1000000"
                required
                className="border p-3 rounded-lg border-gray-300"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <p>Regular price</p>
              <span className="text-xs">($ / month)</span>
            </div>
            {formData.offer && (
                <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="10000000"
                  required
                  className="border p-3 rounded-lg border-gray-300"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <p>Discounted price</p>
                <span className="text-xs">($ / month)</span>
              </div>

            )}
          
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <p className="font-semibold">Images:</p>
          <span className="font-normal text-gray-600 ml-2">
            The first image will be the cover (max 6)
          </span>
          <div className="mt-5 flex gap-3">
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              className="p-3 border border-gray-300 rounded w-full"
              onChange={(e) => setFiles(e.target.files)}
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          <p className="text-red-600">
            {imageUploadError && <span>{imageUploadError}</span>}
          </p>

          <div className="mt-5 flex gap-3 flex-col">
            {formData.imageUrls.map((url, index) => (
              <div
                key={index}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="Uploaded Image"
                  className="w-32 h-32 object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-2 text-red-600 rounded font-semibold hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <button disable={ loading || uploading } className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled=opacity-80 mt-5">
            {loading ? "Loading..." : "Create Listing"}
          </button>
          {error && <p className="text-red-600">{error}</p>}
        </div>
      </form>
    </main>
  );
}


// By using FormData and appending multiple fields and files to it, we are creating a multi-part form data request. This allows us to send a mixture of text and binary data (such as images) in a single request.

// Note that we don't need to explicitly set the Content-Type header to multipart/form-data because the fetch API will automatically set it for us when we pass a FormData object as the body of the request.