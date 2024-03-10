import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { polygonMumbai } from "viem/chains";

import merkleDistributorAbi from "../abi/merkleDistributor";
import { privateKey } from "../utils/env";

async function main() {
  const account = privateKeyToAccount(privateKey);

  console.log(privateKey, account.address);

  const walletClient = createWalletClient({
    chain: polygonMumbai,
    transport: http(),
    account,
  });

  await walletClient.writeContract({
    abi: merkleDistributorAbi,
    address: "0x36F3b76d3Cd08B77464139B47d9D79e99C956752",
    functionName: "claim",
    args: [
      1n,
      "0xA0CF798816d4b9b9866b5330EEA46A18382f2511",
      2000000000000000000n,
      [
        "0x14d7527ff802c53dcb004c88609519e2103a0a13913309c101e0cc728c2ab068",
        "0x95f75c30626b68ce060abdf55e4151dd43bbf4dfc58e5db97d609fd055e45189",
        "0x55372c44fa22091bde8c97f94273eb705abf9d7a3846ed2facd8876aba5161bc",
      ],
    ],
  });
}

main();
