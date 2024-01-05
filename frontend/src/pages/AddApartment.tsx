import { useMutation } from "react-query";
import ManageApartmentForm from "../forms/ManageApartmentsForm/ManageApartmentForm";
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from "../api-client";

const AddApartment = () => {
    const {showToast} = useAppContext();
    const {mutate,isLoading} = useMutation(apiClient.addMyApartment,{
        onSuccess:()=>{
            showToast({message: "Apartment Saved",type:"SUCCESS"})
        },
        onError:()=>{
            showToast({message:"Error Saving Apartment",type:"ERROR"})
        }
    });

    const handleSave = (apartmentFormData: FormData)=>{
        mutate(apartmentFormData);
    }

  return <ManageApartmentForm onSave={handleSave} isLoading={isLoading} />;
};

export default AddApartment;
