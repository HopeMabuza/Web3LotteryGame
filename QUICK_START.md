# Quick Start Guide - Web3 Lottery DApp

## ⚡ 5-Minute Setup

### Step 1: Update Contract Configuration
Edit `src/utils/constants.js` and add your contract details:

```javascript
export const LOTTERY_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890"; // Your contract address

// Paste your contract ABI here (from artifacts/contracts/lotteryGame.sol/lotteryGame.json)
export const LOTTERY_CONTRACT_ABI = [
  // ... your ABI
];
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start Development Server
```bash
npm run dev
```

Visit `http://localhost:5173`

### Step 4: Connect MetaMask
- Have MetaMask installed
- Connect your wallet
- You should be on Sepolia testnet (or update SUPPORTED_CHAIN_ID)

## 🎮 How to Use

### Buy a Lottery Ticket
1. Click "Connect Wallet"
2. Scroll to "Buy a Ticket"
3. Enter 7 numbers (1-47)
4. Click "Buy Ticket"
5. Approve MetaMask transaction
6. Wait for confirmation ✅

### Claim Your Winnings
1. Check "Your Rewards" section
2. If you have pending rewards, click "Claim Rewards"
3. Approve MetaMask transaction
4. Rewards will be sent to your wallet ✅

## 📱 File Structure Summary

```
src/
├── App.jsx                    ← Main app
├── App.css                    ← All styling
├── components/
│   ├── WalletConnect.jsx      ← Connect wallet button
│   ├── LotteryStatus.jsx      ← Show lottery info
│   ├── TicketForm.jsx         ← Buy tickets here
│   ├── RewardsSection.jsx     ← View/claim rewards
│   └── Toast.jsx              ← Notifications
├── hooks/
│   ├── useWeb3.js             ← Wallet connection logic
│   └── useLottery.js          ← Lottery data logic
└── utils/
    ├── constants.js           ← YOUR CONTRACT DETAILS
    └── contractInteraction.js ← Contract function calls
```

## 🔧 Common Issues

| Problem | Solution |
|---------|----------|
| "MetaMask is not installed" | Install from https://metamask.io |
| "Wrong network" | Switch to Sepolia in MetaMask |
| "Contract not found" | Check address in `constants.js` |
| "Transaction failed" | Ensure you have enough ETH for gas + fee |

## 📚 Component Overview

### WalletConnect
- Shows connected account or connect button
- Handles network switching
- Displays errors

### LotteryStatus
- Current lottery state (open/closed)
- Entry fee amount
- Previous winning numbers

### TicketForm
- 7 number inputs (1-47)
- Validation
- Purchase button

### RewardsSection
- Shows pending rewards
- Claim button
- Account info

## 🚀 Production Deployment

```bash
npm run build
```

Deploy `dist/` folder to:
- Vercel: `vercel deploy dist/`
- Netlify: Drag `dist/` folder
- GitHub Pages: Push `dist/` to gh-pages branch

## 💡 Tips

- Numbers must be unique and between 1-47
- Entry fee is paid automatically with ticket purchase
- Lottery status updates every 5 seconds
- Check MetaMask for transaction history
- Keep your private key safe!

## 🔗 Useful Links

- [ethers.js Documentation](https://docs.ethers.org)
- [MetaMask Docs](https://docs.metamask.io)
- [React Hooks Guide](https://react.dev/reference/react)
- [Vite Documentation](https://vitejs.dev)

---

**Need help?** Check the full documentation in `DAPP_README.md`
