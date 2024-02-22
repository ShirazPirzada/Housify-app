import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import { ApartmentType, PaymentIntentResponse, SearchReponse, UserType } from "../../backend/src/shared/types";
import { BookingFormData } from "./forms/BookingForm/BookingForm";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const fetchCurrentUser = async ():Promise<UserType> => {
  const response = await fetch(`${API_BASE_URL}/api/users/me`, {
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error("Error Fetching User");
  }
  return response.json();
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

export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error("Token invalid");
  }
  return response.json();
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

export const fetchSuggestiveApartments = async(userId:string):Promise<ApartmentType[]>=>{
  const response = await fetch(`${API_BASE_URL}/api/apartments/suggestiveapartments/${userId}`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error fetching apartments");
  }
  return response.json();
}
export const fetchAllApartments = async():Promise<ApartmentType[]>=>{
  const response = await fetch(`${API_BASE_URL}/api/apartments/allapartments`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Error fetching apartments");
  }
  return response.json();
}
//Fetch by userId
export const fetchUserById = async (
  userid: string
): Promise<UserType> => {
  const response = await fetch(
    `${API_BASE_URL}/api/users/${userid}`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Error fetching User");
  }
  return response.json();
};

//Update user profile 
export const updateProfile = async (userFormData: FormData) => {
  
  const userId = userFormData.get("userId");
  const firstName = userFormData.get("firstName");
  const lastName = userFormData.get("lastName");
  const email = userFormData.get("email");
  const userReligion = userFormData.get("userReligion");
  const password = userFormData.get("password");
  const requestBody = {
    userId,
    firstName,
    lastName,
    email,
    userReligion,
    password,
  };
  const response = await fetch(
    `${API_BASE_URL}/api/users/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      credentials: "include",
    }
  );

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
    const response = await fetch( `${API_BASE_URL}/api/bookedapartments/${apartmentId}`, {
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