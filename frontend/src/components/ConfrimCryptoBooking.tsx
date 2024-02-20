import { useEffect, useState } from "react";
import * as apiClient from "../api-client";
import * as ethers from "ethers";
import {
  PaymentIntentResponse,
  UserType,
} from "../../../backend/src/shared/types";
import { useParams } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { useMutation } from "react-query";
import { BookingFormData } from "../forms/BookingForm/BookingForm";
import ETHLIVEPRICE from './ETHLIVEPRICE'; // Import the fetchETHPrice function

type Props = {
  currentUser: UserType;
  paymentIntent: PaymentIntentResponse;
  rentStartDate: Date;
  rentEndDate: Date;
  handleCallBackMsg: (msg: string) => void;
  formData: BookingFormData;
};
const ConfirmBookingComponent = ({
  currentUser,
  paymentIntent,
  rentStartDate,
  rentEndDate,
  formData,
}: Props) => {
  console.log("FORM DATA: ", formData);
  const { showToast } = useAppContext();
  const { apartmentId } = useParams();
  const _aptId = apartmentId;
  const [walletConnected, setWalletConnected] = useState(false);
  const [insufficientBalance, setInsufficientBalance] = useState(false);
  const [account, setAccount] = useState("");
  const [landLordId, setLandLordId] = useState("");
  const [_apartmentName, setApartmentName] = useState("");
  const [_location, setLocation] = useState("");
  const [landLordName, setLandLordName] = useState("");
  const _rentStartDatenew = rentStartDate;
  const _rentEndDatenew = rentEndDate;
  const [Liveprice, setLivePrice] = useState(0);
  const apiKey = 'CG-GJtQCf5gVtoSZyRtVnY6Do9R	'; // Replace 'YOUR_API_KEY' with your actual API key

  useEffect(() => {

    const getPrice = async () => {
      const ethPrice = await ETHLIVEPRICE(apiKey);
      setLivePrice(ethPrice);
    };
    getPrice();

    const fetchApartmentData = async () => {
      try {
        const apartmentDataFromApi = await apiClient.getApartmentById(
          apartmentId || ""
        );

        setLandLordId(apartmentDataFromApi?.userId);
        setApartmentName(apartmentDataFromApi?.name);
        setLocation(apartmentDataFromApi?.city);
      } catch (error) {
        console.error("Error fetching apartment data:", error);
      }
    };

    const fetchLandLordData = async () => {
      try {
        const LandLordData = await apiClient.fetchUserById(landLordId || "");

        setLandLordName(LandLordData?.firstName);
      } catch (error) {
        console.error("Error fetching landlord data:", error);
      }
    };

    if (!!apartmentId) {
      fetchApartmentData();
    }

    if (!!landLordId) {
      fetchLandLordData();
    }
  }, [apartmentId, landLordId,apiKey]);
  const { mutate: bookRoom } = useMutation(
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
    const ContractAddress = "0x5759c75072c2956Fb56c33f843D86411F3fBE28F";
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
            internalType: "string",
            name: "_apartmentId",
            type: "string",
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

    
    // Convert PKR amount to ETH
    const pkrAmount = paymentIntent.totalCost; // Amount in PKR
    const exchangeRate = Liveprice; // Hypothetical exchange rate: 1 ETH = 806,998.96 INR
    const ethAmount = pkrAmount / exchangeRate; // Equivalent amount in ETH

    // Convert ETH amount to Wei
    const ethAmountInWei = ethers.parseEther(ethAmount.toString());
    var ethAmountInString = ethAmountInWei.toString();


    if (parseFloat(tenantBalanceEth) < parseFloat(ethAmountInString)) {
      setInsufficientBalance(true);
      return;
    }

    try {
      const _rStartDate = new Date(_rentStartDatenew); // Parse string to Date object
      const _newRentStartDate = Math.floor(_rStartDate.getTime() / 1000);
      const _rentEndDateBeforeConversion = new Date(_rentEndDatenew); //
      const _rentEndDate = Math.floor(
        _rentEndDateBeforeConversion.getTime() / 1000
      );
      const rentStartDate = _newRentStartDate; // Example start date (Unix timestamp)
      const rentEndDate = _rentEndDate; // Example end date (Unix timestamp)
      const totalCost = ethers.parseEther(ethAmount.toString()); // Example total cost in sepolia eth (string)
      const totalCostInWei = totalCost; // Convert 0.0020 Ether to wei
      const tenantWalletAddress = "0x86A0EE2555bB7DA4C5774b289850963035132ce0";
      // Example tenant's wallet address
      const landlordWalletAddress =
        "0x398021A6A8f8E189d328E3458030f6F150Cde3fc"; // Example landlord's wallet address
      const tenantName = currentUser.firstName; // Example tenant's name
      const landlordName = landLordName; // Example landlord's name
      const apartmentName = _apartmentName; // Example apartment name
      const apartmentId = _aptId; // Example apartment ID
      const location = _location; // Example location


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
     
      bookRoom({ ...formData});
    } catch (error) {
      console.error("Error confirming booking:", error);
      showToast({ message: "Error saving booking", type: "ERROR" });
    }
  };

  return (
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
  );
};

export default ConfirmBookingComponent;
