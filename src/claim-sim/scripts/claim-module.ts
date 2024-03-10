import {
  createWalletClient,
  http,
  encodeAbiParameters,
  Hex,
  zeroHash,
  // parseUnits,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

import airdropModuleAbi from "../abi/airdropModule";
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
      getProof(0),
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
