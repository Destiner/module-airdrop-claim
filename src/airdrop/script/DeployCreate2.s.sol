import "forge-std/Script.sol";

import {Token} from "../src/Token.sol";
import {Create2} from "../src/Create2.sol";

contract DeployCreate2 is Script {
    function run() public {
        // Get private key for deployment
        vm.startBroadcast(vm.envUint("PK"));
        Create2 create2 = new Create2();

        console.log("Create2 deployed at", address(create2));
    }
}
