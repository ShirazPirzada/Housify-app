import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import ManageApartmentForm from "../forms/ManageApartmentsForm/ManageApartmentForm";
import { useAppContext } from "../contexts/AppContext";
const EditApartment = () => {
    const {showToast} = useAppContext();

  const { apartmentId } = useParams();
  const { data: apartment } = useQuery(
    "fetchMyApartmentId",
    () => apiClient.fetchMyApartmentId(apartmentId || ""),
    {
      //this query only going to run if it has apartmentId
      enabled: !!apartmentId,
    }
  );
  const {mutate,isLoading} = useMutation(apiClient.updateMyApartmentById,{
    onSuccess:()=>{
        showToast({message: "Apartment Updated!",type:"SUCCESS"})
    },
    onError:()=>{
        showToast({message:"Error Updating Apartment",type:"ERROR"})

    }
  });

  const handleSave = (aparmentFormData:FormData)=>{
    mutate(aparmentFormData);
  }

  return <ManageApartmentForm apartment={apartment} onSave={handleSave} isLoading={isLoading}/>
};
export default EditApartment;