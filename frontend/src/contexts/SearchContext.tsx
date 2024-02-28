import React, { useContext, useState } from "react";

type SearchContext = {
  destination: string;
  rentStartDate: Date;
  rentEndDate: Date;
  tenantCount: number;
  apartmentId: string;
  saveSearchValues: (
    destination: string,
    rentStartDate: Date,
    rentEndDate: Date,
    tenantCount: number
  ) => void;
};

const SearchContext = React.createContext<SearchContext | undefined>(undefined);

type SearchContextProviderProps = {
  children: React.ReactNode;
};

export const SearchContextProvider = ({
  children,
}: SearchContextProviderProps) => {
  const [destination, setDestination] = useState<string>("");
  const [rentStartDate, setRentStartDate] = useState<Date>(new Date());
  const [rentEndDate, setRentEndDate] = useState<Date>(new Date());
  const [tenantCount, setTenantCount] = useState<number>(1);
  const [apartmentId,setApartmentId] = useState<string>("");

  const saveSearchValues = (
    destination: string,
    rentStartDate: Date,
    rentEndDate: Date,
    tenantCount: number,
    apartmentId?:string
  ) => {
    setDestination(destination);
    setRentStartDate(rentStartDate);
    setRentEndDate(rentEndDate);
    setTenantCount(tenantCount);
    if(apartmentId){
        setApartmentId(apartmentId);
    }
  };

  return <SearchContext.Provider value={{
    destination,
    rentStartDate,
    rentEndDate,
    tenantCount,
    apartmentId,
    saveSearchValues, 
        
   
  }}>{children}</SearchContext.Provider>;
};

export const useSearchContext= ()=>{
    const context = useContext(SearchContext);
    return context as SearchContext;
}
