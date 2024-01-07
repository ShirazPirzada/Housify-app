import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SIgnOutButton";
import { useQuery } from "react-query";
import * as apiClient from "../api-client"
const Header = () => {
  const { isLoggedIn } = useAppContext();

  const { data: currentUser } = useQuery(
    "fetchCurrentUser",
    apiClient.fetchCurrentUser
  );

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
            {userType === 'customer' && (
              <Link
                className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
                to="/my-bookings"
              >
                My Bookings
              </Link>
            )}
            {userType === 'landlord' && (
              <Link
                className="flex items-center text-white px-3 font-bold hover:bg-blue-600"
                to="/my-apartments"
              >
                My Apartments
              </Link>
            )}
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
