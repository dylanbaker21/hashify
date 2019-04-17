export const PROXY_ADDRESS = "0xdF5AeE5EBd82A0ebCc1056713724ef0E106c4E41";

export const HASHIFY_ABI = [
  {
    constant: false,
    inputs: [
      {
        name: "_index",
        type: "uint256"
      }
    ],
    name: "deleteHash",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "getHashes",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
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
        name: "_address",
        type: "address"
      },
      {
        name: "_index",
        type: "uint256"
      }
    ],
    name: "getHashInfo",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
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
  },
  {
    constant: false,
    inputs: [
      {
        name: "_index",
        type: "uint256"
      },
      {
        name: "v",
        type: "uint8"
      },
      {
        name: "r",
        type: "bytes32"
      },
      {
        name: "s",
        type: "bytes32"
      }
    ],
    name: "registerVerification",
    outputs: [],
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "hash",
        type: "bytes32"
      },
      {
        indexed: true,
        name: "index",
        type: "uint256"
      },
      {
        indexed: true,
        name: "account",
        type: "address"
      }
    ],
    name: "HashAdded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "hash",
        type: "bytes32"
      },
      {
        indexed: true,
        name: "block",
        type: "uint256"
      },
      {
        indexed: true,
        name: "account",
        type: "address"
      }
    ],
    name: "HashVerified",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "hashes",
        type: "bytes32[]"
      },
      {
        indexed: true,
        name: "account",
        type: "address"
      }
    ],
    name: "HashesListed",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "hash",
        type: "bytes32"
      },
      {
        indexed: true,
        name: "verified",
        type: "bool"
      },
      {
        indexed: true,
        name: "block",
        type: "uint256"
      },
      {
        indexed: false,
        name: "v",
        type: "uint8"
      },
      {
        indexed: false,
        name: "r",
        type: "bytes32"
      },
      {
        indexed: false,
        name: "s",
        type: "bytes32"
      }
    ],
    name: "HashInfo",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "account",
        type: "address"
      },
      {
        indexed: true,
        name: "hash",
        type: "bytes32"
      }
    ],
    name: "HashDeleted",
    type: "event"
  }
];
