import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { uploadImage } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function Header() {
  // const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { currentUser, userImage } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
     const urlParams = new URLSearchParams(location.search);
     const searchTermFromUrl = urlParams.get("searchTerm");
     if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl);
     }
  }, [location.search]);

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center p-4 max-w-6xl mx-auto">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">MERN</span>
            <span className="text-slate-500">Estate</span>
          </h1>
        </Link>
        <form onSubmit={handleSubmit} className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>

          <Link to="/profile">
            {currentUser && userImage ? (
              
              console.log('Image src:', image || userImage || currentUser.otherDetails.avatar),
              <img
                key={userImage}
                src={image ? URL.createObjectURL(image) : userImage || currentUser.otherDetails.avatar}
                alt="User"
                className="w-10 h-10 rounded-full"
                onError={(e) => console.error('Error loading image:', e)}
             
              />
              
            ) : (
              <li className="hidden sm:inline text-slate-700 hover:underline">
                Sign in
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
