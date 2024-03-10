// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;

// import "forge-std/Script.sol";

// import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
// import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
// import "@uniswap/v3-periphery/contracts/interfaces/INonfungiblePositionManager.sol";
// import "@uniswap/v3-core/contracts/interfaces/IERC20Minimal.sol";
// import {Token} from "../src/Token.sol";
// import {SellToken} from "../src/SellToken.sol";
// import {Create2} from "../src/Create2.sol";

// contract Liquidity is Script {
//     function run() public {
//         IUniswapV3Factory factory = IUniswapV3Factory(0x0227628f3F023bb0B980b67D528571c95c6DaC1c);
//         INonfungiblePositionManager positionManager =
//             INonfungiblePositionManager(0x1238536071E1c677A632429e3655c799b22cDA52);
//         Create2 create2 = Create2(vm.envAddress("CREATE_2_FACTORY"));
//         bytes32 salt = bytes32(0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef);
//         bytes memory bytecode = type(Token).creationCode;
//         bytes memory tokenBytecode =
//             abi.encodePacked(bytecode, abi.encode("Token", "TKN1", vm.envAddress("DEPLOYMENT_SENDER")));
//         address tokenAddress = create2.computeAddress(salt, keccak256(tokenBytecode));
//         if (tokenAddress.code.length == 0) {
//             console.log("Deploy tokens first");
//         }
//         Token token = Token(tokenAddress);
//         bytes memory sellbytecode = type(Token).creationCode;
//         bytes memory sellTokenBytecode =
//             abi.encodePacked(sellbytecode, abi.encode("SellToken", "SLL", vm.envAddress("DEPLOYMENT_SENDER")));
//         address selltokenAddress = create2.computeAddress(salt, keccak256(sellTokenBytecode));
//         if (selltokenAddress.code.length == 0) {
//             console.log("Deploy tokens first");
//         }
//         SellToken sellToken = SellToken(selltokenAddress);
//         uint256 amountTokenDesired = 100000000000000000000;
//         uint256 amountSellTokenDesired = 100000000000000000000;
//         // Create a new pool
//         IUniswapV3Pool pool = IUniswapV3Pool(factory.createPool(address(token), address(sellToken), 3000));

//         // Approve token transfer to the position manager
//         token.approve(address(positionManager), amountTokenDesired);

//         // Approve sellToken transfer to the position manager
//         sellToken.approve(address(positionManager), amountSellTokenDesired);

//         // Mint a new liquidity position
//         INonfungiblePositionManager.MintParams memory params = INonfungiblePositionManager.MintParams({
//             token0: address(token),
//             token1: address(sellToken),
//             fee: 3000,
//             tickLower: -887272,
//             tickUpper: 887272,
//             amount0Desired: amountTokenDesired,
//             amount1Desired: amountSellTokenDesired,
//             amount0Min: 0,
//             amount1Min: 0,
//             recipient: address(this),
//             deadline: block.timestamp + 1 hours
//         });
//         positionManager.mint(params);
//     }
// }
