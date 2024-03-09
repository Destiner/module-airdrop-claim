import { getContractAddress } from "viem";
import { privateKeyToAccount } from "viem/accounts";

import { privateKey, salt } from "../utils/env";

const account = privateKeyToAccount(privateKey);

const address = getContractAddress({
  opcode: "CREATE2",
  salt: salt,
  bytecode: "0x",
  from: account.address,
});

console.log(`Deploying token at: ${address}`);
