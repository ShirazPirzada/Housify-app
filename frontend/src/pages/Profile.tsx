import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserType } from "../../../backend/src/shared/types";

export type UserFormData = {
  firstName: string;
  lastName: string;
  email: string;
  userReligion: string;
  password: string;
  confirmPassword: string;
};

const Profile = () => {
  const formMethods = useForm<UserFormData>();

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const [isFormLoading, setIsFormLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null); // Define currentUser state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiClient.fetchCurrentUser();
        setIsFormLoading(false);
        localStorage.setItem("currentUser", JSON.stringify(data));
        setCurrentUser(data); // Update currentUser state here
        // Set default values to form fields once currentUser data is fetched
        Object.keys(data).forEach(key => {
          formMethods.setValue(key as keyof UserFormData, data[key]);
        });
      } catch (error) {
        setIsFormLoading(false);
        // Handle error if needed
      }
    };
    fetchData();
  }, [formMethods]);
  
  useEffect(() => {
    setIsFormLoading(typeof currentUser === "undefined");
  }, [currentUser]);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      // Parse stored user data if available
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []); // Empty dependency array to ensure it runs only once on component mount



  const { mutate, isLoading } = useMutation(apiClient.updateProfile, {
    onSuccess: async () => {
      showToast({ message: "Profile Updated!", type: "SUCCESS" });
      await queryClient.invalidateQueries("validateToken");
      navigate("/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const { register, handleSubmit, watch, formState: { errors } } = formMethods;

  const onSubmit = handleSubmit((formData: UserFormData) => {
    const { confirmPassword, ...restFormData } = formData;
    const formDataToSend = new FormData();
    if (currentUser) {
      formDataToSend.append("userId", currentUser._id);
    }
    Object.entries(restFormData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    mutate(formDataToSend);
  });

  return (
    <>
      {isFormLoading ? (
        <div>Loading....</div>
      ) : (
        <>
          <div>
            <h1 className="text-3xl font-bold">Profile - Update</h1><br></br>
          </div>
          <FormProvider {...formMethods}>
            <form className="flex flex-col gap-5 px-4 sm:px-0" onSubmit={onSubmit}>
              <div className="flex flex-col md:flex-row gap-5">
                <label className="text-gray-700 text-sm font-bold flex-1">
                  First Name
                  <input
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("firstName", {
                      required: "This field is required",
                    })}
                  />
                  {errors.firstName && (
                    <span className="text-red-500">{errors.firstName.message}</span>
                  )}
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                  Last Name
                  <input
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("lastName", {
                      required: "This field is required",
                    })}
                  />
                  {errors.lastName && (
                    <span className="text-red-500">{errors.lastName.message}</span>
                  )}
                </label>
              </div>
              <label className="text-gray-700 text-sm font-bold flex-1">
                Email
                <input
                  type="email"
                  className="border rounded w-full py-1 px-2 font-normal"
                  {...register("email", { required: "This field is required" })}
                />
                {errors.email && (
                  <span className="text-red-500">{errors.email.message}</span>
                )}
              </label>
  
              <label className="text-gray-700 text-sm font-bold flex-1">
                Religion
                <select
                  className="border rounded w-full py-1 px-2 font-normal"
                  {...register("userReligion", {
                    required: "Religion is Required",
                  })}
                >
                  <option value="">Select Religion</option>
                  <option value="Islam">Islam</option>
                  <option value="Hindi">Hindu</option>
                  <option value="Christanity">Christanity</option>
                </select>
                {errors.userReligion && (
                  <span className="text-red-500">
                    {errors.userReligion.message}
                  </span>
                )}
              </label>
              <label className="text-gray-700 text-sm font-bold flex-1">
                Password
                <input
                  type="password"
                  className="border rounded w-full py-1 px-2 font-normal"
                  {...register("password", {
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                {errors.password && errors.password.type === "minLength" && (
                  <span className="text-red-500">{errors.password.message}</span>
                )}
              </label>
              <label className="text-gray-700 text-sm font-bold flex-1">
                Confirm Password
                <input
                  type="password"
                  className="border rounded w-full py-1 px-2 font-normal"
                  {...register("confirmPassword", {
                    validate: (val) => {
                      if (watch("password") !== val) {
                        return "Your passwords do not match";
                      }
                    },
                  })}
                />
                {errors.confirmPassword && (
                  <span className="text-red-500">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </label>
              <span className="flex justify-end">
                <button
                  disabled={isLoading}
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </span>
            </form>
          </FormProvider>
        </>
      )}
    </>
  );
  
};

export default Profile;
