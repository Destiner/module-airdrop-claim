import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

import msaAdvancedAbi from "../abi/msaAdvanced";
import { deploymentRpc, privateKey } from "../utils/env";
import { getAccount } from "../utils/account";

const account = privateKeyToAccount(privateKey);
const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

async function main() {
  // Check whether the module is installed
  const account = await getAccount();
  const moduleAddress = "0xB9fA6fEe2bFD3B40106B29D81544FBa045dfB236";

  const isInstalled = await publicClient.readContract({
    address: account,
    abi: msaAdvancedAbi,
    functionName: "isModuleInstalled",
    args: [2n, moduleAddress, "0x"],
  });

  console.log("Is installed", isInstalled);
}

main();
