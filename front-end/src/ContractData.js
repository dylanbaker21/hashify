export const HASHIFY_ADDRESS = "0xB613b2E8794c2a4aeb1a6E4B802238BEC1CFBC92";

export const HASHIFY_ABI = [
  {
    constant: false,
    inputs: [
      {
        name: "_hash",
        type: "bytes32"
      }
    ],
    name: "addHash",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "_index",
        type: "uint256"
      }
    ],
    name: "deleteHash",
    outputs: [
      {
        name: "hash",
        type: "bytes32[]"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    constant: true,
    inputs: [],
    name: "getHashes",
    outputs: [
      {
        name: "hash",
        type: "bytes32[]"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "_index",
        type: "uint256"
      }
    ],
    name: "getSpecificHash",
    outputs: [
      {
        name: "hash",
        type: "bytes32"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [
      {
        name: "",
        type: "address"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  }
];
