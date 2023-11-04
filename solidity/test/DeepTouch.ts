import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

// Define constants for easy reference
const SUBJECT_FEE_PERCENT = 1000n; // The subject fee percentage as a bigint
const PROTOCOL_FEE_PERCENT = 1000n; // The protocol fee percentage as a bigint
const ETHER = 1_000_000_000_000_000_000n; // 1 Ether represented in wei for accurate calculations
const SELF_KISSER_ADDRESS = "0x0Dcc19657007713483A5cA76e6A7bbe5f56EA37d"; // SelfKisser contract address
const ORACLE_ETH_USD_ADDRESS = "0x90430C5b8045a1E2A0Fc4e959542a0c75b576439"; // Oracle contract address

// Main describe block encapsulating all test scenarios for DeepTouch contract
describe("DeepTouch", function () {
  
  // Helper function to deploy the DeepTouch contract and set up the testing environment
  async function deployDeepTouchFixture() {
    // Get test accounts from the viem environment
    const [owner, otherAccount] = await hre.viem.getWalletClients();

    // Deploy the DeepTouch contract
    const deepTouch = await hre.viem.deployContract("DeepTouch");

    // Configure the contract with initial settings
    await deepTouch.write.setFeeDestination([owner.account.address]);
    await deepTouch.write.setSubjectFeePercent([SUBJECT_FEE_PERCENT]);
    await deepTouch.write.setProtocolFeePercent([PROTOCOL_FEE_PERCENT]);

    // Whitelist the DeepTouch contract with the SelfKisser contract to enable Chronicle oracle functionalities
    const self_kisser = await hre.viem.getContractAt("ISelfKisser", SELF_KISSER_ADDRESS);
    await self_kisser.write.selfKiss([ORACLE_ETH_USD_ADDRESS, deepTouch.address]);

    // Obtain a public client for testing public contract functions
    const publicClient = await hre.viem.getPublicClient();

    // Return an object containing deployed contracts and accounts for use in tests
    return { deepTouch, owner, otherAccount, publicClient };
  }

  // Group tests related to initial parameters of the contract
  describe("Check Initial Params", function () {
    // Test the correct setting of protocol fee destination
    it("should have the correct protocol fee destination", async function () {
      const { deepTouch, owner } = await loadFixture(deployDeepTouchFixture);
      expect((await deepTouch.read.protocolFeeDestination()).toLowerCase()).to.equal(owner.account.address.toLowerCase());
    });

    // Test the correct setting of subject fee percent
    it("should have the correct subject fee percent", async function () {
      const { deepTouch } = await loadFixture(deployDeepTouchFixture);
      expect(await deepTouch.read.subjectFeePercent()).to.equal(SUBJECT_FEE_PERCENT);
    });

    // Test the correct setting of protocol fee percent
    it("should have the correct protocol fee percent", async function () {
      const { deepTouch } = await loadFixture(deployDeepTouchFixture);
      expect(await deepTouch.read.protocolFeePercent()).to.equal(PROTOCOL_FEE_PERCENT);
    });
  });

  // Group tests related to the buying shares functionality
  describe("Buy Shares flow", function () {
    // Test the buying of the first share
    it("should buy the first share correctly", async function () {
      const { deepTouch, owner } = await loadFixture(deployDeepTouchFixture);
      await deepTouch.write.buyShares([owner.account.address, 1n]);

      expect(await deepTouch.read.getSharesSupply([owner.account.address])).to.equal(1n);
      expect(await deepTouch.read.getSharesBalance([owner.account.address, owner.account.address])).to.equal(1n);
    });

    // Test the price calculation of the second share
    it("should check the price of the second share", async function () {
      const { deepTouch, owner } = await loadFixture(deployDeepTouchFixture);
      const PRICE = 62500000000000n; // The expected price for the second share
      await deepTouch.write.buyShares([owner.account.address, 1n]);

      // Ensure the buy price and buy price after fees are calculated correctly
      expect(await deepTouch.read.getBuyPrice([owner.account.address, 1n])).to.equal(PRICE);
      expect(await deepTouch.read.getBuyPriceAfterFee([owner.account.address, 1n])).to.equal(
        PRICE + (PRICE * SUBJECT_FEE_PERCENT) / ETHER + (PRICE * PROTOCOL_FEE_PERCENT) / ETHER
      );
    });
  });

  // Group tests related to the selling shares functionality
  describe("Sell Shares flow", function () {
    // Test the retrieval of the sell price after accounting for fees
    it("should get the sell price after fees correctly", async function () {
      const { deepTouch, owner } = await loadFixture(deployDeepTouchFixture);
      await deepTouch.write.buyShares([owner.account.address, 1n]);

      // Validate that the balances and sell price after fees are correct
      expect(await deepTouch.read.getSharesBalance([owner.account.address, owner.account.address])).to.equal(1n);
      expect(await deepTouch.read.getSellPriceAfterFee([owner.account.address, 1n])).to.equal(0n);
    });
  });
});
