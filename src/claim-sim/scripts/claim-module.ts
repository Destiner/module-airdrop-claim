import {
  createWalletClient,
  http,
  encodeAbiParameters,
  Hex,
  zeroHash,
  encodeFunctionData,
  // parseUnits,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

import msaAdvancedAbi from "../abi/msaAdvanced";
import airdropModuleAbi from "../abi/airdropModule";
import entrypointAbi from "../abi/entrypoint";
import { deploymentRpc, privateKey } from "../utils/env";
import { getOrCreateAccount, moduleAddress } from "../utils/account";
import {
  airdropContractAddress,
  tokenAddress,
  getAmount,
  getProof,
} from "../utils/airdrop";

const account = privateKeyToAccount(privateKey);
const walletClient = createWalletClient({
  chain: sepolia,
  transport: http(deploymentRpc),
  account,
});

async function main() {
  const accountAddress = await getOrCreateAccount(zeroHash);
  console.log("Account", accountAddress);

  const proof = await getProof(0);

  const executeData = encodeAbiParameters(
    [
      { name: "airdropContractAddress", type: "address" },
      { name: "airdropTokenAddress", type: "address" },
      { name: "claimIndex", type: "uint256" },
      { name: "account", type: "address" },
      { name: "claimAmount", type: "uint256" },
      { name: "merkleProof", type: "bytes32[]" },
    ],
    [
      airdropContractAddress,
      tokenAddress,
      0n,
      accountAddress,
      getAmount(0),
      proof,
    ]
  );

  await walletClient.writeContract({
    abi: airdropModuleAbi,
    address: moduleAddress,
    functionName: "execute",
    args: [executeData],
  });
}

function encodeToBytes32(value1: number, value2: number): Hex {
  // Create two buffers of 16 bytes each for uint128 values
  const buffer1 = Buffer.alloc(16);
  const buffer2 = Buffer.alloc(16);

  // Write the numbers into the buffers as big-endian uint128
  buffer1.writeBigUInt64BE(BigInt(value1), 8); // Write the lower 8 bytes
  buffer2.writeBigUInt64BE(BigInt(value2), 8); // Write the lower 8 bytes

  // Combine the two buffers into a single Buffer of 32 bytes
  const combined = Buffer.concat([buffer1, buffer2]);

  // Return the combined buffer as a hex string
  return ("0x" + combined.toString("hex")) as Hex;
}

// Usage
const bytes32 = encodeToBytes32(2e6, 2e6);
console.log(bytes32);

main();
