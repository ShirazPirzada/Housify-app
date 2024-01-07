import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import { ApartmentType, SearchReponse } from "../../backend/src/shared/types";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

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
