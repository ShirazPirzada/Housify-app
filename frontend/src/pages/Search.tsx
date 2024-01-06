import { BsCheckLg } from "react-icons/bs";
import { useSearchContext } from "../contexts/SearchContext";
import { useQuery } from "react-query";
import * as apiClient from "../api-client"
import { useState } from "react";
const Search = () => {
  const search = useSearchContext();
    const [page,setPage] = useState<number>(1);
    const searchParams = {
        destination: search.destination,
        rentStartDate: search.rentStartDate.toISOString(),
        rentEndDate:search.rentEndDate.toISOString(),
        tenantCount:search.tenantCount.toString(),
        page:page.toString(),
    }

  const { data: apartmentData } = useQuery(
    ["searchApartments", searchParams],
    () => apiClient.searchApartments(searchParams)
  );
  return <>Search Page</>;
};
export default Search;
