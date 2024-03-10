import "forge-std/Script.sol";

import {Token} from "../src/Token.sol";
import {SellToken} from "../src/SellToken.sol";
import {Create2} from "../src/Create2.sol";

contract DeployTokenScript is Script {
    function run() public {
        // Get private key for deployment
        vm.startBroadcast(vm.envUint("PK"));
        Create2 create2 = Create2(vm.envAddress("CREATE_2_FACTORY"));
        bytes32 salt = bytes32(0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef);
        bytes memory bytecode = type(Token).creationCode;
        bytes memory tokenBytecode =
            abi.encodePacked(bytecode, abi.encode("Token", "TKN1", vm.envAddress("DEPLOYMENT_SENDER")));

        address tokenAddress = create2.computeAddress(salt, keccak256(tokenBytecode));

        // Check if the token address is already deployed before deploying
        if (tokenAddress.code.length > 0) {
            console.log("Token already deployed at", tokenAddress);
        } else {
            tokenAddress = create2.deploy(salt, tokenBytecode);
            console.log("Token deployed at", tokenAddress);
        }

        // deploying sell token
        bytes memory sellTokenBytecode = type(SellToken).creationCode;
        bytes memory sellTokenBytecodeWithParams =
            abi.encodePacked(sellTokenBytecode, abi.encode(100000000000000000000));
        address sellTokenAddress = create2.computeAddress(salt, keccak256(sellTokenBytecodeWithParams));
        if (sellTokenAddress.code.length > 0) {
            console.log("SellToken already deployed at", sellTokenAddress);
        } else {
            sellTokenAddress = create2.deploy(salt, sellTokenBytecodeWithParams);
            console.log("SellToken deployed at", sellTokenAddress);
        }

        vm.stopBroadcast();
    }
}
