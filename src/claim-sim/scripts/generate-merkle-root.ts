import { Address, encodePacked, keccak256 } from "viem";

import { getTree, getProof } from "../utils/airdrop";

async function main() {
  const tree = await getTree();
  const proof = await getProof(0);
  console.log(tree.toString());
  console.log("Proof", proof);
}

main();
