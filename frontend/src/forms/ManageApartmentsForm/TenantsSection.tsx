import { useFormContext } from "react-hook-form";
import { ApartmentFormData } from "./ManageApartmentForm";

const TenantsSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<ApartmentFormData>();
  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Tenants</h2>
      <div className="grid grid-cols-1 max-w-[50%] p-6 gap-5 bg-gray-300">
        <label className="text-gray-700 text-sm font-semibold">
          Tenants
          <input
            className="border rounded w-full py-2 px-3 font-normal"
            type="number"
            min={1}
            {...register("tenantCount", {
              required: "This field is required",
            })}
          />
          {errors.tenantCount?.message && (
          <span className="text-red-500 text-sm fold-bold">
            {errors.tenantCount?.message}
          </span>
          )} 
        </label>
      </div>
    </div>
  );
};
export default TenantsSection;