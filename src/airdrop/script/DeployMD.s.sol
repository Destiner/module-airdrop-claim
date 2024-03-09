import "forge-std/Script.sol";

import {MerkleDistributor} from "../src/MerkleDistributor.sol";
import {Token} from "../src/Token.sol";
import {Create2} from "../src/Create2.sol";

contract DeployMDScript is Script {
    function run() public {
        // Get private key for deployment
        vm.startBroadcast(vm.envUint("PK"));

        Create2 create2 = Create2(vm.envAddress("CREATE_2_FACTORY"));
        bytes32 salt = bytes32(0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef);
        bytes memory miniTokenBytecode = type(Token).creationCode;
        bytes memory tokenBytecode =
            abi.encodePacked(miniTokenBytecode, abi.encode("Token", "TKN1", vm.envAddress("DEPLOYMENT_SENDER")));
        // console.log(msg.sender);
        // console.logBytes32(keccak256(miniTokenBytecode));
        // console.logBytes32(keccak256(tokenBytecode));
        address tokenAddress = create2.computeAddress(salt, keccak256(tokenBytecode));
        bytes32 merkleRoot = 0x65fb2c2e40c92221ed694da9efadfc9025490d6bd9ba807a944b4405628cfe96;
        bytes memory miniDistributorBytecode = type(MerkleDistributor).creationCode;
        bytes memory distributorBytecode =
            abi.encodePacked(miniDistributorBytecode, abi.encode(tokenAddress, merkleRoot));
        address merkleDistributorAddress = create2.computeAddress(salt, keccak256(distributorBytecode));
        console.log("Token deployed at", tokenAddress);
        // Check if Merkle Distributor already deployed
        if (merkleDistributorAddress.code.length > 0) {
            console.log("Merkle Distributor already deployed at", merkleDistributorAddress);
        } else {
            merkleDistributorAddress = create2.deploy(salt, distributorBytecode);
            console.log("MerkleDistributor deployed at", merkleDistributorAddress);
        }
        // minting step
        Token(tokenAddress).mint(merkleDistributorAddress, 21000000000000000000);
        console.log("Minted", 21000000000000000000, "tokens to", merkleDistributorAddress);
        vm.stopBroadcast();
    }
}
