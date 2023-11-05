import hre from "hardhat";

const DEEPTOUCH_ADDRESS = "0x1ea7adb307ec9ef789f3d08247203fecb03ed515"

async function main() {
  const deepTouch = await hre.viem.getContractAt("DeepTouch", DEEPTOUCH_ADDRESS);

  // Output the contract addresses to the console
  console.log(`DeepTouch contract deployed at: ${deepTouch.address}`);

  
}

// Execute the main function and properly handle any errors
main().catch((error) => {
  console.error('An error occurred:', error);
  process.exitCode = 1;
});
