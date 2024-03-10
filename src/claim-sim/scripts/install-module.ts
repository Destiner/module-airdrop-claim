import { Hex, createPublicClient, http, zeroHash } from "viem";
import { sepolia } from "viem/chains";

import msaAdvancedAbi from "../abi/msaAdvanced";
import { moduleAddress, getOrCreateAccount } from "../utils/account";

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

const salts: Hex[] = [
  "0x0000000000000000000000000000000000000000000000000000000000000000",
  "0x0000000000000000000000000000000000000000000000000000000000000001",
  "0x0000000000000000000000000000000000000000000000000000000000000002",
  "0x0000000000000000000000000000000000000000000000000000000000000003",
  "0x0000000000000000000000000000000000000000000000000000000000000004",
  "0x0000000000000000000000000000000000000000000000000000000000000005",
];

async function main() {
  for (const salt of salts) {
    // Check whether the module is installed
    const account = await getOrCreateAccount(salt);

    const isInstalled = await publicClient.readContract({
      address: account,
      abi: msaAdvancedAbi,
      functionName: "isModuleInstalled",
      args: [2n, moduleAddress, "0x"],
    });

    console.log("Is installed", isInstalled);
  }
}

main();
