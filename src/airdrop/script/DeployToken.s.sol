import "forge-std/Script.sol";

import {Token} from "../src/Token.sol";
import {Create2} from "../src/Create2.sol";

contract DeployTokenScript is Script {
    function run() public {
        // Get private key for deployment
        vm.startBroadcast(vm.envUint("PK"));

        Create2 create2 = new Create2();
        bytes32 salt = bytes32(0);
        bytes memory bytecode = type(Token).creationCode;
        bytes memory deploymentBytecode = abi.encodePacked(bytecode, abi.encode("Token", "TKN1", msg.sender));

        address token = create2.deploy(salt, deploymentBytecode);

        vm.stopBroadcast();

        console.log("Token deployed at", token);
    }
}
