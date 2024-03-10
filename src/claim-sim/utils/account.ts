import {
  createPublicClient,
  createWalletClient,
  encodeAbiParameters,
  http,
  zeroAddress,
  zeroHash,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

import bootstrapAbi from "../abi/msaBootstrap";
import factoryAbi from "../abi/msaFactory";
import { deploymentRpc, privateKey } from "../utils/env";

const account = privateKeyToAccount(privateKey);
const factoryAddress = "0xFf81C1C2075704D97F6806dE6f733d6dAF20c9c6";

// TODO change
const sellToken = zeroAddress;
// TODO change
const sellShare = 0n;

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(deploymentRpc),
});
const walletClient = createWalletClient({
  chain: sepolia,
  transport: http(deploymentRpc),
  account,
});

const bootstrapAddress = "0x5e9F3feeC2AA6706DF50de955612D964f115523B";

async function getAccount() {
  const validatorData = encodeAbiParameters(
    [{ name: "owner", type: "address" }],
    [account.address]
  );

  const moduleAddress = "0xB9fA6fEe2bFD3B40106B29D81544FBa045dfB236";
  const moduleData = encodeAbiParameters(
    [
      { name: "sellToken", type: "address" },
      { name: "sellShare", type: "uint256" },
    ],
    [sellToken, sellShare]
  );

  const initCode = await publicClient.readContract({
    address: bootstrapAddress,
    abi: bootstrapAbi,
    functionName: "_getInitMSACalldata",
    args: [
      [
        {
          module: "0xf83d07238a7C8814a48535035602123Ad6DbfA63",
          data: validatorData,
        },
      ],
      [
        {
          module: moduleAddress,
          data: moduleData,
        },
      ],
      {
        module: zeroAddress,
        data: "0x",
      },
      [],
    ],
  });

  console.log(initCode);

  const accountAddress = await publicClient.readContract({
    address: factoryAddress,
    abi: factoryAbi,
    functionName: "getAddress",
    args: [zeroHash, initCode],
  });

  const isAccountCreated = await publicClient.getBytecode({
    address: accountAddress,
  });

  if (isAccountCreated) {
    return accountAddress;
  }

  const txHash = await walletClient.writeContract({
    address: factoryAddress,
    abi: factoryAbi,
    functionName: "createAccount",
    args: [zeroHash, initCode],
    // gasPrice: parseUnits("10", 9),
  });

  console.log("Creating the account", txHash);

  await publicClient.waitForTransactionReceipt({
    hash: txHash,
  });

  console.log("Created");

  return accountAddress;
}

export { getAccount };
