import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from "../api-client";

export type forgotPasswordData = {
    email: string;
}

const ForgotPassword = () => {
    const {showToast} = useAppContext();

    // const queryClient = useQueryClient();
    const { register, formState:{errors} , handleSubmit } = useForm<forgotPasswordData>();
    const mutation = useMutation(apiClient.forgotpassword,{
        onSuccess:async ()=>{
            showToast({message:"Email Sent!",type:"SUCCESS"});
            // await queryClient.invalidateQueries("validateToken");
            
        }, onError:(error: Error)=>{
            showToast({message:error.message,type:"ERROR"})

        }
    });
    const onSubmit = handleSubmit((data)=>{
        mutation.mutate(data);
    })
return (
    <form className="flex flex-col items-center justify-center h-screen" style={{ backgroundColor: 'skyblue' }} onSubmit={onSubmit}>
    <div className="bg-white rounded-lg p-8 shadow-md">
        <h2 className="text-center text-3xl font-bold mb-5">Reset Password</h2>
        <label className="text-gray-700 text-sm font-bold w-full">
            Email
            <input
                type="email"
                className="border rounded w-full py-1 px-2 font-normal"
                {...register("email", { required: "This field is required" })}
            />
        </label>
        {errors.email && (
            <span className="text-red-500">{errors.email.message}</span>
        )}
        <button
            type="submit"
            className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl rounded-md mt-4"
        >
            Submit
        </button>
        <div className="text-center mt-3">
            <span className="text-sm">Not Registered? <Link className="underline" to="/register">Create an account here</Link></span>
        </div>
    </div>
</form>
)
}
export default ForgotPassword;