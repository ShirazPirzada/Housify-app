import SuggestedApartmentCards from "../components/SuggestedApartmentCards";
import AllApartmentCards from "../components/AllApartmentCards";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useEffect, useState } from "react";
import { ApartmentType } from "../../../backend/src/shared/types";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HomePage = () => {
  const { isLoggedIn } = useAppContext();
  const { data: currentUser } = useQuery(
    "fetchCurrentUser",
    apiClient.fetchCurrentUser
  );

  const [apartmentData, setApartmentData] = useState<ApartmentType[]>([]);
  const [allapartmentData, setAllApartmentData] = useState<ApartmentType[]>([]);
  const [slidesToShow, setSlidesToShow] = useState<number>(3); // State for slidesToShow

  const userId = currentUser?._id;

  useEffect(() => {
    const fetchData = async () => {
      if (userId && isLoggedIn) {
        try {
          const data = await apiClient.fetchSuggestiveApartments(userId);
          setApartmentData(data);
        } catch (error) {
          console.error("Error fetching suggestive apartments:", error);
        }
      }

      try {
        const _aptData = await apiClient.fetchAllApartments();
        setAllApartmentData(_aptData);
      } catch (error) {
        console.error("Error fetching all apartments:", error);
      }
    };
    fetchData();

    // Set slidesToShow manually upon initial load and window resize
    const handleResize = () => {
      setSlidesToShow(window.innerWidth <= 768 ? 1 : 3);
    };
    handleResize(); // Call on initial load
    window.addEventListener('resize', handleResize); // Add event listener for window resize
    
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [userId, isLoggedIn]);

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: slidesToShow, // Use dynamic slidesToShow
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    pauseOnHover: true
  };

  return (
    <>
      {isLoggedIn && apartmentData && (
        <>
          <h2 className="text-center sm:text-3xl sm:text-left font-extrabold">
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
      <h2 className="text-center sm:text-3xl sm:text-left font-extrabold">
        Apartments Listed
      </h2>
      <br />
      <Slider {...settings}>
        {allapartmentData.map((apartment) => (
          <AllApartmentCards key={apartment._id} apartment={apartment}  />
        ))}
      </Slider>
    </>
  );
};

export default HomePage;
