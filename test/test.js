const { expect } = require("chai");

describe("ProductPurchase", function () {
  let productPurchase;
  let owner;
  let seller;
  let buyer;
  let key = "0x123";

  before(async function () {
    [owner, seller, buyer] = await ethers.getAddress();

    const ProductPurchase = await ethers.getContractFactory("ProductPurchase");
    productPurchase = await ProductPurchase.deploy();
  });

  it("Should initialize the contract with the owner", async function () {
    expect(await productPurchase.owner()).to.equal(owner.address);
  });

  it("Should allow a buyer to lock funds", async function () {
    const amount = ethers.utils.parseEther("1.0"); // 1 ETH
    await expect(productPurchase.connect(buyer).buyProduct(seller.address, key, { value: amount }))
      .to.emit(productPurchase, "FundsLocked")
      .withArgs(seller.address, key, buyer.address, amount);

    const lockData = await productPurchase.getLockDataByKey(key);
    expect(lockData.seller).to.equal(seller.address);
    expect(lockData.buyer).to.equal(buyer.address);
    expect(lockData.locked).to.equal(true);
    expect(lockData.amount).to.equal(amount);
  });

  it("Should allow the seller to unlock funds", async function () {
    await expect(productPurchase.connect(seller).unlockMoney(key))
      .to.emit(productPurchase, "FundsUnlocked")
      .withArgs(seller.address, key, seller.address, ethers.utils.parseEther("1.0"));

    const lockData = await productPurchase.getLockDataByKey(key);
    expect(lockData.amount).to.equal(0);
    expect(lockData.locked).to.equal(false);
  });

  it("Should not allow others to unlock funds", async function () {
    await expect(productPurchase.connect(buyer).unlockMoney(key)).to.be.revertedWith("Only the seller can unlock the funds");
  });
});
