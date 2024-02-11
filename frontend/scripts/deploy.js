
import hre from "hardhat";

const RentalAgreement = await hre.ethers.getContractFactory("RentalAgreement");
const rentalAgreement = await RentalAgreement.deploy();

await rentalAgreement.waitForDeployment();
console.log(rentalAgreement);
console.log("Flower deployed to:",rentalAgreement);
