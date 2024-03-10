import { Address, Hex, encodePacked, keccak256 } from "viem";
import { MerkleTree } from "merkletreejs";

const airdropContractAddress = "0x8c75Ac392b0097AE6Eaf7d7896055211aD3459f2";
const tokenAddress = "0x1E53588a0f3d3BEf7308655FAEa92eCc9403600f";
const sellTokenAddress = "0xceCB44ef523e82D4F48Db489F0f60c9004314fb5";
const claimIndex = 0n;
const claimAmount = 1000000000000000000n;
const merkleProof: Hex[] = [
  "0x300e12ac200996bab07dadbeba6db03a2243136103492bfe2cfa82a0c0fc4b6f",
  "0x24000377fd1fe3aee8994ae25f46994eb193163670ffeac9365086225bfcc8aa",
  "0xda357633cfd8963bdfd7ba9e812af5db35281f49e815f1853f6388b74a9f473b",
];

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

function getProof(index: number): Hex[] {
  return merkleTree.getHexProof(
    generateLeaf(
      BigInt(index),
      recipients[index].address,
      recipients[index].value
    )
  ) as Hex[];
}

function getAmount(index: number) {
  return recipients[index].value;
}

export {
  airdropContractAddress,
  tokenAddress,
  sellTokenAddress,
  merkleTree,
  getProof,
  getAmount,
};
