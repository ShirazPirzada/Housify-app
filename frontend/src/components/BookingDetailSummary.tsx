import { ApartmentType } from "../../../backend/src/shared/types";

type Props = {
    rentStartDate: Date;
    rentEndDate: Date;
    tenantCount : number;
    numberOfMonths: number;
    apartment:ApartmentType;
}
const BookingDetailsSummary = ({
    rentStartDate,
    rentEndDate,
    tenantCount,
    
    numberOfMonths,
    apartment,
  }: Props) => {
    return (
      <div className="grid gap-4 rounded-lg border border-slate-300 p-5 h-fit">
        <h2 className="text-xl font-bold">Your Booking Details</h2>
        <div className="border-b py-2">
          Location:
          <div className="font-bold">{`${apartment.name}, ${apartment.city}, ${apartment.country}`}</div>
        </div>
        <div className="flex justify-between">
          <div>
            StartDate of Renting
            <div className="font-bold"> {rentStartDate.toDateString()}</div>
          </div>
          <div>
            EndDate of Renting
            <div className="font-bold"> {rentEndDate.toDateString()}</div>
          </div>
        </div>
        <div className="border-t border-b py-2">
          Total length of stay:
          <div className="font-bold">{numberOfMonths} Months</div>
        </div>
  
        <div>
          Tenants{" "}
          <div className="font-bold">
            {tenantCount} Tenants 
          </div>
        </div>
      </div>
    );
  };
  
  export default BookingDetailsSummary;