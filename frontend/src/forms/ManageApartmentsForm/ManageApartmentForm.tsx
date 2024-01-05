import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import TenantsSection from "./TenantsSection";
import ImagesSection from "./ImagesSection";

export type ApartmentFormData = {
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  pricePerMonth: number;
  Rating: number;
  facilities: string[];
  imageFiles: FileList;
  tenantCount: number;
};

type Props = {
    onSave: (apartmentFormData:FormData)=>void
    isLoading: boolean
}

const ManageApartmentForm = ({onSave,isLoading}:Props) => {
  const formMethods = useForm<ApartmentFormData>();
  const { handleSubmit } = formMethods;

  const onSubmit = handleSubmit((formDataJson: ApartmentFormData) => {
    const formData = new FormData();
    formData.append("name", formDataJson.name);
    formData.append("city", formDataJson.city);
    formData.append("country", formDataJson.country);
    formData.append("description", formDataJson.description);
    formData.append("type", formDataJson.type);
    formData.append("pricePerMonth", formDataJson.pricePerMonth.toString());
    formData.append("Rating", formDataJson.Rating.toString());
    formData.append("tenantCount", formDataJson.tenantCount.toString());

    formDataJson.facilities.forEach((facility, index) => [
      formData.append(`facilities[${index}]`, facility),
    ]);

    //Filelist not allows us to use foreach , thats why we use array here
    Array.from(formDataJson.imageFiles).forEach((imageFile)=>{
            formData.append(`imageFiles`,imageFile);
    })

    onSave(formData);

  });
  return (
    <FormProvider {...formMethods}>
      <form className="flex flex-col gap-10" onSubmit={onSubmit}>
        <DetailsSection />
        <TypeSection />
        <FacilitiesSection />
        <TenantsSection />
        <ImagesSection />
        <span className="flex justify-end">
          <button
          disabled={isLoading}
            type="submit"
            className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500"
          >
            {isLoading ? "Saving...":"Save"}
            
          </button>
        </span>
      </form>
    </FormProvider>
  );
};
export default ManageApartmentForm;
