import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { uploadImage } from "../redux/user/userSlice";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";

export default function Profile() {
  const fileRef = useRef(null);
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListings, setShowListings] = useState([]);
  const [showListingsError, setShowListingsError] = useState(false);

  const { currentUser, loading, error, userImage } = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    console.log("handleImageChange called");
    const file = e.target.files[0];
    setImage(file);
    setFormData({
      ...formData,
      avatar: file,
    });
    const payload = {
      ...formData,
      avatar: file,
    };
    dispatch(uploadImage(payload));
    console.log("uploadImage action dispatched with payload:", payload);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  //   Yes, this code snippet answers my previous question
  // The fact that the access_token is being set as a cookie with the httpOnly flag set to true means that the cookie will be sent with every request to the server, including the fetch request.
  // And, as you mentioned, the verifyToken middleware will be able to verify the access_token from the cookie and authenticate the user, even though the access_token is not being explicitly included in the fetch request.
  // So, to answer my previous question: YES, that is correct! The cookie is being sent with the request and is being used to authenticate the user, which is why the access_token doesn't need to be explicitly included in the fetch request.
  // If you mention the access_token in your fetch request, and it still says "invalid token", it's likely because the token is being sent in a different way than what the server is expecting.
  // When you set the access_token as a cookie, the server expects to receive it as a cookie in the request headers. However, if you explicitly include the access_token in the fetch request, it's being sent as a separate header or parameter, which might not be what the server is expecting.
  // In this case, the server might be rejecting the token because it's not being sent in the expected way. It's like the server is saying, "Hey, I'm expecting the token to be sent as a cookie, but you're sending it as a separate header. I don't recognize this token!"
  // To fix this, you can try removing the explicit mention of the access_token from your fetch request, and let the cookie be sent automatically with the request. This should allow the server to recognize the token and authenticate the user correctly.
  // I see what you're getting at now.
  // Yes, that's correct. The access_token is being sent from the client-side as a cookie, and that's why you don't need to mention it explicitly in the handleSubmit function.
  // When you set the access_token cookie on the server-side using res.cookie("access_token", token, { ... }), the cookie is being stored on the client-side (i.e., in the user's browser).
  // Then, when you make a subsequent request to the server from the client-side (e.g., using the handleSubmit function), the cookie is automatically sent along with the request.
  // So, in the handleSubmit function, you don't need to explicitly mention the access_token because it's already being sent as a cookie with the request.
  // This is exactly what I said earlier: "the cookie is being sent with the request and is being used to authenticate the user".
  // So, to summarize:
  // The access_token cookie is being set on the server-side and stored on the client-side.
  // When you make a subsequent request from the client-side, the cookie is automatically sent along with the request.
  // You don't need to explicitly mention the access_token in the handleSubmit function because it's already being sent as a cookie with the request.
  // Does that make sense?
  const handleSubmit = async (e) => {
    console.log("handle submit tridderd");
    e.preventDefault();

    try {
      if (!currentUser || !currentUser.otherDetails._id) {
        console.error(
          "currentUser or currentUser.otherDetails._id is undefined"
        );
      }
      const formData = new FormData();
      formData.append("username", e.target.username.value);
      formData.append("email", e.target.email.value);
      if (e.target.password.value) {
        formData.append("password", e.target.password.value);
      }
      if (image) {
        formData.append("avatar", image);
      }
      console.log("image", image);
      dispatch(updateUserStart());
      console.log("this is currentUser:", currentUser.otherDetails._id);
      const res = await fetch(
        `/api/user/update/${currentUser.otherDetails._id}`,
        {
          method: "PUT",
          body: formData,
        }
      );
      // If the API returns a 401 Unauthorized response, this code will catch it and dispatch the updateUserFailure action.
      if (!res.ok) {
        const responseData = await res.json();
        dispatch(updateUserFailure(responseData.message));
        return;
      }

      const responseData = await res.json();

      // If the API returns a 200 OK response, but the response data contains an error message (e.g., {"success": false, "message": "Invalid data"}), then this code will catch it and dispatch the updateUserFailure action.
      if (responseData.success === false) {
        dispatch(updateUserFailure(responseData.message));
        return;
      }

      dispatch(updateUserSuccess(responseData));

      setUpdateSuccess(true);
    } catch (error) {
      console.error("Error:", error.message);
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));

      navigate("/sign-in");
    } catch (error) {
      console.error("Error:", error.message);
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      console.log("data:", data); // <--- Add this line

      // Inspect the data object here
      console.log("listing object:", data[0]);

      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }

      dispatch(signOutUserSuccess(data));
      dispatch(deleteUserSuccess()); // Clear the currentUser state
      // // Clear the image data from local storage
      // localStorage.removeItem("avatar");

      navigate("/sign-in");
    } catch (error) {
      console.error("Error:", error.message);
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      console.log("this is listing data:", data); // <--- Add this line
      // Inspect the data object here
      console.log("this is listing object:", data);

      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      // setShowListings(
      //   data.map((listing) => {
      //     console.log('this is listing imageUrls:', listing.imageUrls);
      //     const images = listing.imageUrls.map((imageUrl) => {
      //       console.log('this is imageUrl:', imageUrl); // <--- ADD THIS LINE
      //       return { url: imageUrl };
      //     });
      //     return { ...listing, images };
      //   })
      // );
      setShowListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      // handleShowListings();
      setShowListings(
        showListings.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={handleImageChange}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          src={
            image
              ? URL.createObjectURL(image)
              : userImage || currentUser.otherDetails.avatar
          }
          alt="select profile picture"
          className="h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2"
          onClick={() => fileRef.current.click()}
        />
        {isUploading && (
          <div className="w-full bg-gray-200 rounded-full h-4 flex justify-between">
            <div
              className="bg-blue-500 rounded-full h-4 p-2 "
              style={{ width: `${percentage}%` }}
            ></div>
            <span className="text-gray-500 text-xs">{percentage}%</span>
          </div>
        )}
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          value={formData.password || (currentUser.password && !e.target.value)}
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disables:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white rounded-lg p-3 uppercase hover:opacity-95 text-center"
          to="/create-listing"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-7">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>
      <p className="text-red-700">{error ? error : ""}</p>
      <p className="text-green-700 font-semibold">
        {updateSuccess ? "Profile updated successfully" : ""}
      </p>
      <div className="flex justify-between">
        <button
          onClick={handleShowListings}
          className="bg-green-700 text-white rounded-lg p-3 uppercase hover:opacity-95
        text-center mx-auto mt-7"
        >
          Show Listings
        </button>
        <p className="text-red-700 mt-5">
          {showListingsError ? "Error showing listings" : ""}
        </p>
      </div>
      <h1 className="text-3xl font-semibold text-center mt-7">My Listings</h1>
      {showListings &&
        showListings.map((listing, index) => (
          <div
            key={index}
            className="border mt-2 rounded-lg p-3 flex justify-between items-center gap-4"
          >
            <Link to={`/listing/${listing._id}`}>
              {listing.imageUrls.map((imageUrl, imageIndex) => (
                <img
                  src={imageUrl}
                  key={imageUrl}
                  alt={`Image ${imageIndex + 1}`}
                  className="h-16 w-16 object-contain"
                  onError={(e) =>
                    console.error(`Error loading image ${imageUrl}:`, e)
                  }
                  onLoad={(e) =>
                    console.log(`Image ${imageUrl} loaded successfully`)
                  }
                />
              ))}
            </Link>

            <Link
              className="text-slate-700 font-semibold flex-1 hover:underline truncate"
              to={`/listing/${listing._id}`}
            >
              <p>{listing.name}</p>
            </Link>

            <div className="flex flex-col item-center">
              <button
                onClick={() => handleDeleteListing(listing._id)}
                className="text-red-700"
              >
                Delete
              </button>
              <Link to={`/update-listing/${listing._id}`}>
                <button className="text-green-700">Edit</button>
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
}
