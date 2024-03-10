import {
  createPublicClient,
  createWalletClient,
  http,
  zeroAddress,
  zeroHash,
  encodeAbiParameters,
  // parseUnits,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

import bootstrapAbi from "../abi/msaBootstrap";
import factoryAbi from "../abi/msaFactory";
import msaAdvancedAbi from "../abi/msaAdvanced";
import { deploymentRpc, privateKey } from "../utils/env";

const account = privateKeyToAccount(privateKey);
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
const factoryAddress = "0xFf81C1C2075704D97F6806dE6f733d6dAF20c9c6";

// TODO change
const sellToken = zeroAddress;
// TODO change
const sellShare = 0n;

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

// TODO deploy a new wallet (do that deterministically?)

// Deploy the default validator
// Deploy the default executor

// Create config for initial modules
// BootstrapConfig[] memory validators = makeBootstrapConfig(address(defaultValidator), "");
// BootstrapConfig[] memory executors = makeBootstrapConfig(address(defaultExecutor), "");
// BootstrapConfig memory hook = _makeBootstrapConfig(address(0), "");
// BootstrapConfig[] memory fallbacks = makeBootstrapConfig(address(0), "");

// // Create initcode and salt to be sent to Factory
// bytes memory _initCode =
//     bootstrapSingleton._getInitMSACalldata(validators, executors, hook, fallbacks);
// bytes32 salt = keccak256("1");

// // Get address of new account
// account = factory.getAddress(salt, _initCode);

// // Pack the initcode to include in the userOp
// initCode = abi.encodePacked(
//     address(factory),
//     abi.encodeWithSelector(factory.createAccount.selector, salt, _initCode)
// );

// TODO install a plugin
