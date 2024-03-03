import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import {
  ApartmentType,
  PaymentIntentResponse,
  SearchReponse,
  UserType,
} from "../../backend/src/shared/types";
import { BookingFormData } from "./forms/BookingForm/BookingForm";
import { TempBookingFormData } from "./forms/UserForm/UserForm";
import { forgotPasswordData } from "./pages/ForgotPassword";
import { resetPassword } from "./pages/ResetPassword";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
export const validateToken = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
      credentials: "include",
    });

    if (!response.ok) {
      // Handle unauthorized access here
      return { error: "Unauthorized access" }; // Return an object indicating the error
    }

    // Check for a valid JSON response
    try {
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error("Failed to parse response data");
    }
  } catch (error) {
    console.error("Error validating token:", error);
    throw new Error("Failed to validate token");
  }
};
export const fetchCurrentUser = async (): Promise<UserType> => {
  const response = await fetch(`${API_BASE_URL}/api/users/me`, {
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === 404) {
      //return response.json();
      throw new Error("User not found");
    } else {
      throw new Error("Error Fetching User");
    }
  } else {
    return response.json();
  }
};

export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};

export const signIn = async (formData: SignInFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message);
  }
  return body;
};

//Forgot password api
export const forgotpassword = async (formData: forgotPasswordData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/forgot-password`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message);
  }
 
  return body;
};

export const getresetpassword = async (userId, token) => {
  const response = await fetch(`${API_BASE_URL}/api/users/reset-password/${userId}/${token}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message);
  }
  return body; // Return the parsed JSON response body
};

//Reset Password
//Forgot password api
export const resetpassword = async (userId: string, token: string, resetPasswordData: resetPassword) => {
  
  const response = await fetch(`${API_BASE_URL}/api/users/reset-password/${userId}/${token}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(resetPasswordData),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message);
  }
  return body;
};

export const signOut = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    credentials: "include",
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Error during sign out");
  }
};

export const addMyApartment = async (apartmentFormData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/my-apartments`, {
    method: "POST",
    credentials: "include",
    body: apartmentFormData,
  });
  if (!response.ok) {
    throw new Error("Failed to add Apartment");
  }
  return response.json();
};

export const getmyApartments = async (): Promise<ApartmentType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/my-apartments`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error fetching apartments");
  }
 
  return response.json();
};

export const fetchMyApartmentId = async (
  apartmentId: string
): Promise<ApartmentType> => {
  const response = await fetch(
    `${API_BASE_URL}/api/my-apartments/${apartmentId}`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Error fetching apartments");
  }
  return response.json();
};

export const fetchSuggestiveApartments = async (
  userId: string
): Promise<ApartmentType[]> => {
  const response = await fetch(
    `${API_BASE_URL}/api/apartments/suggestiveapartments/${userId}`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Error fetching apartments");
  }
  return response.json();
};
export const fetchAllApartments = async (): Promise<ApartmentType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/apartments/allapartments`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error fetching apartments");
  }
  return response.json();
};

//GET ALL APARTMENTS FOR 
export const getAllApartments = async (): Promise<ApartmentType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/apartments/getallapartments`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error fetching apartments");
  }
  return response.json();
};



//fetch inactive apartments
export const fetchInActiveApartments = async (): Promise<ApartmentType[]> => {
  const response = await fetch(
    `${API_BASE_URL}/api/apartments/inactiveapartments`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Error fetching apartments");
  }
  return response.json();
};

//Fetch by userId
export const fetchUserById = async (userid: string): Promise<UserType> => {
  const response = await fetch(`${API_BASE_URL}/api/users/${userid}`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error fetching User");
  }
  return response.json();
};

//Update Apartment Status
export const updateApartmentStatus = async (
  apartmentId: string
): Promise<ApartmentType> => {
  const response = await fetch(
    `${API_BASE_URL}/api/apartments/updateApartmentStatus/${apartmentId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Error Updating apartments");
  }
  return response.json();
};

//Update Apartment Reject Status
export const updateApartmentRejectStatus = async (
  apartmentId: string
): Promise<ApartmentType> => {
  const response = await fetch(
    `${API_BASE_URL}/api/apartments/updateApartmentRejectStatus/${apartmentId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Error Updating apartments");
  }
  return response.json();
};

//Insert data in Apartments in tempbookings array
export const createTempBooking = async (formData: TempBookingFormData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/apartments/${formData.apartmentId}/tempbookings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    }
  );

  if (!response.ok) {
    throw new Error("Error booking apartment");
  }
};

//Update user profile
export const updateProfile = async (userFormData: FormData) => {
  const userId = userFormData.get("userId");
  const firstName = userFormData.get("firstName");
  const lastName = userFormData.get("lastName");
  const email = userFormData.get("email");
  const userReligion = userFormData.get("userReligion");
  const password = userFormData.get("password");
  const userWalletAddress = userFormData.get("userWalletAddress");
  const requestBody = {
    userId,
    firstName,
    lastName,
    email,
    userReligion,
    password,
    userWalletAddress,
  };
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to update the user profile");
  }
  return response.json();
};

export const updateMyApartmentById = async (apartmentFormData: FormData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/my-apartments/${apartmentFormData.get("apartmentId")}`,
    {
      method: "PUT",
      body: apartmentFormData,
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update the apartment");
  }
  return response.json();
};

//delete booking record
export const deleteBooking = async (
  apartmentId: string,
  userId: string
): Promise<void> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/apartments/${apartmentId}/${userId}/deletebookings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add any additional headers if needed
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete  booking");
    }
  } catch (error) {
    console.error("Error deleting  booking:", error);
    throw new Error("Failed to delete  booking");
  }
};




//delete temp record
export const deleteTempBooking = async (
  apartmentId: string,
  userId: string
): Promise<void> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/apartments/${apartmentId}/deletetempbookings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add any additional headers if needed
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete temporary booking");
    }
  } catch (error) {
    console.error("Error deleting temporary booking:", error);
    throw new Error("Failed to delete temporary booking");
  }
};

export type SearchParams = {
  destination?: string;
  rentStartDate?: string;
  rentEndDate?: string;
  tenantCount?: string;
  page?: string;
  facilities?: string[];
  types?: string[];
  stars?: string[];
  maxPrice?: string;
  sortOption?: string;
};

export const searchApartments = async (
  searchParams: SearchParams
): Promise<SearchReponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append("destination", searchParams.destination || "");
  queryParams.append("rentStartDate", searchParams.rentStartDate || "");
  queryParams.append("rentEndDate", searchParams.rentEndDate || "");
  queryParams.append("tenantCount", searchParams.tenantCount || "");
  queryParams.append("page", searchParams.page || "");

  queryParams.append("maxPrice", searchParams.maxPrice || "");
  queryParams.append("sortOption", searchParams.sortOption || "");
  searchParams.facilities?.forEach((facility) =>
    queryParams.append("facilities", facility)
  );
  searchParams.types?.forEach((type) => queryParams.append("types", type));
  searchParams.stars?.forEach((star) => queryParams.append("stars", star));

  const response = await fetch(
    `${API_BASE_URL}/api/apartments/search?${queryParams}`
  );
  if (!response.ok) {
    throw new Error("Error Fetching Apartments");
  }
  return response.json();
};
export const fetchApartmentById = async (
  apartmentId: string
): Promise<ApartmentType> => {
  const response = await fetch(`${API_BASE_URL}/api/apartments/${apartmentId}`);
  if (!response.ok) {
    throw new Error("Error fetching Apartments");
  }

  return response.json();
};

export const createPaymentIntent = async (
  apartmentId: string,
  numberOfMonths: string
): Promise<PaymentIntentResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/api/apartments/${apartmentId}/bookings/payment-intent`,
    {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({ numberOfMonths }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Error fetching payment intent");
  }

  return response.json();
};

export const createRoomBooking = async (formData: BookingFormData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/apartments/${formData.apartmentId}/bookings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(formData),
    }
  );

  if (!response.ok) {
    throw new Error("Error booking apartment");
  }
};
export const getmyBookings = async (): Promise<ApartmentType[]> => {
  try {
    const response = await fetch(`http://localhost:3000/api/bookedapartments`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    throw new Error("Unable to fetch bookings");
  }
};

export const getApartmentById = async (apartmentId: string) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/bookedapartments/${apartmentId}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    throw new Error("Unable to fetch bookings");
  }
};
