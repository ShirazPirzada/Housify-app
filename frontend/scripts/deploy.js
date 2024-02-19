
import hre from "hardhat";

const RentalAgreement = await hre.ethers.getContractFactory("RentalSmartContract");
const rentalAgreement = await RentalAgreement.deploy();

await rentalAgreement.waitForDeployment();
console.log(rentalAgreement);
console.log("Rental Contract deployed to:",rentalAgreement);
