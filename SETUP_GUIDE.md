# Setup Verification & Configuration Guide

## ✅ Pre-Setup Checklist

Before starting, ensure you have:
- [ ] Node.js 16+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] MetaMask browser extension installed
- [ ] Some ETH on Sepolia testnet for gas fees
- [ ] Your lottery contract deployed to Sepolia

## 📋 Step-by-Step Setup

### Step 1: Install Dependencies
```bash
cd /home/hopey/Blockchain/ABC/Web3LotteryGame
npm install
```

**Expected output:** Should see "added XX packages" and complete without errors.

### Step 2: Get Your Contract ABI

1. Open `artifacts/contracts/lotteryGame.sol/lotteryGame.json`
2. Copy the entire `abi` array (starts with `[` and ends with `]`)
3. Open `src/utils/constants.js`
4. Replace the placeholder ABI with your contract's ABI

### Step 3: Get Your Contract Address

1. Find your deployed contract address
2. In `src/utils/constants.js`, replace:
```javascript
export const LOTTERY_CONTRACT_ADDRESS = "0x...";
```

Example:
```javascript
export const LOTTERY_CONTRACT_ADDRESS = "0x1a2B3c4D5e6F7890aB1cD2eF3G4h5I6jK7l8M9nO";
```

### Step 4: Verify Network Configuration

Check `src/utils/constants.js` for the correct network:

```javascript
// For Sepolia (current default)
export const SUPPORTED_CHAIN_ID = 11155111;
export const NETWORK_NAME = "Sepolia";

// For other networks:
// Mainnet: 1
// Polygon: 137
// Mumbai: 80001
```

### Step 5: Start Development Server

```bash
npm run dev
```

Expected output:
```
➜  Local:   http://localhost:5173/
➜  press h to show help
```

Browser should open automatically. If not, visit `http://localhost:5173`

### Step 6: MetaMask Setup

1. Open MetaMask
2. Make sure you're on **Sepolia** testnet
3. Ensure you have testnet ETH:
   - Sepolia Faucet: https://sepoliafaucet.com/

### Step 7: Test the DApp

1. Click "Connect Wallet"
2. Approve in MetaMask
3. You should see:
   - ✅ Your connected address
   - ✅ Lottery status
   - ✅ Ticket form (if lottery open)
   - ✅ Rewards section

## 🔍 Troubleshooting

### Issue: "Cannot find module 'react'"
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "LOTTERY_CONTRACT_ADDRESS is undefined"
**Solution:** 
Check `src/utils/constants.js` - contract address must be set correctly. Example:
```javascript
// ❌ WRONG
export const LOTTERY_CONTRACT_ADDRESS = "0x...";

// ✅ CORRECT
export const LOTTERY_CONTRACT_ADDRESS = "0x1234567890abcdef";
```

### Issue: "No such file or directory 'node_modules'"
**Solution:**
```bash
npm install
```

### Issue: "MetaMask is not installed"
**Solution:**
Install MetaMask: https://metamask.io

### Issue: "You're on the wrong network"
**Solution:**
1. Open MetaMask
2. Click network dropdown (top-left)
3. Switch to "Sepolia"

### Issue: "Failed to purchase ticket"
**Possible causes:**
- Not enough ETH for gas + entry fee
- Contract address is wrong
- Contract ABI is incomplete/wrong
- Contract not deployed to this network

**Solution:**
1. Check contract address in `constants.js`
2. Check contract is deployed to Sepolia
3. Check you have enough testnet ETH
4. Check full contract ABI is pasted correctly

### Issue: Port 5173 already in use
**Solution:**
```bash
npm run dev -- --port 5174
```

## 📝 Configuration Files Reference

### `src/utils/constants.js` - MUST UPDATE
```javascript
// 1. Set your contract address
export const LOTTERY_CONTRACT_ADDRESS = "0x...";

// 2. Paste your full contract ABI
export const LOTTERY_CONTRACT_ABI = [ /* ... */ ];

// 3. Set correct network (optional)
export const SUPPORTED_CHAIN_ID = 11155111;
```

### `package.json` - Already configured
All dependencies are set up. Just run `npm install`

### `vite.config.js` - Already configured
Server runs on port 5173 with hot reload enabled

## 🔐 Security Notes

⚠️ **IMPORTANT:**
- Never put private keys in frontend code
- Never commit `.env` files to git
- Never expose contract address publicly (OK for testnet only)
- Use `.env.example` as template
- Check `.gitignore` includes sensitive files

## 📊 Folder Structure Verification

After setup, your project should look like:

```
Web3LotteryGame/
├── src/
│   ├── components/
│   │   ├── LotteryStatus.jsx      ✅
│   │   ├── RewardsSection.jsx     ✅
│   │   ├── TicketForm.jsx         ✅
│   │   ├── Toast.jsx              ✅
│   │   └── WalletConnect.jsx      ✅
│   ├── hooks/
│   │   ├── useLottery.js          ✅
│   │   └── useWeb3.js             ✅
│   ├── utils/
│   │   ├── constants.js           ✅ (NEEDS UPDATE)
│   │   └── contractInteraction.js ✅
│   ├── App.jsx                    ✅
│   ├── App.css                    ✅
│   ├── main.jsx                   ✅
│   ├── index.css                  ✅
│   └── types.js                   ✅
├── index.html                     ✅
├── vite.config.js                 ✅
├── package.json                   ✅
└── node_modules/                  (created by npm install)
```

## 🚀 Next Steps After Setup

1. **Buy a Ticket:**
   - Click "Connect Wallet"
   - Enter 7 numbers
   - Click "Buy Ticket"
   - Confirm in MetaMask

2. **Check Rewards:**
   - Scroll to "Your Rewards" section
   - If rewards available, click "Claim Rewards"
   - Confirm transaction

3. **Build for Production:**
   ```bash
   npm run build
   ```
   Output in `dist/` folder

## 🆘 Getting Help

If something goes wrong:

1. **Check console errors:** Press `F12` in browser
2. **Check MetaMask:** Open MetaMask to see transaction status
3. **Check contract:** Verify it's deployed and working
4. **Read docs:** Check `DAPP_README.md` or `QUICK_START.md`

## ✨ You're All Set!

Your DApp is ready to use. Just:

1. Update `src/utils/constants.js`
2. Run `npm install && npm run dev`
3. Connect MetaMask
4. Start using! 🎰

---

**Need more help?** See `DAPP_README.md` for complete documentation.
