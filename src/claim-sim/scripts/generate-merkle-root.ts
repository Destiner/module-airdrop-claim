import { Address, encodePacked, keccak256 } from "viem";
import { MerkleTree } from "merkletreejs";

interface Recipient {
  address: Address;
  value: bigint;
}

const recipients: Recipient[] = [
  {
    address: "0x0c67f5b79861e5b7166cdca9c50d6969f154c018",
    value: 1000000000000000000n,
  },
  {
    address: "0xfF7a3220f63c4412407D45aBD82A5Fd89077C6cD",
    value: 2000000000000000000n,
  },
  {
    address: "0xBA36a6c52f991b97fB923D3530a0deEb07488b84",
    value: 3000000000000000000n,
  },
  {
    address: "0x5aa291FCC1674BCe7405c18C10042FD2c124EDf0",
    value: 4000000000000000000n,
  },
  {
    address: "0xd564686e5076e4e92a525fD3217b0bDbBED61887",
    value: 5000000000000000000n,
  },
  {
    address: "0x97A24cE739c7BB2d0940A3C1f98d04Bee0DDB57e",
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

const proof = merkleTree.getHexProof(
  generateLeaf(0n, recipients[0].address, recipients[0].value)
);
// const proofs = merkleTree.getHexProofs();

console.log(merkleTree.toString());

console.log("Proof", proof);
