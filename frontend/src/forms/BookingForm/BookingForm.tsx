import { useForm } from "react-hook-form";
import * as apiClient from "../../api-client";
// import { Contract, ethers } from "ethers";


import {
  PaymentIntentResponse,
  UserType,
} from "../../../../backend/src/shared/types";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useSearchContext } from "../../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { useMutation } from "react-query";
import { StripeCardElement } from "@stripe/stripe-js";
import { useState } from "react";
// import { ethers } from "ethers"; // Import ethers library here
import * as ethers from "ethers";
// import { StripeCardElement } from "@stripe/stripe-js";
type Props = {
  currentUser: UserType;
  paymentIntent: PaymentIntentResponse;
};

export type BookingFormData = {
  firstName: string;
  lastName: string;
  email: string;
  tenantCount: number;
  rentStartDate: string;
  rentEndDate: string;
  apartmentId: string;
  paymentIntentId: string;
  totalCost: number;
};

const BookingForm = ({ currentUser, paymentIntent }: Props) => {
  let [account, setAccount] = useState("");
  // let [contractData, setContractData] = useState("");
  let [walletConnected, setWalletConnected] = useState(false);
  let [insufficientBalance, setInsufficientBalance] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  
  const search = useSearchContext();
  const { apartmentId } = useParams();
  const { showToast } = useAppContext();

  const { mutate: bookRoom, isLoading } = useMutation(
    apiClient.createRoomBooking,
    {
      onSuccess: () => {
        showToast({ message: "Apartment Booking Saved!", type: "SUCCESS" });
      },
      onError: () => {
        showToast({ message: "Error saving booking", type: "ERROR" });
      },
    }
  );

  const { handleSubmit, register } = useForm<BookingFormData>({
    defaultValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      tenantCount: search.tenantCount,
      rentStartDate: search.rentStartDate.toISOString(),
      rentEndDate: search.rentEndDate.toISOString(),
      apartmentId: apartmentId,
      totalCost: paymentIntent.totalCost,
      paymentIntentId: paymentIntent.paymentIntentId,
    },
  });

  const onSubmit = async (formData: BookingFormData) => {
    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement) as StripeCardElement,
      },
    });

    if (result.paymentIntent?.status === "succeeded") {
      bookRoom({ ...formData, paymentIntentId: result.paymentIntent.id });
    }
  };
  // const { ethereum } = window;
  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        setWalletConnected(true);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask extension");
    }
  };

  const confirmBooking = async () => {
    if (!walletConnected) {
      alert("Please connect your wallet first");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const ContractAddress = "0x0F3063A7e4ae0BeAE2853F21b818E3D5F22881Ba";
    const ABI = [
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint256",
            name: "rentalId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "address",
            name: "landlord",
            type: "address",
          },
          {
            indexed: false,
            internalType: "address",
            name: "tenant",
            type: "address",
          },
        ],
        name: "ApartmentRented",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_rentalId",
            type: "uint256",
          },
        ],
        name: "cancelRental",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "nextRentalId",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_rentStartDate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_rentEndDate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_amount",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "_tenantWallet",
            type: "address",
          },
          {
            internalType: "address",
            name: "_landlordWallet",
            type: "address",
          },
          {
            internalType: "string",
            name: "_tenantName",
            type: "string",
          },
          {
            internalType: "string",
            name: "_landlordName",
            type: "string",
          },
          {
            internalType: "string",
            name: "_apartmentName",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "_apartmentId",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "_location",
            type: "string",
          },
        ],
        name: "rentApartment",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "rentals",
        outputs: [
          {
            internalType: "uint256",
            name: "rentStartDate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "rentEndDate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "tenantWallet",
            type: "address",
          },
          {
            internalType: "address",
            name: "landlordWallet",
            type: "address",
          },
          {
            internalType: "string",
            name: "tenantName",
            type: "string",
          },
          {
            internalType: "string",
            name: "landlordName",
            type: "string",
          },
          {
            internalType: "string",
            name: "apartmentName",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "apartmentId",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "location",
            type: "string",
          },
          {
            internalType: "bool",
            name: "active",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ];
    const contract = new ethers.Contract(ContractAddress, ABI, signer);

    const tenantBalance = await provider.getBalance(account);
    const tenantBalanceEth = tenantBalance.toString();

    // Example amount in Ether (Sepolia network)
    const ethAmount = ethers.parseEther("0.0004");
    // Compare tenant balance with ethAmount
    if (parseFloat(tenantBalanceEth) >= ethAmount) {
      console.log("Tenant has sufficient balance.");
      
    } else {
      console.log("Tenant does not have sufficient balance.");
      
    }

    console.log("Tenant Balance: ", tenantBalance);
    if (parseFloat(tenantBalanceEth) < ethAmount) {
      setInsufficientBalance(true);
      return;
    }

    try {
      //Test data

      const rentStartDate = 1644710400; // Example start date (Unix timestamp)
      const rentEndDate = 1647302400; // Example end date (Unix timestamp)
      //const totalCost = ethers.parseEther("0.0004"); // Example total cost in sepolia eth (string)
      const totalCostInWei = ethers.parseEther("0.0020"); // Convert 0.0020 Ether to wei
      const tenantWalletAddress = "0x86A0EE2555bB7DA4C5774b289850963035132ce0";
      // Example tenant's wallet address
      const landlordWalletAddress =
        "0x398021A6A8f8E189d328E3458030f6F150Cde3fc"; // Example landlord's wallet address
      const tenantName = "John Doe"; // Example tenant's name
      const landlordName = "Jane Smith"; // Example landlord's name
      const apartmentName = "Apartment 123"; // Example apartment name
      const apartmentId = 123; // Example apartment ID
      const location = "New York"; // Example location

      // const totalCostBigInt = BigInt(totalCost); // Convert totalCost to BigInt

      const txResponse = await contract.rentApartment(
        rentStartDate,
        rentEndDate,
        totalCostInWei,
        tenantWalletAddress,
        landlordWalletAddress,
        tenantName,
        landlordName,
        apartmentName,
        apartmentId,
        location,
        { value: totalCostInWei } // specify the value to send with the transaction

      );
      await txResponse.wait();
      showToast({ message: "Apartment Booking Saved!", type: "SUCCESS" });
    } catch (error) {
      console.error("Error confirming booking:", error);
      showToast({ message: "Error saving booking", type: "ERROR" });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5"
    >
      <div>
        {/* Connect Wallet button */}
        {!walletConnected && (
          <button
            onClick={connectWallet}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Connect your Wallet
          </button>
        )}
        {/* Confirm Booking button */}
        {walletConnected && (
          <button
            onClick={confirmBooking}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Confirm Booking
          </button>
        )}
         {/* Insufficient balance message */}
      {insufficientBalance && (
        <p className="text-red-500">Insufficient balance to make this rent.</p>
      )}
      </div>
      <span className="text-3xl font-bold">Confirm Your Details</span>
      <div className="grid grid-cols-2 gap-6">
        <label className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("firstName")}
          />
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Last Name
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("lastName")}
          />
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Email
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("email")}
          />
        </label>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Your Price Summary</h2>

        <div className="bg-blue-200 p-4 rounded-md">
          <div className="font-semibold text-lg">
            Token Cost: Rs {paymentIntent.totalCost}
          </div>
          <div className="text-xs">Includes taxes and charges</div>
        </div>
      </div>

      {/* CC here */}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold"> Payment Details</h3>
        <CardElement
          id="payment-element"
          className="border rounded-md p-2 text-sm"
        />
      </div>

      <div className="flex justify-end">
        <button
          disabled={isLoading}
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-md disabled:bg-gray-500"
        >
          {isLoading ? "Saving..." : "Confirm Booking"}
        </button>
      </div>
    </form>
  );
};
export default BookingForm;
