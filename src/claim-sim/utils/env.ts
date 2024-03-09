import "dotenv/config";
import { Hex } from "viem";

// @ts-ignore
const privateKey = process.env.PK as Hex;
// @ts-ignore
const salt = process.env.SALT as Hex;
// @ts-ignore
const deploymentRpc = process.env.DEPLOYMENT_RPC;
// @ts-ignore
const etherscanApiKey = process.env.ETHERSCAN_API_KEY;

export { privateKey, salt, deploymentRpc, etherscanApiKey };
