import { Address, encodePacked, keccak256 } from "viem";

import { merkleTree, getProof } from "../utils/airdrop";

console.log(merkleTree.toString());

console.log("Proof", getProof(0));
