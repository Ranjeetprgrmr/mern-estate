import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function CreateListing() {
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

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newImageUrls, setNewImageUrls] = useState([]);
  const [files, setFiles] = useState([]);

  const { currentUser } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };
    fetchListing();
  }, []);

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

    setUploading(true); // set uploading state to true before uploading images

    try {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const newImageUrl = reader.result;
          setNewImageUrls([...newImageUrls, newImageUrl]);
          setFormData({
            ...formData,
            imageUrls: [...formData.imageUrls, newImageUrl],
          });
          setFiles([...files, file]); // Update the files state with the new image
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
    setUploading(false); // set uploading state to false after all images have been uploaded
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
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than regular price");
      setLoading(true);
      setError(false);

      const formDataToSend = new FormData();
  
      formDataToSend.append("userRef", currentUser._id);

      Object.keys(formData).forEach((key) => {
        if (key !== "imageUrls" && key !== "userRef") {
          formDataToSend.append(key, formData[key]);
        }
      });
      // Object.entries(formData).forEach(([key, value]) => {
      //   if (key !== "imageUrls" && key !== "userRef") {
      //     formDataToSend.append(key, value);
      //   }
      // });
      
    // Append images to the formDataToSend
    files.forEach((file) => {
      formDataToSend.append("imageUrls", file);
    });

      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "PUT",
        headers: {},
        body: formDataToSend,
      });
      console.log("Response:", res);
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      if (data.success === false) {
        setError(data.message);
        return;
      }

      navigate(`/listing/${data._id}`);
    } catch (error) {
      console.log(error);
      setError(error.message);
      setLoading(false);
      console.error("Error:", error);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-3">
      <h1 className="text-3xl text-center my-7 font-semibold">
        Update a Listing
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
                  src={url.replace("api/uploads/", "")}
                  alt="Uploaded Image"
                  className="w-32 h-32 object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    handleRemoveImage(index);
                    deleteImage(index);
                  }}
                  className="p-2 text-red-600 rounded font-semibold hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <button
            disable={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled=opacity-80 mt-5"
          >
            {loading ? "Updating..." : "Update Listing"}
          </button>
          {error && <p className="text-red-600">{error}</p>}
        </div>
      </form>
    </main>
  );
}

// By using FormData and appending multiple fields and files to it, we are creating a multi-part form data request. This allows us to send a mixture of text and binary data (such as images) in a single request.

// Note that we don't need to explicitly set the Content-Type header to multipart/form-data because the fetch API will automatically set it for us when we pass a FormData object as the body of the request.
