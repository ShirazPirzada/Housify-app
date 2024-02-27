import { FormEvent, useState } from "react";
import { useSearchContext } from "../contexts/SearchContext";
import { MdTravelExplore } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
const SearchBar = () => {
  const search = useSearchContext();
  const navigate = useNavigate();
  const [destination, setDestination] = useState<string>(search.destination);
  const [rentStartDate, setRentStartDate] = useState<Date>(
    search.rentStartDate
  );
  const [rentEndDate, setRentEndDate] = useState<Date>(search.rentEndDate);
  const [tenantCount, setTenantCount] = useState<number>(search.tenantCount);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    search.saveSearchValues(
      destination,
      rentStartDate,
      rentEndDate,
      tenantCount
    );
    navigate("/search");
  };

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  return (
    <form
      onSubmit={handleSubmit}
      className="lg:-mt-8 p-3 bg-orange-400 rounded shadow-md grid grid-cols-1 gap-4 lg:grid-cols-2"
    >
      <div className="flex lg:flex-row items-center flex-1 bg-white p-2">
        <MdTravelExplore size={25} className="mr-2" />
        <input
          placeholder="Look for apartments?"
          className="w-full p-1 focus:outline font-bold"
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
        />
      </div>

      <div className="lg:flex lg:bg-white lg:px-2 lg:py-1 lg:gap-2 lg:flex-col lg:items-start">
        <label className="items-center lg:flex">
          Tenants:{" "}
          <input
            className="w-full p-1 focus:outline font-bold"
            type="number"
            min={1}
            max={6}
            value={tenantCount}
            onChange={(event) => setTenantCount(parseInt(event.target.value))}
          />
        </label>
      </div>
      <div className="lg:flex lg:bg-white lg:px-2 lg:py-1 lg:gap-2 lg:flex-col lg:items-start">
        <DatePicker
          selected={rentStartDate}
          onChange={(date) => setRentStartDate(date as Date)}
          selectsStart
          startDate={rentStartDate}
          endDate={rentEndDate}
          minDate={minDate}
          maxDate={maxDate}
          placeholderText="Start Date"
          className="min-w-full bg-white p-2 focus:outline-none"
          wrapperClassName="min-w-full"
        />
      </div>
      <div className="lg:flex lg:bg-white lg:px-2 lg:py-1 lg:gap-2 lg:flex-col lg:items-start">
        <DatePicker
          selected={rentEndDate}
          onChange={(date) => setRentEndDate(date as Date)}
          selectsStart
          startDate={rentStartDate}
          endDate={rentEndDate}
          minDate={minDate}
          maxDate={maxDate}
          placeholderText="Start Date"
          className="min-w-full bg-white p-2 focus:outline-none"
          wrapperClassName="min-w-full"
        />
      </div>
      <div className="lg:flex lg:gap-1 ">
      <button className="w-2/3 text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
Search
</button>
        <button className="w-1/2 text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
Clear
</button>
      </div>
    </form>
  );
};

export default SearchBar;
