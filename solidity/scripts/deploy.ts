import hre from "hardhat";

const SELF_KISSER_ADDRESS = "0x0Dcc19657007713483A5cA76e6A7bbe5f56EA37d";
const ORACLE_ETH_USD_ADDRESS = "0x90430C5b8045a1E2A0Fc4e959542a0c75b576439";

async function main() {
  const deepTouch = await hre.viem.deployContract("DeepTouch");
  const self_kisser = await hre.viem.getContractAt("ISelfKisser", SELF_KISSER_ADDRESS);

  console.log(`DP contract at ${deepTouch.address}`);
  console.log(`SK contract at ${self_kisser.address}`)

  self_kisser.write.selfKiss([ORACLE_ETH_USD_ADDRESS, deepTouch.address])
  
  const price = await deepTouch.read.getEthPrice()
  console.log(Number(price)/Number(10n**18n))
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
