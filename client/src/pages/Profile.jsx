import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { uploadImage } from "../redux/user/userSlice";

export default function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const [file, setFile] = useState(undefined);
  const [image, setImage] = useState(null);
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
  const handleImageChange = (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  let imageData;

  reader.onload = () => {
    imageData = reader.result;
    setImage(imageData);
    localStorage.setItem("image", imageData);
    dispatch(uploadImage(imageData));
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
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
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







