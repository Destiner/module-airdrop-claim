import {
  createWalletClient,
  http,
  encodeAbiParameters,
  Hex,
  // parseUnits,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

import airdropModuleAbi from "../abi/airdropModule";
import { deploymentRpc, privateKey } from "../utils/env";
import { getAccount } from "../utils/account";

const account = privateKeyToAccount(privateKey);
const walletClient = createWalletClient({
  chain: sepolia,
  transport: http(deploymentRpc),
  account,
});

async function main() {
  const accountAddress = await getAccount();
  console.log("Account", accountAddress);
  const moduleAddress = "0xB9fA6fEe2bFD3B40106B29D81544FBa045dfB236";

  const airdropContractAddress = "0x5d8c8F75CEE825Eb0e2e84745FbBEe597cB7F594";
  const airdropTokenAddress = "0x1E53588a0f3d3BEf7308655FAEa92eCc9403600f";
  const claimIndex = 0n;
  const claimAmount = 1000000000000000000n;
  const merkleProof: Hex[] = [
    "0x5966d0f3b6602c74bdeeac2f7acc949166d3159d2b4bea5e6ad65afdeb0c9c4b",
    "0x74af377f3b6f5ab7fd654a8ff9e0d315c53a1ac9d81c55ddeb81a20874777672",
    "0x587137ce2ceeebd1cd711cc95701d6c244e167af57a2216d5af633edd1b712d0",
  ];
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
      accountAddress,
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
