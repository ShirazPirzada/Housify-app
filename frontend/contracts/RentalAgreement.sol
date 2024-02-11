// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
contract RentalAgreement {
    struct Rental {
        uint256 rentStartDate;
        uint256 rentEndDate;
        uint256 amount;
        address tenantWallet;
        address landlordWallet; // Added landlord's wallet address
        string tenantName;
        string landlordName; // Added landlord's name
        string apartmentName;
        uint256 apartmentId;
        string location;
        bool active;
    }

    mapping(uint256 => Rental) public rentals;
    uint256 public nextRentalId = 1;

    event ApartmentRented(uint256 rentalId, uint256 amount, address landlord, address tenant);

    modifier onlyTenant(uint256 _rentalId) {
        require(msg.sender == rentals[_rentalId].tenantWallet, "Only tenant can perform this action");
        _;
    }

    function rentApartment(
        uint256 _rentStartDate,
        uint256 _rentEndDate,
        uint256 _amount,
        address _tenantWallet,
        address _landlordWallet, // Added landlord's wallet address as parameter
        string memory _tenantName,
        string memory _landlordName, // Added landlord's name as parameter
        string memory _apartmentName,
        uint256 _apartmentId,
        string memory _location
    ) external payable {
        require(msg.value == _amount, "Incorrect rent amount sent");
        
        rentals[nextRentalId] = Rental(
            _rentStartDate,
            _rentEndDate,
            _amount,
            _tenantWallet,
            _landlordWallet,
            _tenantName,
            _landlordName,
            _apartmentName,
            _apartmentId,
            _location,
            true
        );

        emit ApartmentRented(nextRentalId, _amount, _landlordWallet, _tenantWallet);
        
        payable(_landlordWallet).transfer(_amount); // Transfer rent amount to landlord
        
        nextRentalId++;
    }
    
    function cancelRental(uint256 _rentalId) external onlyTenant(_rentalId) {
        require(rentals[_rentalId].active, "Rental does not exist or is already canceled");
        
        rentals[_rentalId].active = false;
        payable(msg.sender).transfer(rentals[_rentalId].amount); // Refund rent amount to tenant
    }
}