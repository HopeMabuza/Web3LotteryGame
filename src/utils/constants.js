// Contract configuration
// Update these with your actual contract address and ABI
export const LOTTERY_CONTRACT_ADDRESS = "0x..."; // Replace with your contract address

// Minimal ABI with required functions for the DApp
export const LOTTERY_CONTRACT_ABI = [
  // Read functions
  {
    inputs: [],
    name: "lotteryOpen",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "pendingRewards",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "winningNumbers",
    outputs: [{ internalType: "uint8[7]", name: "", type: "uint8[7]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ENTRY_FEE",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tickets",
    outputs: [
      { internalType: "address", name: "player", type: "address" },
      { internalType: "uint8[7]", name: "numbers", type: "uint8[7]" },
    ],
    stateMutability: "view",
    type: "function",
  },
  // Write functions
  {
    inputs: [{ internalType: "uint8[7]", name: "numbers", type: "uint8[7]" }],
    name: "buyTicket",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "claimRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// Network configuration
export const LOTTERY_CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

// Network configuration
export const SUPPORTED_CHAIN_ID = 31337; // Hardhat local network
export const NETWORK_NAME = "Localhost (Hardhat)";
