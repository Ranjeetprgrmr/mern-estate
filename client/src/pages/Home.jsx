import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  console.log("this is offerListings", offerListings);
  console.log("this is saleListings", saleListings);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
        if (data.length < 4) {
          fetchRentListings();
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data);

        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=4");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
    fetchRentListings();
    fetchSaleListings();
  }, []);

  return (
    <div>
      {/* top */}
      <div className="flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl">
          Find your next <span className="text-slate-500">perfect</span>
          <br />
          place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          MernEstate is the best place to find your next perfect place to live.
          <br />
          We have a wide range of properities for you to choosefrom.
        </div>
        <Link
          to={"/search"}
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
        >
          Let's get started...
        </Link>
      </div>

      {/* swiper */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide>
              <div
                style={{
                  // background: `url('/api/uploads/${listing.imageUrls[0]}') center no-repeat`,
                  background: `url('/api/uploads/${listing.imageUrls[0].replace('api\\uploads', '').replace('\\', '')}') center no-repeat`,
                  // <div style="background: url(&quot;/api/uploads/apiuploads\f ile1736789622957-501179143.jpg&quot;) center center no-repeat;" class="h-[500px]"></div>
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* listing result for offer */}
      <div className="max-w-8xl mx-auto p-3 flex flex-col gap-8 my-10 items-center">
        {
          offerListings && offerListings.length > 0 && (
            <div className="">
              <div className="mb-3">
                <h2 className="text-2xl font-bold text-slate-600">Recent Offers</h2>
                <Link to={'/search?offer=true'} className="tex-sm text-blue-800 hover:underline">
                  Show more offers
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {
                  offerListings.map((listing) => (
                    <ListingItem key={listing._id} listing={listing} />
                  ))
                }
              </div>
            </div>
          )
        }
        {
          rentListings && rentListings.length > 0 && (
            <div className="">
              <div className="mb-3">
                <h2 className="text-2xl font-bold text-slate-600">Recent places for rent</h2>
                <Link to={'/search?offer=rent'} className="tex-sm text-blue-800 hover:underline">
                  Show more rentals
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {
                  rentListings.map((listing) => (
                    <ListingItem key={listing._id} listing={listing} />
                  ))
                }
              </div>
            </div>
          )
        }
        {
          saleListings && saleListings.length > 0 && (
            <div className="">
              <div className="mb-3">
                <h2 className="text-2xl font-bold text-slate-600">Recent places for sale</h2>
                <Link to={'/search?offer=true'} className="tex-sm text-blue-800 hover:underline">
                  Show more sales
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {
                  saleListings.map((listing) => (
                    <ListingItem key={listing._id} listing={listing} />
                  ))
                }
              </div>
            </div>
          )
        }

      </div>
    </div>
  );
}

// Here is the revised review in 6 lines:

// I completed the MERN Stack training program at Broadway and had a great experience. The curriculum was well-structured and covered all essential aspects of the MERN Stack. I worked on various projects, including an e-commerce website, food delivery app, and blog app. The instructors provided excellent support and feedback, helping me improve my coding skills. I learned to view errors and bugs as opportunities for growth and learning, and to approach problems with a logical and methodical mindset. I highly recommend this program to anyone looking to acquire MERN Stack skills.
