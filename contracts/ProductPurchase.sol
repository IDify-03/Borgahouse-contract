// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract ProductPurchase {
    address public owner; // The owner of the contract
    struct LockData {
        uint256 amount; // Amount locked in the contract
        address seller; // Seller's address
        address buyer;  // Buyer's address
        bool locked;    // Is the money locked
        bytes32 key;     // Key to unlock the money
    }
    
    mapping(bytes32 => LockData) public lockDataMap; // Mapping to store lock data
    bytes32[] public lockDataKeys; // Array to store keys
    LockData[] public allLockData; // Array to store all locked data

    constructor() {
        owner = msg.sender; // Set the contract owner to the deployer
    }

    // Function to buy a product and lock the money
    function buyProduct(address _seller, bytes32 _key) public payable {
        require(msg.value > 0, "Amount sent must be greater than 0");
        LockData memory lockdata = LockData(
            msg.value,
            _seller,
            msg.sender,
            true,
            _key
        );

        lockDataMap[_key] = lockdata;
        
        lockDataKeys.push(_key); 
        allLockData.push(lockdata); 
    }

    // Function to unlock the money with the key
    function unlockMoney(bytes32 _key) public {
        LockData storage lockData = lockDataMap[_key];
        require(owner == msg.sender, "Only the seller can unlock the funds");
        require(lockData.locked, "Funds are not locked");
        payable(lockData.seller).transfer(lockData.amount);
        lockData.amount = 0;
        lockData.locked = false;
    }


    // Function to retrieve all locked data
    function getAllLockData() public view returns (LockData[] memory) {
        return allLockData;
    }

    // Function to retrieve lock data by key
    function getLockDataByKey(bytes32 _key) public view returns (LockData memory) {
        return lockDataMap[_key];
    }
}
