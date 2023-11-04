import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import {configDotenv} from "dotenv"
configDotenv();

const ZKEVM_TESTNET_RPC_URL = process.env.ZKEVM_TESTNET_RPC_URL ?? "";
const PRIVATE_KEY = process.env.PRIVATE_KEY ?? "0000000000000000000000000000000000000000000000000000000000000000"

const config: HardhatUserConfig = {
  solidity: "0.8.19",

  networks: {
    polygonZKEVMTestnet: {
      url: ZKEVM_TESTNET_RPC_URL, 
      accounts: [PRIVATE_KEY],
      chainId: 1442,
    }
  }
};

export default config;
