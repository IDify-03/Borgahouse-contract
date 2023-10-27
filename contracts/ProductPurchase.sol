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
        LockData storage lockData = lockDataMap[_key];
        require(lockData.seller == _seller, "Seller's address does not match");
        require(!lockData.locked, "Funds are already locked");
        lockData.amount = msg.value;
        lockData.buyer = msg.sender;
        lockData.locked = true;
        lockDataKeys.push(_key); // Add the key to the array
        allLockData.push(lockData); // Add the lock data to the array
    }

    // Function to unlock the money with the key
    function unlockMoney(bytes32 _key) public {
        LockData storage lockData = lockDataMap[_key];
        require(lockData.seller == msg.sender, "Only the seller can unlock the funds");
        require(lockData.locked, "Funds are not locked");
        payable(lockData.seller).transfer(lockData.amount);
        lockData.amount = 0;
        lockData.locked = false;
    }

    // Function to retrieve all lock data keys
    function getAllLockDataKeys() public view returns (bytes32[] memory) {
        return lockDataKeys;
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
