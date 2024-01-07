import { useSearchContext } from "../contexts/SearchContext";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { useState } from "react";
import SearchResultCard from "../components/SearchResultsCard";
import Pagination from "../components/Pagination";
import RatingFilter from "../components/RatingFilter";
const Search = () => {
  const search = useSearchContext();
  const [page, setPage] = useState<number>(1);
  const [selectedStars, setSelectedStars] = useState<string[]>([]);

  const searchParams = {
    destination: search.destination,
    rentStartDate: search.rentStartDate.toISOString(),
    rentEndDate: search.rentEndDate.toISOString(),
    tenantCount: search.tenantCount.toString(),
    page: page.toString(),
  };

  const { data: apartmentData } = useQuery(
    ["searchApartments", searchParams],
    () => apiClient.searchApartments(searchParams)
  );

  const handleStarsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rating = event.target.value;
    setSelectedStars((prev) =>
      event.target.checked
        ? [...prev, rating]
        : prev.filter((star) => star !== rating)
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      <div className="rounded-lg border border-slate-300 p-5 h-fit sticky top-10">
        <div className="space-y-5">
          <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
            Filter by:
            <RatingFilter
              selectedStars={selectedStars}
              onChange={handleStarsChange}
            />
          </h3>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">
            {apartmentData?.pagination.total} Apartments found
            {search.destination ? ` in ${search.destination}` : ""}
          </span>
          {/* TODO SORT options */}
        </div>
        {apartmentData?.data.map((apartment) => (
          <SearchResultCard apartment={apartment} />
        ))}
        <div>
          <Pagination
            page={apartmentData?.pagination.page || 1}
            pages={apartmentData?.pagination.pages || 1}
            OnPageChange={(page) => setPage(page)}
          />
        </div>
      </div>
    </div>
  );
};
export default Search;
