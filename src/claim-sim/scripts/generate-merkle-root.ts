import { Address, encodePacked, keccak256 } from "viem";
import { MerkleTree } from "merkletreejs";

interface Recipient {
  address: Address;
  value: bigint;
}

const recipients: Recipient[] = [
  {
    address: "0x34a58602Ac47353B8883d3437463D283eB1bc588",
    value: 1000000000000000000n,
  },
  {
    address: "0xe7c0ABb3A8B3F725A2b031efb8cee1a731726D25",
    value: 2000000000000000000n,
  },
  {
    address: "0xfA671A90653bb4e96f8B6A7e43F9287BDf12dd70",
    value: 3000000000000000000n,
  },
  {
    address: "0xCFFd334c7aD0bEba4B4f626e1099d3a3B1378366",
    value: 4000000000000000000n,
  },
  {
    address: "0x9a6De3F5A76D40A14E64cd68C3Fd7d6e36AE9Ad1",
    value: 5000000000000000000n,
  },
  {
    address: "0xFe01a6920C2c398F5805c0fc1312882CE8fF00ec",
    value: 6000000000000000000n,
  },
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

const merkleTree = new MerkleTree(
  // Generate leafs
  recipients.map(({ address, value }, index) =>
    generateLeaf(BigInt(index), address, value)
  ),
  // Hashing function
  keccak256,
  { sortPairs: true }
);

// Collect and log merkle root
const merkleRoot: string = merkleTree.getHexRoot();

console.log("Merkle Root:", merkleRoot);

const proofB = merkleTree.getHexProof(
  generateLeaf(1n, recipients[1].address, recipients[1].value)
);
// const proofs = merkleTree.getHexProofs();

console.log(merkleTree.toString());

console.log("Proof B", proofB);
