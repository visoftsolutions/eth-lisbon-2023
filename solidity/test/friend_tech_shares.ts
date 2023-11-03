import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

const SUBJECT_FEE_PERCENT = 1000n;
const PROTOCOL_FEE_PERCENT = 1000n;
const ETHER = 1_000_000_000_000_000_000n; // Better readability for large numbers

describe("FriendtechSharesV1", function () {
  async function deployFriendtechSharesFixture() {
    const [owner, otherAccount] = await hre.viem.getWalletClients();

    const friendtechSharesContract = await hre.viem.deployContract("FriendtechSharesV1");

    // Set initial contract parameters
    await friendtechSharesContract.write.setFeeDestination([owner.account.address]);
    await friendtechSharesContract.write.setSubjectFeePercent([SUBJECT_FEE_PERCENT]);
    await friendtechSharesContract.write.setProtocolFeePercent([PROTOCOL_FEE_PERCENT]);

    const publicClient = await hre.viem.getPublicClient();

    return {
      friendtechSharesContract,
      owner,
      otherAccount,
      publicClient,
    };
  }

  describe("Check Initial Params", function () {
    it("should have the correct protocol fee destination", async function () {
      const { friendtechSharesContract, owner } = await loadFixture(deployFriendtechSharesFixture);
      expect((await friendtechSharesContract.read.protocolFeeDestination()).toLowerCase()).to.equal(owner.account.address.toLowerCase());
    });

    it("should have the correct subject fee percent", async function () {
      const { friendtechSharesContract } = await loadFixture(deployFriendtechSharesFixture);
      expect(await friendtechSharesContract.read.subjectFeePercent()).to.equal(SUBJECT_FEE_PERCENT);
    });

    it("should have the correct protocol fee percent", async function () {
      const { friendtechSharesContract } = await loadFixture(deployFriendtechSharesFixture);
      expect(await friendtechSharesContract.read.protocolFeePercent()).to.equal(PROTOCOL_FEE_PERCENT);
    });
  });

  describe("Buy Shares flow", function () {
    it("should buy the first share correctly", async function () {
      const { friendtechSharesContract, owner } = await loadFixture(deployFriendtechSharesFixture);
      await friendtechSharesContract.write.buyShares([owner.account.address, 1n]);

      expect(await friendtechSharesContract.read.getSharesSupply([owner.account.address])).to.equal(1n);
      expect(await friendtechSharesContract.read.getSharesBalance([owner.account.address, owner.account.address])).to.equal(1n);
    });

    it("should check the price of the second share", async function () {
      const { friendtechSharesContract, owner } = await loadFixture(deployFriendtechSharesFixture);
      const PRICE = 62500000000000n;
      await friendtechSharesContract.write.buyShares([owner.account.address, 1n]);

      expect(await friendtechSharesContract.read.getBuyPrice([owner.account.address, 1n])).to.equal(PRICE);
      expect(await friendtechSharesContract.read.getBuyPriceAfterFee([owner.account.address, 1n])).to.equal(
        PRICE + (PRICE * SUBJECT_FEE_PERCENT) / ETHER + (PRICE * PROTOCOL_FEE_PERCENT) / ETHER
      );
    });
  });

  describe("Sell Shares flow", function () {
    it("should get the sell price after fees correctly", async function () {
      const { friendtechSharesContract, owner } = await loadFixture(deployFriendtechSharesFixture);
      await friendtechSharesContract.write.buyShares([owner.account.address, 1n]);

      expect(await friendtechSharesContract.read.sharesBalance([owner.account.address, owner.account.address])).to.equal(1n);
      expect(await friendtechSharesContract.read.getSellPriceAfterFee([owner.account.address, 1n])).to.equal(0n);
    });
  });
});
