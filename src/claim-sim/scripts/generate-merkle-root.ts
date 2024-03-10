import { Address, encodePacked, keccak256 } from "viem";
import { MerkleTree } from "merkletreejs";

interface Recipient {
  address: Address;
  value: bigint;
}

const recipients: Recipient[] = [
  {
    address: "0xa0cF798816D4b9B9866b5330eEa46A18382f2510",
    value: 1000000000000000000n,
  },
  {
    address: "0xA0CF798816d4b9b9866b5330EEA46A18382f2511",
    value: 2000000000000000000n,
  },
  {
    address: "0xA0cf798816d4B9b9866b5330EeA46a18382f2512",
    value: 3000000000000000000n,
  },
  {
    address: "0xa0CF798816d4B9b9866b5330eeA46A18382F2513",
    value: 4000000000000000000n,
  },
  {
    address: "0xa0cf798816d4B9B9866b5330EEa46a18382F2514",
    value: 5000000000000000000n,
  },
  {
    address: "0xa0cF798816D4b9b9866b5330EeA46a18382F2515",
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
