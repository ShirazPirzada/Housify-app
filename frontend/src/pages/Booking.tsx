import { useQuery } from "react-query";
import * as apiClient from "../api-client";
// import BookingForm from "../forms/BookingForm/BookingForm";
import { useSearchContext } from "../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
// import BookingDetailsSummary from "../components/BookingDetailsSummary";
// import { Elements } from "@stripe/react-stripe-js";
import { useAppContext } from "../contexts/AppContext";
import BookingForm from "../forms/BookingForm/BookingForm";

const Booking = () => {
  //const { stripePromise } = useAppContext();
  const search = useSearchContext();
  const { apartmentId } = useParams();

  const [numberOfNights, setNumberOfNights] = useState<number>(0);

  // useEffect(() => {
  //   if (search.checkIn && search.checkOut) {
  //     const nights =
  //       Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
  //       (1000 * 60 * 60 * 24);

  //     setNumberOfNights(Math.ceil(nights));
  //   }
  // }, [search.checkIn, search.checkOut]);

  // const { data: paymentIntentData } = useQuery(
  //   "createPaymentIntent",
  //   () =>
  //     apiClient.createPaymentIntent(
  //       apartmentId as string,
  //       numberOfNights.toString()
  //     ),
  //   {
  //     enabled: !!apartmentId && numberOfNights > 0,
  //   }
  // );

  const { data: apartment } = useQuery(
    "fetchApartmentById",
    () => apiClient.fetchApartmentById(apartmentId as string),
    {
      enabled: !!apartmentId,
    }
  );

  const { data: currentUser } = useQuery(
    "fetchCurrentUser",
    apiClient.fetchCurrentUser
  );

  if (!apartment) {
    return <></>;
  }

  return (
    <div className="grid md:grid-cols-[1fr_2fr]">
      <div className="bg-green-200">BOOKING DETAILS</div>
      {currentUser && <BookingForm currentUser={currentUser}/>} 
      {/* <BookingDetailsSummary
          checkIn={search.checkIn}
          checkOut={search.checkOut}
          adultCount={search.adultCount}
          childCount={search.childCount}
          numberOfNights={numberOfNights}
          hotel={hotel}
        />
        {currentUser && paymentIntentData && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret: paymentIntentData.clientSecret,
            }}
          >
            <BookingForm
              currentUser={currentUser}
              paymentIntent={paymentIntentData}
            />
          </Elements>
        )} */}
    </div>
  );
};

export default Booking;
