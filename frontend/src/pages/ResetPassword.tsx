import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from "../api-client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export type resetPassword = {
  password: string;
  confirmPassword: string;
};

const ResetPassword = () => {
  const { showToast } = useAppContext();
  const { userId, token } = useParams();
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<resetPassword>();

  const onSubmit = handleSubmit(async (data) => {
    if (userId && token) {
      try {
        await apiClient.resetpassword(userId, token, data);
        showToast({ message: "Password Reset Successfully!", type: "SUCCESS" });
      } catch (error) {
        showToast({ message: "Failed to Reset The password", type: "ERROR" });
      }
    } else {
      showToast({ message: "User ID or token is undefined", type: "ERROR" });
    }
  });
  const [isTokenValid, setIsTokenValid] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.getresetpassword(userId, token);
        

        // Check if the response message indicates a valid token
        if (response.message === "Token Valid") {
          setIsTokenValid(true);
        } else {
          setIsTokenValid(false);
        }
      } catch (error) {
        console.error("Error resetting password: ", error);
      }
    };

    fetchData();
  }, [userId, token]);

  return (
    <>
      {isTokenValid ? (
        <form
          className="flex flex-col items-center justify-center h-screen"
          style={{ backgroundColor: "skyblue" }}
          onSubmit={onSubmit}
        >
          <div className="bg-white rounded-lg p-8 shadow-md">
            <h2 className="text-3xl font-bold mb-5">Reset Password</h2>

            <label className="text-gray-700 text-sm font-bold flex-1 w-full">
              New Password
              <input
                type="password"
                className="border rounded w-full py-1 px-2 font-normal"
                {...register("password", {
                  required: "This field is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <span className="text-red-500">{errors.password.message}</span>
              )}
            </label>

            <label className="text-gray-700 text-sm font-bold flex-1 w-full">
              Confirm Password
              <input
                type="password"
                className="border rounded w-full py-1 px-2 font-normal"
                {...register("confirmPassword", {
                  validate: (val) => {
                    if (!val) {
                      return "This field is required";
                    } else if (watch("password") !== val) {
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

            <span className="flex items-center justify-between w-full">
              <span className="text-sm">
                Already Registered ?
                <Link className="underline" to="/sign-in">
                  {" "}
                  Login here
                </Link>
              </span>
              <button
                type="submit"
                className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl rounded mt-4"
              >
                Reset Password
              </button>
            </span>
          </div>
        </form>
      ) : (
        <div
          style={{
            backgroundColor: "skyblue",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p>Token is expired or invalid.</p>
        </div>
      )}
    </>
  );
};
export default ResetPassword;
