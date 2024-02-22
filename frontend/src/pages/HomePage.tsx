import SuggestedApartmentCards from "../components/SuggestedApartmentCards";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useEffect, useState } from "react";
import { ApartmentType } from "../../../backend/src/shared/types";
import AllApartmentCards from "../components/AllApartmentCards";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HomePage = () => {
    var settings = {
        dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2500,
        pauseOnHover: true
      };
  const { isLoggedIn } = useAppContext();
  const { data: currentUser } = useQuery(
    "fetchCurrentUser",
    apiClient.fetchCurrentUser
  );

  const [apartmentData, setApartmentData] = useState<ApartmentType[]>([]);
  const [allapartmentData, setAllApartmentData] = useState<ApartmentType[]>([]);
  const userId = currentUser?._id;

  useEffect(() => {
    const fetchData = async () => {
      if (userId && isLoggedIn) {
        try {
          const data = await apiClient.fetchSuggestiveApartments(userId);
          setApartmentData(data); // Update apartmentData state with fetched data
        } catch (error) {
          // Handle any errors
          console.error("Error fetching suggestive apartments:", error);
        }
      }

      //All Apartments Api
      try {
        const _aptData = await apiClient.fetchAllApartments();
        setAllApartmentData(_aptData); // Update apartmentData state with fetched data
      } catch (error) {
        // Handle any errors
        console.error("Error fetching suggestive apartments:", error);
      }
    };
    fetchData();
  }, [userId, isLoggedIn]);
  return (
    <>
  {isLoggedIn && apartmentData && (
    <>
      <h2 className="text-4xl font-extrabold dark:text-white">
        Apartments according to your community
      </h2>
      <br />
      <Slider {...settings}>
        {apartmentData.map((apartment) => (
          <SuggestedApartmentCards key={apartment._id} apartment={apartment} />
        ))}
      </Slider>
      <br />
    </>
  )}
  <h2 className="text-4xl font-extrabold dark:text-white ">
    Apartments Listed
  </h2>
  <br />
  <Slider {...settings}>
    {allapartmentData.map((apartment) => (
      <AllApartmentCards key={apartment._id} apartment={apartment} />
    ))}
  </Slider>
</>
  );
};
export default HomePage;
