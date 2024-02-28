import { useState } from "react";
import { ApartmentType } from "../../../backend/src/shared/types";
import * as apiClient from "../api-client";

type Props = {
  apartment: ApartmentType;
  onApprove: any;
};
const ApprovedApartments = ({ apartment, onApprove }: Props) => {
  const [rejected, setRejected] = useState(false);

  const handleReject = async () => {
      try {
          // Make API call to update apartment status to rejected
          await apiClient.updateApartmentRejectStatus(apartment._id);
          // Set rejected state to true
          setRejected(true);
      } catch (error) {
          // Handle error if needed
      }
  };

  return (
      <div className="space-y-5">
          <h1 className="text-3xl font-bold">Bookings</h1>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] border border-slate-300 rounded-lg p-8 gap-5">
              <div className="lg:w-full lg:h-[250px]">
                  <img
                      src={apartment.imageUrls[0]}
                      className="w-full h-full object-cover object-center"
                  />
              </div>
              <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px]">
                  <div className="text-2xl font-bold">
                      {apartment.name}
                      <div className="text-xs font-normal">
                          {apartment.city}, {apartment.country}
                      </div>
                  </div>
                  {apartment.bookings.length > 0 ? (
                      apartment.bookings.map((booking, index) => (
                          <div key={index}>
                              <div>
                                  <span className="font-bold mr-2">Dates: </span>
                                  <span>
                                      {new Date(booking.rentStartDate).toDateString()} -
                                      {new Date(booking.rentEndDate).toDateString()}
                                  </span>
                              </div>
                              <div>
                                  <span className="font-bold mr-2">Guests:</span>
                                  <span>{booking.tenantCount} Tenants</span>
                              </div>
                          </div>
                      ))
                  ) : (
                      <div>Not rented yet</div>
                  )}

              </div>
              <div className="flex gap-8">
                  {!rejected ? (
                      <>
                          <button onClick={onApprove} className="w-2/3 text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Approve</button>
                          <button onClick={handleReject} className="w-1/2 text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">Reject</button>
                      </>
                  ) : (
                      <h1 className="text-xl font-bold text-red-700">Apartment rejected</h1>
                  )}
              </div>

          </div>

      </div>
  );
};

export default ApprovedApartments;
