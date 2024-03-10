import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

import erc20Abi from "../abi/erc20";
import uniswap3PoolAbi from "../abi/uniswap3Pool";
import uniswap3FactoryAbi from "../abi/uniswap3Factory";
import uniswap3PositionManagerAbi from "../abi/uniswap3PositionManager";
import { privateKey, deploymentRpc } from "../utils/env";

const uniswap3FactoryAddress = "0x0227628f3F023bb0B980b67D528571c95c6DaC1c";
const uniswap3PositionManagerAddress =
  "0x1238536071E1c677A632429e3655c799b22cDA52";

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

const tokenAddress = "0x1E53588a0f3d3BEf7308655FAEa92eCc9403600f";
const sellTokenAddress = "0xceCB44ef523e82D4F48Db489F0f60c9004314fb5";

const amountTokenDesired = 100000000000000000000n;
const amountSellTokenDesired = 100000000000000000000n;

async function main() {
  const poolAddress = await publicClient.readContract({
    abi: uniswap3FactoryAbi,
    address: uniswap3FactoryAddress,
    functionName: "getPool",
    args: [tokenAddress, sellTokenAddress, 3000],
  });

  const poolCode = await publicClient.getBytecode({
    address: poolAddress,
  });

  if (!poolCode) {
    const poolCreationTxHash = await walletClient.writeContract({
      abi: uniswap3FactoryAbi,
      address: uniswap3FactoryAddress,
      functionName: "createPool",
      args: [tokenAddress, sellTokenAddress, 3000],
    });

    const poolCreationReceipt = await publicClient.waitForTransactionReceipt({
      hash: poolCreationTxHash,
    });

    console.log("Pool created", poolCreationReceipt);
  }

  const slot0 = await publicClient.readContract({
    abi: uniswap3PoolAbi,
    address: poolAddress,
    functionName: "slot0",
    args: [],
  });

  const sqrtPriceX96 = slot0[0];

  if (sqrtPriceX96 === 0n) {
    const targetPrice = 100000000000000000000000000000n;
    const initializeTxHash = await walletClient.writeContract({
      abi: uniswap3PoolAbi,
      address: poolAddress,
      functionName: "initialize",
      args: [targetPrice],
    });

    await publicClient.waitForTransactionReceipt({
      hash: initializeTxHash,
    });

    console.log("Pool initialized", initializeTxHash);
  }

  const tokenApproval = await publicClient.readContract({
    abi: erc20Abi,
    address: tokenAddress,
    functionName: "allowance",
    args: [account.address, uniswap3PositionManagerAddress],
  });

  if (tokenApproval < amountTokenDesired) {
    const tokenApprovalTxHash = await walletClient.writeContract({
      abi: erc20Abi,
      address: tokenAddress,
      functionName: "approve",
      args: [uniswap3PositionManagerAddress, amountTokenDesired],
    });

    await publicClient.waitForTransactionReceipt({
      hash: tokenApprovalTxHash,
    });

    console.log("Token approved", tokenApprovalTxHash);
  }

  const sellTokenApproval = await publicClient.readContract({
    abi: erc20Abi,
    address: sellTokenAddress,
    functionName: "allowance",
    args: [account.address, uniswap3PositionManagerAddress],
  });

  if (sellTokenApproval < amountSellTokenDesired) {
    const sellTokenApprovalTxHash = await walletClient.writeContract({
      abi: erc20Abi,
      address: sellTokenAddress,
      functionName: "approve",
      args: [uniswap3PositionManagerAddress, amountSellTokenDesired],
    });

    await publicClient.waitForTransactionReceipt({
      hash: sellTokenApprovalTxHash,
    });

    console.log("Sell token approved", sellTokenApprovalTxHash);
  }

  // const initTxHash = await walletClient.writeContract({
  //   abi: uniswap3PositionManagerAbi,
  //   address: uniswap3PositionManagerAddress,
  //   functionName: "createAndInitializePoolIfNecessary",
  //   args: [
  //     tokenAddress,
  //     sellTokenAddress,
  //     3000,
  //     100000000000000000000000000000n,
  //   ],
  // });

  // await publicClient.waitForTransactionReceipt({
  //   hash: initTxHash,
  // });

  // console.log("Initialized", initTxHash);

  const mintTxHash = await walletClient.writeContract({
    abi: uniswap3PositionManagerAbi,
    address: uniswap3PositionManagerAddress,
    functionName: "mint",
    args: [
      {
        token0: tokenAddress,
        token1: sellTokenAddress,
        fee: 3000,
        tickLower: -887272,
        tickUpper: 887272,
        amount0Desired: amountTokenDesired,
        amount1Desired: amountSellTokenDesired,
        amount0Min: 1n,
        amount1Min: 1n,
        recipient: account.address,
        deadline: BigInt(Math.floor(Date.now() / 1000)) + 60n * 60n,
      },
    ],
  });

  await publicClient.waitForTransactionReceipt({
    hash: mintTxHash,
  });

  console.log("Minted", mintTxHash);
}

main();

/*
IUniswapV3Factory factory = IUniswapV3Factory(0x0227628f3F023bb0B980b67D528571c95c6DaC1c);
INonfungiblePositionManager positionManager =
    INonfungiblePositionManager(0x1238536071E1c677A632429e3655c799b22cDA52);
Create2 create2 = Create2(vm.envAddress("CREATE_2_FACTORY"));
bytes32 salt = bytes32(0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef);
bytes memory bytecode = type(Token).creationCode;
bytes memory tokenBytecode =
    abi.encodePacked(bytecode, abi.encode("Token", "TKN1", vm.envAddress("DEPLOYMENT_SENDER")));
address tokenAddress = create2.computeAddress(salt, keccak256(tokenBytecode));
if (tokenAddress.code.length == 0) {
    console.log("Deploy tokens first");
}
Token token = Token(tokenAddress);
bytes memory sellbytecode = type(Token).creationCode;
bytes memory sellTokenBytecode =
    abi.encodePacked(sellbytecode, abi.encode("SellToken", "SLL", vm.envAddress("DEPLOYMENT_SENDER")));
address selltokenAddress = create2.computeAddress(salt, keccak256(sellTokenBytecode));
if (selltokenAddress.code.length == 0) {
    console.log("Deploy tokens first");
}
SellToken sellToken = SellToken(selltokenAddress);
uint256 amountTokenDesired = 100000000000000000000;
uint256 amountSellTokenDesired = 100000000000000000000;
// Create a new pool
IUniswapV3Pool pool = IUniswapV3Pool(factory.createPool(address(token), address(sellToken), 3000));

// Approve token transfer to the position manager
token.approve(address(positionManager), amountTokenDesired);

// Approve sellToken transfer to the position manager
sellToken.approve(address(positionManager), amountSellTokenDesired);

// Mint a new liquidity position
INonfungiblePositionManager.MintParams memory params = INonfungiblePositionManager.MintParams({
    token0: address(token),
    token1: address(sellToken),
    fee: 3000,
    tickLower: -887272,
    tickUpper: 887272,
    amount0Desired: amountTokenDesired,
    amount1Desired: amountSellTokenDesired,
    amount0Min: 0,
    amount1Min: 0,
    recipient: address(this),
    deadline: block.timestamp + 1 hours
});
positionManager.mint(params);
*/
