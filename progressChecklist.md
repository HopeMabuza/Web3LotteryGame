# Lottery Contract Checklist

## General Features
- [x] Players can buy tickets with **7 numbers** (1–49)
- [x] Each round lasts **5 minutes** (`ROUND_DURATION`)
- [x] Round starts automatically when the **first ticket is bought**
- [x] Only **owner** can draw the winner after the round ends
- [x] Random numbers generated using **Chainlink VRF**
- [x] Winning numbers stored in `winningNumbers[7]`
- [x] Rewards calculated for players with **2+ matching numbers**
- [x] **Owner takes 10% fee** from total pool
- [x] Players can **claim rewards** using `claimReward()`
- [x] Lottery automatically **resets for the next round** after rewards are calculated
- [x] Uses **pull pattern** (`pendingRewards`) to avoid high gas during distribution
- [x] Validates input numbers to ensure they are **1–49**
- [x] Tracks rounds using `roundStartTime` and `lotteryOpen`
- [x] Keeps track of **tickets array** and **pendingRewards mapping**
- [x] Emits events for transparency:
  - [x] `TicketPurchased`
  - [x] `RequestSent`
  - [x] `WinningNumbersGenerated`
  - [x] `RewardClaimed`

## New / Updated Features (Pending Testing)
- [ ] **Winning numbers are unique** (no duplicates) ✅ pending
- [ ] **Winning numbers are sorted in ascending order** ✅ pending
- [ ] **Rollover pool**: leftover ETH after rewards stays in contract for the next round ✅ pending
- [ ] **Only current round tickets cleared**; previous round rewards remain pending ✅ pending
- [ ] **Lottery automatically ready for next round** without manual reset ✅ pending

## Deployment & Usage Checklist
- [x] Deploy contract with **Chainlink VRF subscription ID**
- [x] Buy a ticket using `buyTicket()` (include 7 numbers and ENTRY_FEE)
- [x] Wait **5 minutes** for the round to end
- [x] Owner calls `drawWinner()` to request VRF random numbers
- [x] Wait for **Chainlink VRF callback** (`fulfillRandomWords()`)
- [x] Players call `claimReward()` to receive ETH if matched ≥2 numbers
- [x] New round starts automatically when first ticket is bought

## Notes
- ⚠️ Ensure **MetaMask gas fees** are sufficient for each transaction
- ⚠️ Do **not send ETH manually** to the contract — always use `buyTicket()`
- 🔍 Monitor **events in Remix**:
  - `TicketPurchased`
  - `RequestSent`
  - `WinningNumbersGenerated`
  - `RewardClaimed`
