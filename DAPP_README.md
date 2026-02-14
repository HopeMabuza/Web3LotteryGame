# Web3 Lottery Game DApp

A complete React DApp for interacting with the lottery game Solidity contract. Buy lottery tickets, check your rewards, and claim winnings directly from your browser.

## Features

✅ **MetaMask Wallet Integration** - Connect and disconnect wallet with automatic network detection  
✅ **Real-time Lottery Status** - View current lottery state, entry fee, and winning numbers  
✅ **Buy Tickets** - Purchase tickets by selecting 7 numbers (1-47) and paying the entry fee  
✅ **Rewards Dashboard** - View pending rewards and claim them directly  
✅ **Auto-refresh** - Lottery status updates every 5 seconds  
✅ **Responsive Design** - Works seamlessly on desktop and mobile  
✅ **Error Handling** - User-friendly error messages and validation  

## Project Structure

```
src/
├── components/          # React components
│   ├── WalletConnect.jsx      # MetaMask connection UI
│   ├── LotteryStatus.jsx      # Lottery status display
│   ├── TicketForm.jsx         # Ticket purchase form
│   ├── RewardsSection.jsx     # Rewards & claiming UI
│   └── Toast.jsx              # Notification toasts
├── hooks/              # Custom React hooks
│   ├── useWeb3.js             # Web3 wallet connection
│   └── useLottery.js          # Lottery data fetching
├── utils/              # Utility functions
│   ├── constants.js           # Contract address & ABI
│   └── contractInteraction.js # Contract interaction functions
├── App.jsx             # Main app component
├── App.css             # Styling
└── main.jsx            # React entry point
```

## Prerequisites

- Node.js 16+ 
- npm or yarn
- MetaMask browser extension
- Access to Sepolia testnet (or modify the network in `src/utils/constants.js`)

## Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure your contract:**
   - Open [src/utils/constants.js](src/utils/constants.js)
   - Replace `LOTTERY_CONTRACT_ADDRESS` with your deployed contract address
   - Update the `LOTTERY_CONTRACT_ABI` with your actual contract ABI (exported from artifacts)
   - Change `SUPPORTED_CHAIN_ID` if using a different network (e.g., 1 for Mainnet)

3. **Start the development server:**
```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Usage

### 1. Connect Your Wallet
- Click "Connect Wallet" button
- Approve the connection in MetaMask
- Ensure you're on the Sepolia testnet (app will prompt you to switch if needed)

### 2. View Lottery Status
- **Status**: Shows if lottery is currently open or closed
- **Entry Fee**: Displays the cost to buy a ticket
- **Winning Numbers**: Shows the previous round's winning numbers (if closed)

### 3. Buy a Ticket
- Enter 7 unique numbers between 1 and 47
- Click "Buy Ticket" 
- Approve the transaction in MetaMask
- Your ticket is now purchased!

### 4. Claim Rewards
- View your pending rewards in the "Your Rewards" section
- If you have pending rewards, click "Claim Rewards"
- Approve the transaction to receive your ETH

## API Reference

### useWeb3 Hook

```javascript
const {
  account,                  // Connected wallet address
  provider,                 // ethers.js provider
  signer,                   // ethers.js signer (for transactions)
  chainId,                  // Current network chain ID
  isConnecting,            // Connection state
  error,                   // Connection error
  isMetaMaskAvailable,     // MetaMask installed
  isCorrectNetwork,        // On correct chain
  connectWallet,           // Function to connect
  disconnectWallet,        // Function to disconnect
  switchToCorrectNetwork,  // Function to switch network
} = useWeb3();
```

### useLottery Hook

```javascript
const {
  lotteryStatus,    // { isOpen, winningNumbers, entryFee }
  pendingRewards,   // User's pending rewards in ETH
  isLoading,        // Loading state
  error,            // Error message
  refetch,          // Function to manually refresh data
} = useLottery(provider, account);
```

### Contract Functions

```javascript
// Get contract instance (read-only)
const contract = getContract(provider);

// Get signer contract (for transactions)
const signerContract = getSignerContract(signer);

// Buy a ticket
await buyTicket(signer, [5, 12, 23, 34, 41, 42, 47]); // Array of 7 numbers

// Claim rewards
await claimRewards(signer);

// Fetch lottery status
const status = await getLotteryStatus(contract);

// Fetch pending rewards
const rewards = await getPendingRewards(contract, walletAddress);
```

## Customization

### Network Configuration
To use a different network, update [src/utils/constants.js](src/utils/constants.js):

```javascript
export const SUPPORTED_CHAIN_ID = 1; // Mainnet
export const NETWORK_NAME = "Ethereum Mainnet";
```

### Styling
The entire app styling is in [src/App.css](src/App.css). Modify CSS variables at the top:

```css
:root {
  --primary-color: #6366f1;
  --secondary-color: #8b5cf6;
  --success-color: #10b981;
  --error-color: #ef4444;
  /* ... more colors ... */
}
```

### Contract ABI
If your contract has additional functions, update [src/utils/constants.js](src/utils/constants.js) with the full ABI.

## Building for Production

```bash
npm run build
```

Output will be in the `dist` folder. Deploy to any static hosting service (Vercel, Netlify, etc.).

## Troubleshooting

**"MetaMask is not installed"**
- Install MetaMask from https://metamask.io

**"Wrong network"**
- Ensure you're on Sepolia testnet (or modify `SUPPORTED_CHAIN_ID`)
- Click "Switch Network" button

**"Failed to purchase ticket"**
- Check you have enough ETH for the entry fee
- Verify the contract address in constants is correct
- Ensure the contract is deployed to the right network

**"Contract not found"**
- Verify `LOTTERY_CONTRACT_ADDRESS` is correct
- Check the contract is deployed to your network
- Confirm the ABI is correctly formatted

## Dependencies

- **React 18** - UI framework
- **ethers.js 6** - Ethereum interaction
- **Vite** - Build tool & dev server

## License

MIT

## Support

For issues or questions, check:
1. Console errors (F12 to open DevTools)
2. MetaMask transaction history
3. Contract address & ABI in `src/utils/constants.js`
