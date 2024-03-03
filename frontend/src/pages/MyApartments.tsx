import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../api-client";
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiHotel, BiMoney, BiStar } from "react-icons/bi";
import { useEffect, useState } from "react";
import { ApartmentType } from "../../../backend/src/shared/types";

const MyApartments = () => {
  const [tenantBtn, setTenantBtn] = useState(true);
  const [apartmentData, setApartmentData] = useState<ApartmentType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiClient.getmyApartments();
        setApartmentData(data);   
      } catch (error) {
      
        // Handle error if needed
      }
    };
    fetchData();
  }, []);

  // const { data: apartmentData } = useQuery(
  //   "getmyApartments",
  //   apiClient.getmyApartments,
  //   {
  //     onError: () => {},
  //   }
  // );
  // const [apartments, setApartments] = useState(apartmentData);

  if (!apartmentData) {
    return <span>No Apartments found</span>;
  }

  const handleTerminateBooking = async (apartmentId, userId) => {
    try {

        // Update apartmentData by filtering out the terminated booking
        const updatedApartments = apartmentData.map(apartment => ({
          ...apartment,
          bookings: apartment.bookings.filter(booking => booking.userId !== userId)
        }));
      
      await apiClient.deleteBooking(apartmentId, userId);

    
      console.log("Updated data: ",updatedApartments);
     
      setApartmentData(updatedApartments);
    } catch (error) {
      console.error('Failed to terminate booking:', error);
     
    }
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return (
    <div className="space-y-5">
      <span className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Apartments</h1>
        <div className="flex items-center">
          <Link
            to="/add-apartment"
            className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500 rounded"
          >
            Add Apartment
          </Link>
          <input
            type="checkbox"
            checked={tenantBtn}
            onChange={() => setTenantBtn((prevState) => !prevState)}
            className="p-2 ml-2"
          />
          <span className="ml-1">Tenant's List</span>
        </div>
      </span>
      <div className="grid grid-cols-1 gap-8">
        {tenantBtn ? (
          <>
            <div className="text-2xl font-bold mb-4">Tenants List</div>
            <>
              {apartmentData.map((apartment) => (
                <div className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5">
                  <h2 className="text-2xl font-bold">{apartment.name}</h2>
                  {apartment.bookings.map((booking, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-bold">
                          {booking.firstName.toUpperCase()} {booking.lastName.toUpperCase()}
                        </p>
                        <p>
                          <span className="font-bold">Rent Start Date:</span>{" "}
                          {formatDate(booking.rentStartDate)}
                        </p>
                        <p>
                          <span className="font-bold">Rent End Date:</span>{" "}
                          {formatDate(booking.rentEndDate)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleTerminateBooking(apartment._id, booking.userId)}
                        className="bg-red-300 hover:bg-red-500 border-slate-300 text-white px-4 py-2 rounded"
                      >
                        Terminate Contract
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </>
          </>
        ) : (
          apartmentData.map((apartment) => (
            <div className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5">
              <h2 className="text-2xl font-bold">{apartment.name}</h2>
              <div className="whitespace-pre-line">{apartment.description}</div>
              <div className="whitespace-pre-line">
                Contact#:{" "}
                {apartment.ContactNo ? apartment.ContactNo : "Not found"}
              </div>
              <div className="grid grid-cols-5 gap-2">
                <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                  <BsMap className="mr-1" />
                  {apartment.city},{apartment.country}
                </div>
                <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                  <BsBuilding className="mr-1" />
                  {apartment.type}
                </div>
                <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                  <BiMoney className="mr-1" />
                  Rs {apartment.pricePerMonth} per month
                </div>
                <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                  <BiHotel className="mr-1" />
                  {apartment.tenantCount}
                </div>
                <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                  <BiStar className="mr-1" />
                  {apartment.Rating} Star Rating
                </div>
              </div>
              <span className="flex justify-end">
                <Link
                  className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500"
                  to={`/edit-apartment/${apartment._id}`}
                >
                  View Details
                </Link>
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyApartments;
