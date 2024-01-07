import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { useSearchContext } from "../../contexts/SearchContext";
import { useAppContext } from "../../contexts/AppContext";
import { useLocation, useNavigate } from "react-router-dom";
type Props = {
    apartmentId: string;
    pricePerMonth: number;
  };
  
  type UserFormData = {
    startDate: Date;
    endDate: Date;
    tenantCount: number;
  };
  
  const UserForm = ({ apartmentId, pricePerMonth }: Props) => {
    const search = useSearchContext();
    const { isLoggedIn } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();
  
    const {
      watch,
      register,
      handleSubmit,
      setValue,
      formState: { errors },
    } = useForm<UserFormData>({
      defaultValues: {
        startDate: search.rentStartDate,
        endDate: search.rentEndDate,
    
        tenantCount: search.tenantCount,
      },
    });
  
    const startDate = watch("startDate");
    const endDate = watch("endDate");
  
    const minDate = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
  
    const onSignInClick = (data: UserFormData) => {
      search.saveSearchValues(
        "",
        data.startDate,
        data.endDate,
        data.tenantCount,
      
      );
      navigate("/sign-in", { state: { from: location } });
    };
  
    const onSubmit = (data: UserFormData) => {
      search.saveSearchValues(
        "",
        data.startDate,
        data.endDate,
        data.tenantCount,
      );
      navigate(`/apartment/${apartmentId}/booking`);
    };
  
    return (
      <div className="flex flex-col p-4 bg-blue-200 gap-4">
        <h3 className="text-md font-bold">Rs {pricePerMonth}</h3>
        <form
          onSubmit={
            isLoggedIn ? handleSubmit(onSubmit) : handleSubmit(onSignInClick)
          }
        >
          <div className="grid grid-cols-1 gap-4 items-center">
            <div>
              <DatePicker
                required
                selected={startDate}
                onChange={(date) => setValue("startDate", date as Date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                minDate={minDate}
                maxDate={maxDate}
                placeholderText="Start Date"
                className="min-w-full bg-white p-2 focus:outline-none"
                wrapperClassName="min-w-full"
              />
            </div>
            <div>
              <DatePicker
                required
                selected={endDate}
                onChange={(date) => setValue("endDate", date as Date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                minDate={minDate}
                maxDate={maxDate}
                placeholderText="End Date"
                className="min-w-full bg-white p-2 focus:outline-none"
                wrapperClassName="min-w-full"
              />
            </div>
            <div className="flex bg-white px-2 py-1 gap-2">
              <label className="items-center flex">
                Tenant:
                <input
                  className="w-full p-1 focus:outline-none font-bold"
                  type="number"
                  min={1}
                  max={10}
                  {...register("tenantCount", {
                    required: "This field is required",
                    min: {
                      value: 1,
                      message: "There must be at least one tenant",
                    },
                    valueAsNumber: true,
                  })}
                />
              </label>
              
              {errors.tenantCount && (
                <span className="text-red-500 font-semibold text-sm">
                  {errors.tenantCount.message}
                </span>
              )}
            </div>
            {isLoggedIn ? (
              <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl">
                Book Now
              </button>
            ) : (
              <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl">
                Sign in to Book
              </button>
            )}
          </div>
        </form>
      </div>
    );
  };
  
  export default UserForm;