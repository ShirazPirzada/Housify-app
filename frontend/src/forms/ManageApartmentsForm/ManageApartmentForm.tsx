import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";

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

const ManageApartmentForm = () => {
  const formMethods = useForm<ApartmentFormData>();
  return (
    <FormProvider {...formMethods}>
      <form>
        <DetailsSection/>
      </form>
    </FormProvider>
  );
};
export default ManageApartmentForm;
