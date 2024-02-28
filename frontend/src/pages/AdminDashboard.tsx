import { useEffect, useState } from "react";
import { ApartmentType } from "../../../backend/src/shared/types";
import * as apiClient from "../api-client";
import ApprovedApartments from "../components/ApprovedApartments";
import { useAppContext } from "../contexts/AppContext";

const AdminDashboard = () => {
    const { isLoggedIn } = useAppContext();
    const [apartmentData, setApartmentData] = useState<ApartmentType[]>([]);
    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await apiClient.fetchInActiveApartments();
            setApartmentData(data);   
          } catch (error) {
          
            // Handle error if needed
          }
        };
        fetchData();
      }, []);
  
      const handleApprove = async (apartmentId) => {
        try {
            // Make API call to update apartment isActive to true
             await apiClient.updateApartmentStatus(apartmentId);
            // Update state to remove the activated apartment
            setApartmentData(apartmentData.filter(apartment => apartment._id !== apartmentId));
            
        } catch (error) {
            // Handle error if needed
        }
    };

    

    if (!apartmentData) {
      return <>Data not found</>;
    }
 
    return (
        <>
        {isLoggedIn && (
            <>
             
              {apartmentData.map((apartment) => (
                <ApprovedApartments key={apartment._id} apartment={apartment} onApprove={() => handleApprove(apartment._id)}/>
                
              ))}
              <br />
            </>
          )}
        
        </>


    );
}
export default AdminDashboard;