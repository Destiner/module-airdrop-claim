const abi = [
  {
    type: "function",
    name: "execute",
    inputs: [{ name: "data", type: "bytes", internalType: "bytes" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "isInitialized",
    inputs: [
      { name: "smartAccount", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isModuleType",
    inputs: [{ name: "typeID", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "name",
    inputs: [],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "onInstall",
    inputs: [{ name: "data", type: "bytes", internalType: "bytes" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "onUninstall",
    inputs: [{ name: "data", type: "bytes", internalType: "bytes" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "version",
    inputs: [],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "pure",
  },
  {
    type: "error",
    name: "AlreadyInitialized",
    inputs: [
      { name: "smartAccount", type: "address", internalType: "address" },
    ],
  },
  {
    type: "error",
    name: "NotInitialized",
    inputs: [
      { name: "smartAccount", type: "address", internalType: "address" },
    ],
  },
] as const;

export default abi;
