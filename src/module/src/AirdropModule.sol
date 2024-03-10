// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import { ERC7579ExecutorBase } from "modulekit/Modules.sol";
import { IERC7579Account, Execution } from "modulekit/Accounts.sol";
import { ModeLib } from "erc7579/lib/ModeLib.sol";
import { UniswapV3Integration } from "modulekit/Integrations.sol";
import { IERC20 } from "forge-std/interfaces/IERC20.sol";
import { ERC20Integration } from "modulekit/Integrations.sol";

interface IAirdropContract {
    function claim(
        uint256 index,
        address account,
        uint256 amount,
        bytes32[] calldata merkleProof
    )
        external;
}

contract AirdropModule is ERC7579ExecutorBase {
    /*//////////////////////////////////////////////////////////////////////////
                                     CONFIG
    //////////////////////////////////////////////////////////////////////////*/

    /* Initialize the module with the given data
     * @param data The data to initialize the module with
     */

    // global immutable variable that is the claimer fee
    uint256 immutable claimerFeePercentage = 1; // assume 1% fee
    address sellTokenAddress;
    uint256 swapPercentage;
    uint160 sqrtPriceLimitX96 = 0;
    // set auto-sell percentage
    // set sell token

    function onInstall(bytes calldata data) external override {
        (sellTokenAddress, swapPercentage) = abi.decode(data, (address, uint256));
    }
    /* De-initialize the module with the given data
     * @param data The data to de-initialize the module with
     */

    function onUninstall(bytes calldata data) external override { }

    /*
     * Check if the module is initialized
     * @param smartAccount The smart account to check
     * @return true if the module is initialized, false otherwise
     */
    function isInitialized(address smartAccount) external view returns (bool) { }

    /*//////////////////////////////////////////////////////////////////////////
                                     MODULE LOGIC
    //////////////////////////////////////////////////////////////////////////*/

    /**
     * ERC-7579 does not define any specific interface for executors, so the
     * executor can implement any logic that is required for the specific usecase.
     */
    function execute(bytes calldata data) external {
        // Decode the data to get claim details, such as merkleProof, claimAmount, etc.
        (
            address airdropContractAddress,
            address airdropTokenAddress,
            uint256 claimIndex,
            address account,
            uint256 claimAmount,
            bytes32[] memory merkleProof
        ) = abi.decode(data, (address, address, uint256, address, uint256, bytes32[]));

        // Call the airdrop contract to verify the merkle proof and execute the claim
        // Swap a portion of the claimed token to the sell token
        // Transfer a portion of the claimed token as a fee to the claimer

        // Call the airdrop contract to verify the merkle proof and execute the claim
        IAirdropContract(airdropContractAddress).claim(
            claimIndex, account, claimAmount, merkleProof
        );

        // Swap a portion of the claimed token to the sell token
        uint256 swapAmount = (claimAmount * swapPercentage) / 100;
        if (swapAmount > 0) {
            // Perform the swap
            Execution[] memory executions = UniswapV3Integration.approveAndSwap({
                smartAccount: account,
                tokenIn: IERC20(airdropTokenAddress),
                tokenOut: IERC20(sellTokenAddress),
                amountIn: swapAmount,
                sqrtPriceLimitX96: sqrtPriceLimitX96
            });

            // Execute swap
            _execute(account, executions);
        }

        // Transfer a portion of the claimed token as a fee to the claimer
        uint256 feeAmount = (claimAmount * claimerFeePercentage) / 100;
        if (feeAmount > 0) {
            // Prepare the transferFrom call as an execution
            Execution[] memory feeTransferExecutions = new Execution[](1);
            feeTransferExecutions[0] =
                ERC20Integration.transfer(IERC20(airdropTokenAddress), msg.sender, feeAmount);
            // Execute the transferFrom call
            _execute(account, feeTransferExecutions);
        }
    }

    /*//////////////////////////////////////////////////////////////////////////
                                     METADATA
    //////////////////////////////////////////////////////////////////////////*/

    /**
     * The name of the module
     * @return name The name of the module
     */
    function name() external pure returns (string memory) {
        return "AirdropModule";
    }

    /**
     * The version of the module
     * @return version The version of the module
     */
    function version() external pure returns (string memory) {
        return "0.0.1";
    }

    /* 
        * Check if the module is of a certain type
        * @param typeID The type ID to check
        * @return true if the module is of the given type, false otherwise
        */
    function isModuleType(uint256 typeID) external pure override returns (bool) {
        return typeID == TYPE_EXECUTOR;
    }
}
