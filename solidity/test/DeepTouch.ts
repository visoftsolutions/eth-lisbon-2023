import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

const SUBJECT_FEE_PERCENT = 1000n;
const PROTOCOL_FEE_PERCENT = 1000n;
const ETHER = 1_000_000_000_000_000_000n; // Better readability for large numbers
const SELF_KISSER_ADDRESS = "0x0Dcc19657007713483A5cA76e6A7bbe5f56EA37d";
const ORACLE_ETH_USD_ADDRESS = "0x90430C5b8045a1E2A0Fc4e959542a0c75b576439";

describe("DeepTouch", function () {
  async function deployDeepTouchFixture() {
    const [owner, otherAccount] = await hre.viem.getWalletClients();

    const deepTouch = await hre.viem.deployContract("DeepTouch");

    // Set initial contract parameters
    await deepTouch.write.setFeeDestination([owner.account.address]);
    await deepTouch.write.setSubjectFeePercent([SUBJECT_FEE_PERCENT]);
    await deepTouch.write.setProtocolFeePercent([PROTOCOL_FEE_PERCENT]);

    // register in chronicle whitelist
    const self_kisser = await hre.viem.getContractAt("ISelfKisser", SELF_KISSER_ADDRESS);
    self_kisser.write.selfKiss([ORACLE_ETH_USD_ADDRESS, deepTouch.address])

    const publicClient = await hre.viem.getPublicClient();

    return {
      deepTouch,
      owner,
      otherAccount,
      publicClient,
    };
  }

  describe("Check Initial Params", function () {
    it("should have the correct protocol fee destination", async function () {
      const { deepTouch, owner } = await loadFixture(deployDeepTouchFixture);
      expect((await deepTouch.read.protocolFeeDestination()).toLowerCase()).to.equal(owner.account.address.toLowerCase());
    });

    it("should have the correct subject fee percent", async function () {
      const { deepTouch } = await loadFixture(deployDeepTouchFixture);
      expect(await deepTouch.read.subjectFeePercent()).to.equal(SUBJECT_FEE_PERCENT);
    });

    it("should have the correct protocol fee percent", async function () {
      const { deepTouch } = await loadFixture(deployDeepTouchFixture);
      expect(await deepTouch.read.protocolFeePercent()).to.equal(PROTOCOL_FEE_PERCENT);
    });
  });

  describe("Buy Shares flow", function () {
    it("should buy the first share correctly", async function () {
      const { deepTouch, owner } = await loadFixture(deployDeepTouchFixture);
      await deepTouch.write.buyShares([owner.account.address, 1n]);

      expect(await deepTouch.read.getSharesSupply([owner.account.address])).to.equal(1n);
      expect(await deepTouch.read.getSharesBalance([owner.account.address, owner.account.address])).to.equal(1n);
    });

    it("should check the price of the second share", async function () {
      const { deepTouch, owner } = await loadFixture(deployDeepTouchFixture);
      const PRICE = 62500000000000n;
      await deepTouch.write.buyShares([owner.account.address, 1n]);

      expect(await deepTouch.read.getBuyPrice([owner.account.address, 1n])).to.equal(PRICE);
      expect(await deepTouch.read.getBuyPriceAfterFee([owner.account.address, 1n])).to.equal(
        PRICE + (PRICE * SUBJECT_FEE_PERCENT) / ETHER + (PRICE * PROTOCOL_FEE_PERCENT) / ETHER
      );
    });
  });

  describe("Sell Shares flow", function () {
    it("should get the sell price after fees correctly", async function () {
      const { deepTouch, owner } = await loadFixture(deployDeepTouchFixture);
      await deepTouch.write.buyShares([owner.account.address, 1n]);

      expect(await deepTouch.read.sharesBalance([owner.account.address, owner.account.address])).to.equal(1n);
      expect(await deepTouch.read.getSellPriceAfterFee([owner.account.address, 1n])).to.equal(0n);
    });
  });
});
