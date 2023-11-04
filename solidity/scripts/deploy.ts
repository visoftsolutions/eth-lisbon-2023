import hre from "hardhat";

// Constants for the SelfKisser and Oracle smart contract addresses
const SELF_KISSER_ADDRESS = "0x0Dcc19657007713483A5cA76e6A7bbe5f56EA37d";
const ORACLE_ETH_USD_ADDRESS = "0x90430C5b8045a1E2A0Fc4e959542a0c75b576439";

async function main() {
  const deepTouch = await hre.viem.deployContract("DeepTouch");
  const selfKisser = await hre.viem.getContractAt("ISelfKisser", SELF_KISSER_ADDRESS);

  // Output the contract addresses to the console
  console.log(`DeepTouch contract deployed at: ${deepTouch.address}`);
  console.log(`SelfKisser contract found at: ${selfKisser.address}`);

  // Invoke the 'selfKiss' function on the SelfKisser contract to allow it to interact with the DeepTouch contract
  // This registers the DeepTouch contract with the SelfKisser contract's whitelist
  await selfKisser.write.selfKiss([ORACLE_ETH_USD_ADDRESS, deepTouch.address]);
  
  // Retrieve the current ETH price from the DeepTouch contract
  const price = await deepTouch.read.getEthPrice();
  
  // Convert the price from wei (the smallest unit of ETH) to ETH and log it
  console.log(`Current ETH Price: ${Number(price) / Number(10n ** 18n)} ETH`);
}

// Execute the main function and properly handle any errors
main().catch((error) => {
  console.error('An error occurred:', error);
  process.exitCode = 1;
});
