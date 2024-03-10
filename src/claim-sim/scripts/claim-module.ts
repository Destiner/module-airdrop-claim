import {
  createPublicClient,
  createWalletClient,
  http,
  zeroAddress,
  zeroHash,
  encodeAbiParameters,
  // parseUnits,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

import airdropModuleAbi from "../abi/airdropModule";
import msaAdvancedAbi from "../abi/msaAdvanced";
import { deploymentRpc, privateKey } from "../utils/env";
import { getAccount } from "../utils/account";

const account = privateKeyToAccount(privateKey);
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(deploymentRpc),
});
const walletClient = createWalletClient({
  chain: sepolia,
  transport: http(deploymentRpc),
  account,
});

async function main() {
  const account = await getAccount();
  const moduleAddress = "0xB9fA6fEe2bFD3B40106B29D81544FBa045dfB236";

  const airdropContractAddress = "0x";
  const airdropTokenAddress = "0x";
  const claimIndex = 0n;
  const claimAmount = 0n;
  const merkleProof = [];
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
      airdropTokenAddress,
      claimIndex,
      account,
      claimAmount,
      merkleProof,
    ]
  );

  await walletClient.writeContract({
    abi: airdropModuleAbi,
    address: moduleAddress,
    functionName: "execute",
    args: [executeData],
  });
}

main();
