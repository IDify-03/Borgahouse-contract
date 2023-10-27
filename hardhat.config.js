require("@nomicfoundation/hardhat-toolbox");

require('dotenv').config();

const KEY = process.env.KEY;
/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.20",
  networks: {
    mumbai: {
      url: 'https://rpc-mumbai.maticvigil.com',
      accounts: [`${KEY}`]
    }
  }
};
