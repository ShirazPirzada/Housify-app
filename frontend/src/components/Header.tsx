import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SIgnOutButton";
import * as apiClient from "../api-client"
import { useEffect, useState } from "react";
import { UserType } from "../../../backend/src/shared/types";
const Header = () => {
  const { isLoggedIn } = useAppContext();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null); // Define currentUser state

 
useEffect(()=>{
  const fetchData = async () => {
    try {
      const data = await apiClient.fetchCurrentUser();
      setCurrentUser(data); // Update currentUser state here
      
    } catch (error) {
      
    }
  };
  fetchData();
},[])
  const userType = currentUser?.userType;

  return (
    <div className="bg-blue-800 py-6">
      <div className="container mx-auto flex justify-between">
        <span className="text-3xl text-white font-bold tracking-tight">
          <Link to="/">Housify.com</Link>
        </span>
        <span className="flex space-x-2">
          {isLoggedIn ? (
            <>
            {/* {userType === 'customer' && (
           
            )} */}
               <Link
                className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
                to="/bookedapartments"
              >
                My Bookings
              </Link>
            {userType === 'landlord' && (
              <Link
                className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
                to="/my-apartments"
              >
                My Apartments
              </Link>
            )}
            <Link
                className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
                to="/updateProfile"
              >
                My Profile
              </Link>
            <SignOutButton />
          </>
          ) : (
            <Link
              to="/sign-in"
              className="flex bg-white items-center text-blue-600 px-3 font-bold hover:bg-gray-100"
            >
              Sign In
            </Link>
          )}
        </span>
      </div>
    </div>
  );
};

export default Header;