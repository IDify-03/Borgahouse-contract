const { ethers } = require('hardhat');

const main = async () => {
  const productPurchaseContractFactory = await ethers.getContractFactory("ProductPurchase");
  const productPurchaseContract = await productPurchaseContractFactory.deploy();

  console.log(`Contract deployed to`, productPurchaseContract.target);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});