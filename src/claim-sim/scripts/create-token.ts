import { Wallet } from "@ethersproject/wallet";
import { JsonRpcProvider } from "@ethersproject/providers";
import {
  deployContract,
  deployFactory,
  getCreate2Address,
  isDeployed,
} from "solidity-create2-deployer";
import {
  getContractAddress,
  createWalletClient,
  http,
  encodeDeployData,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { polygonMumbai } from "viem/chains";

import { privateKey, salt, deploymentRpc } from "../utils/env";
import { token as tokenBytecode } from "../utils/bytecode";
import erc20Abi from "../abi/erc20";

async function main() {
  const account = privateKeyToAccount(privateKey);

  console.log(privateKey, account.address);

  const walletClient = createWalletClient({
    chain: polygonMumbai,
    transport: http(),
    account,
  });

  // const hash = await walletClient.deployContract({
  //   abi: erc20Abi,
  //   account,
  //   bytecode: tokenBytecode,
  //   args: ["Token", "TKN1", account.address],
  // });

  // console.log(`Deploying token at: ${hash}`);

  const deployData = encodeDeployData({
    abi: erc20Abi,
    args: ["Token", "TKN1", account.address],
    bytecode: tokenBytecode,
  });

  console.log(`Deploying the contract: ${deployData}`);

  const address = getContractAddress({
    opcode: "CREATE2",
    salt: salt,
    bytecode: deployData,
    from: account.address,
  });

  console.log(`Deploying token at: ${address}`);

  const provider = new JsonRpcProvider(deploymentRpc);
  const signer = new Wallet(privateKey, provider);
  const { txHash, address: contractAddress } = await deployContract({
    salt: salt,
    contractBytecode: tokenBytecode,
    constructorTypes: ["string", "string", "address"],
    constructorArgs: ["Token", "TKN1", account.address],
    signer: signer,
  });

  console.log(`Contract deployed at ${contractAddress}`);
  console.log(`Transaction hash: ${txHash}`);
}

main();
