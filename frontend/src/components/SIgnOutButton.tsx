import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

const SignOutButton = () => {
    const queryClient = useQueryClient();
    const { showToast } = useAppContext();
    const navigate = useNavigate();
    const mutation = useMutation(apiClient.signOut, {
        onSuccess: async () => {
            await queryClient.invalidateQueries("validateToken");
            showToast({ message: "Signed Out!", type: "SUCCESS" });
            navigate("/");
        }, onError: (error: Error) => {
            showToast({ message: error.message, type: "ERROR" });
        }
    });

    const handleClick = () => {
        mutation.mutate();
    }
    return (
        <button onClick={handleClick} className="bg-white text-blue-600 font-bold hover:bg-gray-100 px-3 py-1 rounded-md">
            Sign Out
        </button>
    )
};

export default SignOutButton;