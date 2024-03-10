import { ethers, providers } from "ethers";
import {
  MintOptions,
  NonfungiblePositionManager,
  Pool,
  Position,
} from "@uniswap/v3-sdk";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

import { privateKey } from "../utils/env";
import { Percent, Token } from "@uniswap/sdk-core";

const tokenAddress = "0x1E53588a0f3d3BEf7308655FAEa92eCc9403600f";
const sellTokenAddress = "0xceCB44ef523e82D4F48Db489F0f60c9004314fb5";
const uniswap3PositionManagerAddress =
  "0x1238536071E1c677A632429e3655c799b22cDA52";

const amountTokenDesired = 100000000000000000000n;
const amountSellTokenDesired = 100000000000000000000n;
const price = "100000000000000000000000000000";

const account = privateKeyToAccount(privateKey);

const chainId = sepolia.id;

const pool = new Pool(
  new Token(chainId, tokenAddress, 18),
  new Token(chainId, sellTokenAddress, 18),
  3000,
  price,
  0,
  4657
);
const tickLower: number = -60;
const tickUpper: number = 60;
const useFullPrecision: boolean = true;

async function main() {
  const position = Position.fromAmounts({
    pool,
    tickLower,
    tickUpper,
    amount0: amountTokenDesired.toString(),
    amount1: amountSellTokenDesired.toString(),
    useFullPrecision,
  });

  const mintOptions: MintOptions = {
    recipient: account.address,
    deadline: Math.floor(Date.now() / 1000) + 60 * 20,
    slippageTolerance: new Percent(50, 10_000),
  };

  // get calldata for minting a position
  const { calldata, value } = NonfungiblePositionManager.addCallParameters(
    position,
    mintOptions
  );

  const transaction = {
    data: calldata,
    to: uniswap3PositionManagerAddress,
    value: value,
    from: account.address,
    // maxFeePerGas: MAX_FEE_PER_GAS,
    // maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
  };

  const provider = new providers.JsonRpcProvider(process.env.DEPLOYMENT_RPC);
  const wallet = new ethers.Wallet(privateKey, provider);
  const txRes = await wallet.sendTransaction(transaction);

  console.log("Tx hash", txRes.hash);
}

main();
