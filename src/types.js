/**
 * Type definitions for the Lottery DApp
 * Optional: Add this file for TypeScript support in JSDoc
 */

/**
 * @typedef {Object} LotteryStatus
 * @property {boolean} isOpen - Whether lottery is currently open
 * @property {number[]} winningNumbers - Array of 7 winning numbers
 * @property {string} entryFee - Entry fee in ETH
 */

/**
 * @typedef {Object} Web3State
 * @property {string|null} account - Connected wallet address
 * @property {Object|null} provider - ethers.js provider
 * @property {Object|null} signer - ethers.js signer
 * @property {number|null} chainId - Current chain ID
 * @property {boolean} isConnecting - Connection in progress
 * @property {string|null} error - Error message
 * @property {boolean} isMetaMaskAvailable - MetaMask installed
 * @property {boolean} isCorrectNetwork - On correct chain
 * @property {Function} connectWallet - Connect wallet function
 * @property {Function} disconnectWallet - Disconnect wallet function
 * @property {Function} switchToCorrectNetwork - Switch network function
 */

/**
 * @typedef {Object} LotteryState
 * @property {LotteryStatus|null} lotteryStatus - Current lottery status
 * @property {string} pendingRewards - Pending rewards in ETH
 * @property {boolean} isLoading - Loading state
 * @property {string|null} error - Error message
 * @property {Function} refetch - Refetch data function
 */

/**
 * @typedef {Object} ToastState
 * @property {string} message - Toast message
 * @property {'success'|'error'} type - Toast type
 */

export {};
