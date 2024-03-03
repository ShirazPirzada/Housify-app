import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { useSearchContext } from "../../contexts/SearchContext";
import { useAppContext } from "../../contexts/AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import * as apiClient from "../../api-client";

type Props = {
  apartmentId: string;
  pricePerMonth: number;
};

type UserFormData = {
  startDate: Date;
  endDate: Date;
  tenantCount: number;
};
export type TempBookingFormData = {
  userId: string;
  tenantCount: number;
  rentStartDate: Date;
  rentEndDate: Date;
  apartmentId: string;
  validityDate: Date;
};

const UserForm = ({ apartmentId, pricePerMonth }: Props) => {
  const search = useSearchContext();
  const { isLoggedIn } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [isBookNowVisible, setIsBookNowVisible] = useState(false);
  const [isPreBookVisible, setIsPreBookVisible] = useState(true);
  const [isReserved, setIsReserved] = useState(false);
  const { userId } = useAppContext();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { tempBookings } = await apiClient.fetchApartmentById(
          apartmentId
        );
        const currentUserId = userId;
        // Check if the current user has a temp booking
        const userTempBooking = tempBookings.find(
          (booking) => booking.userId === currentUserId
        );
        if (userTempBooking) {
          // Compare the currentDate with the validityDate
          const currentDate = new Date();
          const validityDate = new Date(userTempBooking.validityDate);

          if (currentDate <= validityDate) {
            setValue("tenantCount", userTempBooking.tenantCount);
            setValue("startDate", new Date(userTempBooking.rentStartDate));
            setValue("endDate", new Date(userTempBooking.rentEndDate));
            setIsBookNowVisible(true);
            setIsPreBookVisible(false);
          }
        }

        const _apartmentsData = await apiClient.getAllApartments();
        let bookingFound = false; // Variable to track if booking is found

        _apartmentsData.some((apartment) => {
          // Check if bookings array exists and is not empty
          if (apartment.bookings && apartment.bookings.length > 0) {
            // Find a booking based on userId and extract rentEndDate
            const _rentEndDateOnly = apartment.bookings.find((booking) => {
              return (
                booking.userId === userId &&
                new Date(booking.rentEndDate) >= new Date()
              );
            });
        
            // Check if a booking was found
            if (_rentEndDateOnly) {
              // If a booking was found and rentEndDate is in the future
              setIsReserved(true);
              bookingFound = true; // Set bookingFound to true
              return true; // Break out of the some loop
            }
          }
          return false; // Continue iterating over apartments
        });
        
        // Check if booking was found
        if (!bookingFound) {
          // No bookings found or rentEndDate is in the past
          setIsReserved(false);
        }
      } catch (error) {
        console.error("Error fetching apartment data:", error);
      }
    };

    fetchData();
  }, []);

  const {
    watch,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UserFormData>({
    defaultValues: {
      startDate: search.rentStartDate,
      endDate: search.rentEndDate,
      tenantCount: search.tenantCount,
    },
  });

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  const onSignInClick = (d: UserFormData) => {
    search.saveSearchValues("", d.startDate, d.endDate, d.tenantCount);
    navigate("/sign-in", { state: { from: location } });
  };

  const onSubmit = (d: UserFormData) => {
    search.saveSearchValues("", d.startDate, d.endDate, d.tenantCount);
    navigate(`/apartment/${apartmentId}/booking`);
  };
  const onPreBookClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsBookNowVisible(true);
    setIsPreBookVisible(false);
    // Run api on click event to add data to apartments.
    //TODO: Add an array of tempBookings in apartments document
    const currentDate = new Date(); 
    const validityDate = new Date(currentDate);
    validityDate.setDate(validityDate.getDate() + 3); // Add 3 days to the validityDate

    const tempBookingData: TempBookingFormData = {
      userId,
      tenantCount: watch("tenantCount"),
      rentStartDate: watch("startDate"),
      rentEndDate: watch("endDate"),
      apartmentId,
      validityDate, // You need to define where this comes from
    };
    try {
      await apiClient.createTempBooking(tempBookingData);
    } catch (error) {
      console.error("Error creating temp booking:", error);
    }
  };
  const onCancelClick = async (e) => {
    e.preventDefault();
    setIsBookNowVisible(false);
    setIsPreBookVisible(true);
    // Run api on click event to remove data from apartments temp booking.
    //TODO: remove data of tempBookings from apartments document
    try {
      await apiClient.deleteTempBooking(apartmentId, userId);
    } catch (error) {
      console.error("Error deleting temp booking:", error);
    }
  };
  return (
    <div className="flex flex-col p-4 bg-blue-200 gap-4">
      {/* <h3 className="text-md font-bold">Rs {pricePerMonth}</h3> */}
      <form
        onSubmit={
          isLoggedIn ? handleSubmit(onSubmit) : handleSubmit(onSignInClick)
        }
      >
        <div className="grid grid-cols-1 gap-4 items-center">
          <label className="text-xl font-bold">Rent Start Date:</label>
          <div>
            <DatePicker
              required
              selected={startDate}
              onChange={(date) => setValue("startDate", date as Date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              minDate={minDate}
              maxDate={maxDate}
              dateFormat="dd/MM/yyyy" // Set the date format
              placeholderText="Start Date"
              className="min-w-full bg-white p-2 focus:outline-none"
              wrapperClassName="min-w-full"
            />
          </div>
          <div>
            <label className="text-xl font-bold">Rent End Date:</label>
            <DatePicker
              required
              selected={endDate}
              onChange={(date) => setValue("endDate", date as Date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              minDate={minDate}
              maxDate={maxDate}
              dateFormat="dd/MM/yyyy" // Set the date format
              placeholderText="End Date"
              className="min-w-full bg-white p-2 focus:outline-none"
              wrapperClassName="min-w-full"
            />
          </div>
          <div className="flex bg-white px-2 py-1 gap-2">
            <label className="items-center flex">
              Tenant:
              <input
                className="w-full p-1 focus:outline-none font-bold"
                type="number"
                min={1}
                max={10}
                {...register("tenantCount", {
                  required: "This field is required",
                  min: {
                    value: 1,
                    message: "There must be at least one tenant",
                  },
                  valueAsNumber: true,
                })}
              />
            </label>

            {errors.tenantCount && (
              <span className="text-red-500 font-semibold text-sm">
                {errors.tenantCount.message}
              </span>
            )}
          </div>
          {isLoggedIn ? (
            <>
              {isReserved ? (
                <button
                  className="bg-blue-600 text-white h-full p-2 font-bold text-xl opacity-50 cursor-not-allowed"
                  disabled
                >
                  You can't book more than one!
                </button>
              ) : (
                <>
                  {isPreBookVisible && (
                    <button
                      onClick={onPreBookClick}
                      className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl"
                    >
                      Book Now
                    </button>
                  )}
                  {isBookNowVisible && (
                    <>
                      <button
                        type="submit"
                        className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl"
                      >
                        Confirm Booking
                      </button>
                      <button
                        onClick={onCancelClick}
                        className="bg-red-600 text-white h-full p-2 font-bold hover:bg-red-500 text-xl"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </>
              )}
            </>
          ) : (
            <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl">
              Sign in to Book
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserForm;
