import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { uploadImage } from "../redux/user/userSlice";

export default function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  // const [file, setFile] = useState(undefined);
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.id]: e.target.value });
  // };
  // console.log(formData);

  useEffect(() => {
    const storedImage = localStorage.getItem("image");
    if (storedImage) {
      setImage(storedImage);
    }
  }, []);
  const handleImageChange = async (e) => {
    setIsUploading(true);
    const file = e.target.files[0];
    const reader = new FileReader();
    let imageData;

    reader.onload = () => {
      imageData = reader.result;
      setImage(imageData);
      localStorage.setItem("image", imageData);
      dispatch(uploadImage(imageData));
      setPercentage(100); // Ensure progress is set to 100% on load
      setTimeout(() => {
        setIsUploading(false); // Hide the upload indicator
      }, 500); // Delay to simulate upload time
    };
    reader.onprogress = (e) => {
      const progress = (e.loaded / e.total) * 100;
      setPercentage(progress);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          onChange={handleImageChange}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          src={image || currentUser.avatar}
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
            {/* <span className="text-gray-500 text-xs absolute right-0 top-0 mt-2">
              {percentage}%
            </span> */}
          </div>
        )}
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          defaultValue={currentUser.username}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          defaultValue={currentUser.email}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disables:opacity-80">
          update
        </button>
      </form>
      <div className="flex justify-between mt-7">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}
