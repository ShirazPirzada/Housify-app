import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "./../api-client";
import { AiFillStar } from "react-icons/ai";
import UserForm from "../forms/UserForm/UserForm";

const DetailPage = () => {
    const { apartmentId: apartmentId } = useParams();
  
    const { data: apartment } = useQuery(
      "fetchApartmentById",
      () => apiClient.fetchApartmentById(apartmentId || ""),
      {
        enabled: !!apartmentId,
      }
    );
  
    if (!apartment) {
      return <></>;
    }
  
    return (
      <div className="space-y-6">
        <div>
          <span className="flex">
            {Array.from({ length: apartment.Rating }).map(() => (
              <AiFillStar className="fill-yellow-400" />
            ))}
          </span>
          <h1 className="text-3xl font-bold">{apartment.name}</h1>
        </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {apartment.imageUrls.map((image) => (
            <div className="h-[300px]">
              <img
                src={image}
                alt={apartment.name}
                className="rounded-md w-full h-full object-cover object-center"
              />
            </div>
          ))}
        </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
          {apartment.facilities.map((facility) => (
            <div className="border border-slate-300 rounded-sm p-3">
              {facility}
            </div>
          ))}
        </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
          <div className="whitespace-pre-line">{apartment.description}</div>
          <div className="h-fit">
            <UserForm
              pricePerMonth={apartment.pricePerMonth}
              apartmentId={apartment._id}
            />
          </div>
        </div>
      </div>
    );
  };
  
  export default DetailPage;