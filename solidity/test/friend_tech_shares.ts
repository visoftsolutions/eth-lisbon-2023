import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

const SubjectFeePercent = 1000n
const ProtocolFeePercent = 1000n
const ETHER = 1000000000000000000n

describe("FriendtechSharesV1", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFriendtechSharesFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.viem.getWalletClients();

    const fts_contract = await hre.viem.deployContract("FriendtechSharesV1");

    fts_contract.write.setFeeDestination([owner.account.address])
    fts_contract.write.setSubjectFeePercent([SubjectFeePercent])
    fts_contract.write.setProtocolFeePercent([ProtocolFeePercent])

    const publicClient = await hre.viem.getPublicClient();

    return {
      fts_contract,
      owner,
      otherAccount,
      publicClient,
    };
  }

  describe("Check Initial Params", function () {
    it("Check protocolFeeDestination", async function () {
      const { fts_contract, owner } = await loadFixture(deployFriendtechSharesFixture);

      expect((await fts_contract.read.protocolFeeDestination()).toLowerCase()).to.equal(owner.account.address)
    });
    it("Check subjectFeePercent", async function () {
      const { fts_contract } = await loadFixture(deployFriendtechSharesFixture);

      expect(await fts_contract.read.subjectFeePercent()).to.equal(SubjectFeePercent)
    });
    it("Check protocolFeePercent", async function () {
      const { fts_contract } = await loadFixture(deployFriendtechSharesFixture);

      expect(await fts_contract.read.protocolFeePercent()).to.equal(ProtocolFeePercent)
    });
  });

  describe("Buy Shares flow", function () {
    it("Buy first share", async function () {
      const { fts_contract, owner } = await loadFixture(deployFriendtechSharesFixture);
      await fts_contract.write.buyShares([owner.account.address, 1n])

      expect(await fts_contract.read.sharesBalance([owner.account.address, owner.account.address])).to.equal(1n)
    });
    it("Second share price check", async function () {
      const { fts_contract, owner } = await loadFixture(deployFriendtechSharesFixture);
      const PRICE = 62500000000000n
      await fts_contract.write.buyShares([owner.account.address, 1n])

      expect(await fts_contract.read.getBuyPrice([owner.account.address, 1n])).to.equal(PRICE)
      expect(await fts_contract.read.getBuyPriceAfterFee([owner.account.address, 1n])).to.equal(PRICE + PRICE * SubjectFeePercent / ETHER + PRICE * ProtocolFeePercent / ETHER)
    });
  });

  describe("Sell Shares flow", function () {
    it("Sell first share price", async function () {
      const { fts_contract, owner } = await loadFixture(deployFriendtechSharesFixture);
      await fts_contract.write.buyShares([owner.account.address, 1n])

      expect(await fts_contract.read.sharesBalance([owner.account.address, owner.account.address])).to.equal(1n)
      expect(await fts_contract.read.getSellPriceAfterFee([owner.account.address, 1n])).to.equal(0n)
    });
  });
});
