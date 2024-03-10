import { Address, Hex, encodePacked, keccak256 } from "viem";
import { MerkleTree } from "merkletreejs";

import { getAddress } from "./account";

const airdropContractAddress = "0x49cDC92DF499557F3E7f178a93978386B14AEDA4";
const tokenAddress = "0x1E53588a0f3d3BEf7308655FAEa92eCc9403600f";
const sellTokenAddress = "0xceCB44ef523e82D4F48Db489F0f60c9004314fb5";

interface Recipient {
  address: Address;
  value: bigint;
}

const salts: Hex[] = [
  "0x0000000000000000000000000000000000000000000000000000000000000000",
  "0x0000000000000000000000000000000000000000000000000000000000000001",
  "0x0000000000000000000000000000000000000000000000000000000000000002",
  "0x0000000000000000000000000000000000000000000000000000000000000003",
  "0x0000000000000000000000000000000000000000000000000000000000000004",
  "0x0000000000000000000000000000000000000000000000000000000000000005",
];

const amounts: bigint[] = [
  1000000000000000000n,
  2000000000000000000n,
  3000000000000000000n,
  4000000000000000000n,
  5000000000000000000n,
  6000000000000000000n,
];

function generateLeaf(index: bigint, address: Address, value: bigint) {
  return Buffer.from(
    // Hash in appropriate Merkle format
    keccak256(
      encodePacked(["uint256", "address", "uint256"], [index, address, value])
    ).slice(2),
    "hex"
  );
}

async function getTree(): Promise<MerkleTree> {
  const recipients: Recipient[] = [];

  for (let i = 0; i < salts.length; i++) {
    const address = await getAddress(salts[i]);
    recipients.push({
      address,
      value: amounts[i],
    });
  }
  return new MerkleTree(
    // Generate leafs
    recipients.map(({ address, value }, index) =>
      generateLeaf(BigInt(index), address, value)
    ),
    // Hashing function
    keccak256,
    { sortPairs: true }
  );
}

async function getProof(index: number): Promise<Hex[]> {
  const recipients: Recipient[] = [];

  for (let i = 0; i < salts.length; i++) {
    const address = await getAddress(salts[i]);
    recipients.push({
      address,
      value: amounts[i],
    });
  }
  const tree = await getTree();
  return tree.getHexProof(
    generateLeaf(
      BigInt(index),
      recipients[index].address,
      recipients[index].value
    )
  ) as Hex[];
}

function getAmount(index: number) {
  return amounts[index];
}

export {
  airdropContractAddress,
  tokenAddress,
  sellTokenAddress,
  getTree,
  getProof,
  getAmount,
};
