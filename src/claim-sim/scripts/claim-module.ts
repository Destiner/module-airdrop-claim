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
  const moduleAddress = "0xB18003A7c7288ed08413eAeD0C9D16e5c7632376";

  const airdropContractAddress = "0x8c75Ac392b0097AE6Eaf7d7896055211aD3459f2";
  const airdropTokenAddress = "0x1E53588a0f3d3BEf7308655FAEa92eCc9403600f";
  const claimIndex = 0n;
  const claimAmount = 1000000000000000000n;
  const merkleProof: Hex[] = [
    "0x300e12ac200996bab07dadbeba6db03a2243136103492bfe2cfa82a0c0fc4b6f",
    "0x24000377fd1fe3aee8994ae25f46994eb193163670ffeac9365086225bfcc8aa",
    "0xda357633cfd8963bdfd7ba9e812af5db35281f49e815f1853f6388b74a9f473b",
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
