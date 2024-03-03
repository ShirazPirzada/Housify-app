import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import * as apiClient from "../api-client";
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiHotel, BiMoney, BiStar } from "react-icons/bi";
const MyApartments = () => {
  const { data: apartmentData } = useQuery(
    "getmyApartments",
    apiClient.getmyApartments,
    {
      onError: () => {},
    }
  );
  if (!apartmentData) {
    return <span>No Apartments found</span>;
  }
  return (
    <div className="space-y-5">
      <span className="flex justify-between">
        <h1 className="text-3xl font-bold">My Apartments</h1>
        <Link
          to="/add-apartment"
          className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500"
        >
          Add Apartment
        </Link>
      </span>
      <div className="grid grid-cols-1 gap-8">
        {apartmentData.map((apartment) => (
          <div className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5">
            <h2 className="text-2xl font-bold">{apartment.name}</h2>
            <div className="whitespace-pre-line">{apartment.description}</div>
            <div className="whitespace-pre-line">Contact#: {apartment.ContactNo ? apartment.ContactNo:"Not found" }</div>
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
        ))}
      </div>
    </div>
  );
};
export default MyApartments;
