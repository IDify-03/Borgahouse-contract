const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProductPurchase", function () {
  let productPurchase;
  let owner;
  let seller;
  let buyer;
  let key = ethers.id("Some fera")

  before(async function () {
    [owner, seller, buyer] = await ethers.getSigners();

    const ProductPurchase = await ethers.getContractFactory("ProductPurchase");
    productPurchase = await ProductPurchase.deploy();
  });

  it("Should allow a buyer to lock funds", async function () {
    const amount = ethers.parseEther("0.0001".toString());
    await productPurchase.connect(buyer).buyProduct(seller.address, ethers.id(key), { value: amount });

    const allLockData = await productPurchase.getAllLockData();
    const lockData = allLockData[0];
    expect(lockData.seller).to.equal(seller.address);
    expect(lockData.buyer).to.equal(buyer.address);
    expect(lockData.locked).to.equal(true);
    expect(lockData.amount).to.equal(amount);
  });

  it("Should not allow others to unlock funds", async function () {
    await expect(productPurchase.connect(buyer).unlockMoney(key)).to.be.revertedWith("Only the seller can unlock the funds");
  });

  it("Should allow the owner to unlock funds", async function () {
    await expect(productPurchase.connect(owner).unlockMoney(key));
    const lockData = await productPurchase.getLockDataByKey(key);
    expect(lockData.amount).to.equal(0);
    expect(lockData.locked).to.equal(false);
  });



  it("Should retrieve all locked data", async function () {
    const allLockData = await productPurchase.getAllLockData();
    expect(allLockData).to.have.lengthOf(1);
    expect(allLockData[0].seller).to.equal(seller.address);
    expect(allLockData[0].buyer).to.equal(buyer.address);
    expect(allLockData[0].locked).to.equal(true);
    expect(allLockData[0].amount).to.equal(ethers.parseEther("0.0001".toString()));
  });

  it("Should retrieve lock data by key", async function () {
    const lockData = await productPurchase.getLockDataByKey(key);
    expect(lockData.seller).to.equal(seller.address);
    expect(lockData.buyer).to.equal(buyer.address);
    expect(lockData.locked).to.equal(true);
    expect(lockData.amount).to.equal(ethers.utils.parseEther("1.0"));
    expect(lockData.key).to.equal(key);
  });
});
