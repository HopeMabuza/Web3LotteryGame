# 📱 DApp UI Components Overview

## App Layout

```
┌─────────────────────────────────────────────────┐
│  🎰 Web3 Lottery Game          [Connect Wallet]  │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ 💼 Lottery Status                        │  │
│  ├──────────────────────────────────────────┤  │
│  │ Status: 🟢 OPEN                         │  │
│  │ Entry Fee: 0.000000000000000001 ETH     │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ 🎟️ Buy a Ticket                          │  │
│  ├──────────────────────────────────────────┤  │
│  │ [5] [12] [23] [34] [41] [42] [47]       │  │
│  │ Selected: 5, 12, 23, 34, 41, 42, 47    │  │
│  │ [         Buy Ticket         ]           │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │ 💰 Your Rewards                         │  │
│  ├──────────────────────────────────────────┤  │
│  │ Pending Rewards: 0.000123 ETH           │  │
│  │ Account: 0x1a2B...M9nO                  │  │
│  │ [       Claim Rewards       ]            │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Component Relationships

```
┌─────────────────────────────────────────────┐
│            App.jsx (Main)                   │
├─────────────────────────────────────────────┤
│ State Management:                           │
│  • toast notifications                      │
│  • calls useWeb3() + useLottery()          │
└────────┬────────────────────────┬───────────┘
         │                        │
    ┌────▼─────┐            ┌────▼──────┐
    │  Header  │            │   Main    │
    └──────────┘            └──────────┘
         │
    ┌────▼──────────────────────┐
    │  WalletConnect            │
    │  - Connect button         │
    │  - Show account           │
    │  - Network warnings       │
    └───────────────────────────┘
         
    ┌────────────────────────────┐
    │  LotteryStatus             │
    │  - Status badge            │
    │  - Entry fee               │
    │  - Winning numbers grid    │
    └────────────────────────────┘
    
    ┌────────────────────────────┐
    │  TicketForm                │
    │  - 7 number inputs         │
    │  - Validation              │
    │  - Submit button           │
    │  - Loading states          │
    └────────────────────────────┘
    
    ┌────────────────────────────┐
    │  RewardsSection            │
    │  - Pending rewards display │
    │  - Account address         │
    │  - Claim button            │
    └────────────────────────────┘
    
    ┌────────────────────────────┐
    │  Toast (Notifications)     │
    │  - Success messages        │
    │  - Error messages          │
    │  - Auto-dismiss (5s)       │
    └────────────────────────────┘
```

## Hook Data Flow

```
useWeb3()
├── State:
│   ├── account: "0x1a2B..."
│   ├── provider: BrowserProvider
│   ├── signer: JsonRpcSigner
│   ├── chainId: 11155111
│   ├── isConnecting: false
│   └── error: null
├── Functions:
│   ├── connectWallet()
│   ├── disconnectWallet()
│   └── switchToCorrectNetwork()
└── Listeners:
    ├── accountsChanged
    └── chainChanged

useLottery(provider, account)
├── State:
│   ├── lotteryStatus:
│   │   ├── isOpen: true
│   │   ├── entryFee: "0.000000000000000001"
│   │   └── winningNumbers: [5, 12, 23, 34, 41, 42, 47]
│   ├── pendingRewards: "0.000123"
│   ├── isLoading: false
│   └── error: null
├── Functions:
│   └── refetch()
└── Auto-refresh:
    └── Every 5 seconds
```

## User Interaction Flow

```
START
  │
  ├─ Visit http://localhost:5173
  │
  ├─ Click "Connect Wallet"
  │  │
  │  └─ MetaMask popup
  │     │
  │     ├─ Approve connection
  │     │  └─ Connected ✅
  │     │
  │     └─ Reject
  │        └─ Show error
  │
  ├─ [If connected & correct network]
  │  │
  │  ├─ View Lottery Status
  │  │  └─ Auto-updates every 5s
  │  │
  │  ├─ [If lottery open]
  │  │  │
  │  │  ├─ Enter 7 numbers
  │  │  │  │
  │  │  │  ├─ Validation:
  │  │  │  │  ├─ 1-47 range ✓
  │  │  │  │  ├─ No duplicates ✓
  │  │  │  │  └─ All 7 numbers ✓
  │  │  │  │
  │  │  │  └─ Click "Buy Ticket"
  │  │  │     │
  │  │  │     ├─ MetaMask popup
  │  │  │     │  │
  │  │  │     │  ├─ Approve
  │  │  │     │  │  │
  │  │  │     │  │  ├─ Transaction sent
  │  │  │     │  │  │
  │  │  │     │  │  └─ Wait for confirmation
  │  │  │     │  │
  │  │  │     │  └─ Reject
  │  │  │     │     └─ Show error toast
  │  │  │     │
  │  │  │     └─ Success toast
  │  │  │        └─ Form resets
  │  │  │           └─ Data refreshes
  │  │  │
  │  │  └─ [If lottery closed]
  │  │     └─ "Lottery is currently closed"
  │  │
  │  └─ View Rewards
  │     │
  │     ├─ [If have pending rewards]
  │     │  │
  │     │  └─ Click "Claim Rewards"
  │     │     │
  │     │     ├─ MetaMask popup
  │     │     │  │
  │     │     │  ├─ Approve
  │     │     │  │  │
  │     │     │  │  ├─ Transaction sent
  │     │     │  │  │
  │     │     │  │  └─ ETH transferred ✓
  │     │     │  │
  │     │     │  └─ Reject
  │     │     │     └─ Show error
  │     │     │
  │     │     └─ Success toast
  │     │
  │     └─ [If no rewards]
  │        └─ "No pending rewards"
  │
  └─ Click "Disconnect"
     └─ Wallet disconnected
```

## API Request Timeline

```
TIME  ACTION                          STATE
────────────────────────────────────────────────────
 t=0  User opens app
      useWeb3() initializes
      
 t=1  User clicks "Connect Wallet"
      connectWallet() called
      │
 t=2  MetaMask popup appears
      
 t=3  User approves connection
      provider + signer created
      
 t=4  useLottery() initializes
      getLotteryStatus() called  
      getPendingRewards() called
      │
 t=5  Status data arrives
      UI renders LotteryStatus
      UI renders TicketForm
      UI renders RewardsSection
      
 t=10 User enters 7 numbers
      Form validates in real-time
      
 t=15 User clicks "Buy Ticket"
      buyTicket(signer, numbers) called
      │
 t=16 MetaMask transaction popup
      
 t=20 User approves transaction
      tx sent to blockchain
      
 t=30 Transaction confirmed
      Toast shows "Ticket purchased!"
      useLottery refetches data
      
 t=31 New data arrives
      Rewards updated
      Form reset to empty
      
 t=35 Auto-refresh triggers
      getLotteryStatus() called again
      getPendingRewards() called again
      
────────────────────────────────────────────────────
(Then repeats every 5 seconds)
```

## Component Props Example

```javascript
<WalletConnect
  account="0x1a2B3c..."          // User's address or null
  isConnecting={false}            // Currently connecting?
  isMetaMaskAvailable={true}      // MetaMask installed?
  isCorrectNetwork={true}         // On correct chain?
  error={null}                    // Error message or null
  onConnect={connectWallet}       // Function to connect
  onDisconnect={disconnectWallet} // Function to disconnect
  onSwitchNetwork={switchNetwork} // Function to switch chain
/>

<LotteryStatus
  status={{                       // Lottery state or null
    isOpen: true,
    entryFee: "0.000001",
    winningNumbers: [5, 12, ...]
  }}
  isLoading={false}               // Still loading?
/>

<TicketForm
  signer={signer}                 // ethers signer for transactions
  isOpen={true}                   // Is lottery accepting tickets?
  onSuccess={handleSuccess}       // Called on successful purchase
  onError={handleError}           // Called on error
/>

<RewardsSection
  pendingRewards="0.000123"       // User's pending ETH
  signer={signer}                 // For claiming rewards
  account="0x1a2B3c..."          // User's address
  onSuccess={handleSuccess}       // Called on successful claim
  onError={handleError}           // Called on error
/>

<Toast
  message="Ticket purchased!"     // Notification text
  type="success"                  // 'success' or 'error'
  onClose={closeToast}            // Called on dismiss
/>
```

## Styling Classes Reference

```css
/* Main containers */
.app                    → Full-screen app wrapper
.app-header            → Top header bar
.app-main              → Main content area
.container             → Max-width wrapper
.section               → Card component

/* Wallet */
.wallet-connect        → Container
.wallet-connect.connected    → Connected state
.wallet-connect.error        → Error state
.wallet-connect.warning      → Warning state

/* Lottery Status */
.lottery-status        → Container
.status-badge          → Status indicator
.status-badge.open     → Green (open)
.status-badge.closed   → Red (closed)
.numbers-grid          → Grid of numbers
.number-badge          → Single number display

/* Ticket Form */
.ticket-form           → Container
.ticket-form.disabled  → Form disabled state
.numbers-input         → Grid of input fields
.selected-numbers      → Display selected numbers
.submit-btn            → Purchase button

/* Rewards */
.rewards-section       → Container
.rewards-info          → Info box
.rewards-amount        → Amount display
.rewards-account       → Account display
.claim-btn             → Claim button

/* Notifications */
.toast                 → Notification container
.toast-success         → Success styling
.toast-error           → Error styling
```

## Color Scheme

```
Primary:     #6366f1 (Indigo)
Secondary:   #8b5cf6 (Purple)
Success:     #10b981 (Green)
Error:       #ef4444 (Red)
Warning:     #f59e0b (Amber)

Dark Background:     #0f172a
Surface:             #1e293b
Border:              #334155
Text Primary:        #f1f5f9
Text Secondary:      #cbd5e1
```

---

This visual guide helps understand how all the components and data flows work together! 🎨
