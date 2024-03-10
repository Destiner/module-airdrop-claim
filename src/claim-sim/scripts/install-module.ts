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
  const moduleAddress = "0xB18003A7c7288ed08413eAeD0C9D16e5c7632376";

  const isInstalled = await publicClient.readContract({
    address: account,
    abi: msaAdvancedAbi,
    functionName: "isModuleInstalled",
    args: [2n, moduleAddress, "0x"],
  });

  console.log("Is installed", isInstalled);
}

main();
