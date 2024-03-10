# module-claim

An ERC7579-compatible smart account module that enables automatic

## How it works

Any compatible wallet can install the module. A user can specify whether to sell a portion of the airdrop (e.g. to cover taxes). In that case, the share will be exchanged on Uniswpa V3 to a desired token (e.g. USDC).

A module rewards the claimer with a small share of the airdrop to cover the gas costs and the operational expenses.

## Repositor Structure

- `src/airdrop`: Ancillary contracts for the simulation
- `src/claim-sim`: Simulation scripts in Typescript
- `src/module`: The module contract

## Example

- Wallet Creation: https://sepolia.etherscan.io/tx/0x1fb8efd41906ca222ed1dbbeba691e55dd6fc817aed64e405478b15cb7bb7185
- Claim: https://sepolia.etherscan.io/tx/0x61ef8ca76a5b6b51f9593655668a2f0a786557147d3170c6e328a0cfed57dd3e
- Token Contract: https://sepolia.etherscan.io/token/0x1e53588a0f3d3bef7308655faea92ecc9403600f
- Merkle Airdrop Contract: https://sepolia.etherscan.io/address/0x49cdc92df499557f3e7f178a93978386b14aeda4
- Module: https://sepolia.etherscan.io/address/0xbe684c68740db2f4efa0609dcd8ed443031f98f3
