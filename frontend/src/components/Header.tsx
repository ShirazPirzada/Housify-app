import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SIgnOutButton";
import * as apiClient from "../api-client"
import { useEffect, useState } from "react";
import { UserType } from "../../../backend/src/shared/types";

const Header = () => {
  const { isLoggedIn } = useAppContext();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null); // Define currentUser state
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Define fetchData function
    const fetchData = async () => {
      try {
        const data = await apiClient.fetchCurrentUser();
        setCurrentUser(data); // Update currentUser state here
      } catch (error) {
        // Handle errors if needed
      }
    };
  
    // Run fetchData only when the user is logged in
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]); // Run effect when isLoggedIn changes
  
  let userType:any ;
  
  if(isLoggedIn){
    userType= currentUser?.userType;
  }

  return (
    <div className="bg-blue-800 py-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-3xl text-white font-bold tracking-tight px-4 sm:px-0">
          <Link to="/">Housify.com</Link>
        </div>
        {/* Hamburger Menu for Mobile View */}
        <div className="lg:hidden">
          <button className="text-white" onClick={() => setMenuOpen(!menuOpen)}>
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
        {/* Sidebar Links */}
        <div className={`fixed top-0 left-0 h-full bg-blue-800 text-white w-48 lg:hidden z-50 ${menuOpen ? 'block' : 'hidden'}`}>
          <div className="p-4">
            {isLoggedIn ? (
              <>
                <Link
                  className="block py-2 px-4 font-bold hover:bg-blue-600 rounded"
                  to="/bookedapartments"
                  onClick={() => setMenuOpen(false)}
                >
                  My Bookings
                </Link>
                {userType === "landlord" && (
                  <Link
                    className="block py-2 px-4 font-bold hover:bg-blue-600 rounded"
                    to="/my-apartments"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Apartments
                  </Link>
                )}
                <Link
                  className="block py-2 px-4 font-bold hover:bg-blue-600 rounded"
                  to="/updateProfile"
                  onClick={() => setMenuOpen(false)}
                >
                  My Profile
                </Link>
                <SignOutButton />
              </>
            ) : (
              <Link
                to="/sign-in"
                className="block py-2 px-4 font-bold hover:bg-gray-100 rounded"
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
        {/* Desktop Links */}
        <div className="hidden lg:flex lg:space-x-2">
          {isLoggedIn ? (
            <>
              <Link
                className="text-white font-bold hover:bg-blue-600 px-3 py-1 rounded-md"
                to="/bookedapartments"
              >
                My Bookings
              </Link>
              {userType === "landlord" && (
                <Link
                  className="text-white font-bold hover:bg-blue-600 px-3 py-1 rounded-md"
                  to="/my-apartments"
                >
                  My Apartments
                </Link>
              )}
              <Link
                className="text-white font-bold hover:bg-blue-600 px-3 py-1 rounded-md"
                to="/updateProfile"
              >
                My Profile
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              to="/sign-in"
              className="bg-white text-blue-600 font-bold hover:bg-gray-100 px-3 py-1 rounded-md"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
