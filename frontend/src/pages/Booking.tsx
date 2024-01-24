import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { useSearchContext } from "../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BookingForm from "../forms/BookingForm/BookingForm";
import BookingDetailSummary from "../components/BookingDetailSummary";
import { Elements } from "@stripe/react-stripe-js";
import { useAppContext } from "../contexts/AppContext";

const Booking = () => {
  const { stripePromise } = useAppContext();
  const search = useSearchContext();
  const { apartmentId } = useParams();

  const [numberOfMonths, setNumberOfMonths] = useState<number>(0);

  useEffect(() => {
    if (search.rentStartDate && search.rentEndDate) {
      const months =
        Math.abs(search.rentEndDate.getTime() - search.rentStartDate.getTime()) /
        (1000  * 60 * 60 * 24)/ 30.4375;

      setNumberOfMonths(Math.ceil(months));
    }
  }, [search.rentStartDate, search.rentStartDate]);

  const { data: paymentIntentData } = useQuery(
    "createPaymentIntent",
    () =>
      apiClient.createPaymentIntent(
        apartmentId as string,
        numberOfMonths.toString()
      ),
    {
      enabled: !!apartmentId && numberOfMonths > 0,
    }
    
  );
    console.log("PaymentIntentData: ",paymentIntentData);
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
    console.log("Apartment not found in booking payment page: ")
    return <></>;
  }

  return (
    <div className="grid md:grid-cols-[1fr_2fr]">
      <BookingDetailSummary
          rentStartDate={search.rentStartDate}
          rentEndDate={search.rentEndDate}
          tenantCount={search.tenantCount}
          
          numberOfMonths={numberOfMonths}
          apartment={apartment}
        />      
        {currentUser  && paymentIntentData && (
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
          //</Elements>
        )}
    </div>
  );
};

export default Booking;
