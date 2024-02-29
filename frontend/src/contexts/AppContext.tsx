import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from '../api-client';
import {loadStripe,Stripe} from "@stripe/stripe-js"

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY || "";


type ToastMessage = {
    message: string;
    type: "SUCCESS" | "ERROR";
}

type AppContext  = {
    showToast: (toastMessage: ToastMessage)=>void;
    isLoggedIn:boolean;
    stripePromise: Promise<Stripe | null>;
    userId:string;
}


//First Time load , it will be undefined
const AppContext = React.createContext<AppContext | undefined>(undefined);

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

export const AppContextProvider = ({children}:{
    children:React.ReactNode
})=>{
    const [toast,setToast] = useState<ToastMessage | undefined>(undefined);
    
    const {data, isError} = useQuery("validateToken",apiClient.validateToken,{
        retry:false,
    });
  
   // Destructure userId from data if data is defined
    const { userId } = data || {};
    // Determine isLoggedIn based on the data and isError
    const _isLoggedIn = !isError && !!data && !data.error;

      // Show loading state if data is not available yet
      if (data === undefined) {
        return <div>Loading...</div>;
    }
    return (
        <AppContext.Provider value={{
            showToast: (toastMessage) => {
               setToast(toastMessage);
            },
            isLoggedIn: _isLoggedIn,
            stripePromise,
            userId
        }}>
            {toast && (<Toast message={toast.message} type={toast.type} onClose={()=>setToast(undefined)}/>)}
            {children}</AppContext.Provider>
    )
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    return context as AppContext;
}