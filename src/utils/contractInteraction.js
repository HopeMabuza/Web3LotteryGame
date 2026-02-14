import { ethers } from "ethers";
import { LOTTERY_CONTRACT_ADDRESS, LOTTERY_CONTRACT_ABI } from "./constants";

// Get contract instance
export const getContract = (provider) => {
  if (!provider) return null;
  return new ethers.Contract(LOTTERY_CONTRACT_ADDRESS, LOTTERY_CONTRACT_ABI, provider);
};

// Get signer contract instance (for write operations)
export const getSignerContract = (signer) => {
  if (!signer) return null;
  return new ethers.Contract(
    LOTTERY_CONTRACT_ADDRESS,
    LOTTERY_CONTRACT_ABI,
    signer
  );
};

// Fetch lottery status
export const getLotteryStatus = async (contract) => {
  if (!contract) return null;
  
  try {
    const isOpen = await contract.lotteryOpen();
    const winningNumbers = await contract.winningNumbers();
    const entryFee = await contract.ENTRY_FEE();
    
    return {
      isOpen,
      winningNumbers: Array.from(winningNumbers),
      entryFee: ethers.formatEther(entryFee),
    };
  } catch (error) {
    console.error("Error fetching lottery status:", error);
    return null;
  }
};

// Fetch pending rewards for user
export const getPendingRewards = async (contract, userAddress) => {
  if (!contract || !userAddress) return "0";
  
  try {
    const rewards = await contract.pendingRewards(userAddress);
    return ethers.formatEther(rewards);
  } catch (error) {
    console.error("Error fetching pending rewards:", error);
    return "0";
  }
};

// Buy a lottery ticket
export const buyTicket = async (signer, numbers) => {
  if (!signer || !numbers || numbers.length !== 7) {
    throw new Error("Invalid parameters for buying ticket");
  }
  
  try {
    const contract = getSignerContract(signer);
    const entryFee = await contract.ENTRY_FEE();
    
    // Validate numbers
    for (let num of numbers) {
      if (num < 1 || num > 47 || !Number.isInteger(num)) {
        throw new Error("Numbers must be integers between 1 and 47");
      }
    }
    
    // Convert to uint8 array (keep as JS numbers; ethers will handle encoding)
    const uint8Numbers = numbers.map((n) => Number(n));
    
    const tx = await contract.buyTicket(uint8Numbers, {
      value: entryFee,
    });
    
    const receipt = await tx.wait();
    return receipt;
  } catch (error) {
    console.error("Error buying ticket:", error);
    throw error;
  }
};

// Claim rewards
export const claimRewards = async (signer) => {
  if (!signer) {
    throw new Error("Signer not available");
  }
  
  try {
    const contract = getSignerContract(signer);
    const tx = await contract.claimRewards();
    const receipt = await tx.wait();
    return receipt;
  } catch (error) {
    console.error("Error claiming rewards:", error);
    throw error;
  }
};
