import { getContractAddress, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { polygonMumbai } from "viem/chains";

import { privateKey, salt } from "../utils/env";
import { token as tokenBytecode } from "../utils/bytecode";
import erc20Abi from "../abi/erc20";

async function main() {
  const account = privateKeyToAccount(privateKey);

  const walletClient = createWalletClient({
    chain: polygonMumbai,
    transport: http(),
    account,
  });

  // walletClient.switchChain({ id: polygonMumbai.id });

  const hash = await walletClient.deployContract({
    abi: erc20Abi,
    account,
    bytecode: tokenBytecode,
    args: ["Token", "TKN1", account.address],
  });

  console.log(`Deploying token at: ${hash}`);

  const address = getContractAddress({
    opcode: "CREATE2",
    salt: salt,
    bytecode: tokenBytecode,
    from: account.address,
  });

  console.log(`Deploying token at: ${address}`);
}

main();
