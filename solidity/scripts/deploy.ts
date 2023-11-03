import { formatEther, parseEther } from "viem";
import hre from "hardhat";

async function main() {
  const fts_contract = await hre.viem.deployContract("FriendtechSharesV1");

  console.log(
    `friend_tech_shares with ${fts_contract.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
