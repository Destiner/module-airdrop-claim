pragma solidity ^0.8.23;

import "forge-std/Script.sol";

import {SellToken} from "../src/SellToken.sol";
import {Create2} from "../src/Create2.sol";

contract DeploySellTokenScript is Script {
    function run() public {
        // Get private key for deployment
        vm.startBroadcast(vm.envUint("PK"));
        Create2 create2 = Create2(vm.envAddress("CREATE_2_FACTORY"));
        bytes32 salt = bytes32(0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef);

        // deploying sell token
        bytes memory sellTokenBytecode = type(SellToken).creationCode;
        bytes memory sellTokenBytecodeWithParams =
            abi.encodePacked(sellTokenBytecode, abi.encode("SellToken", "SLL", vm.envAddress("DEPLOYMENT_SENDER")));
        address sellTokenAddress = create2.computeAddress(salt, keccak256(sellTokenBytecodeWithParams));
        if (sellTokenAddress.code.length > 0) {
            console.log("SellToken already deployed at", sellTokenAddress);
        } else {
            sellTokenAddress = create2.deploy(salt, sellTokenBytecodeWithParams);
            console.log("SellToken deployed at", sellTokenAddress);
        }
        // mint the token to ourselves
        SellToken(sellTokenAddress).mint(vm.envAddress("DEPLOYMENT_SENDER"), 100000000000000000000);
        vm.stopBroadcast();
    }
}
