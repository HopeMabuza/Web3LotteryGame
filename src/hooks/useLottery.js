import { useState, useEffect, useCallback } from "react";
import { getContract, getPendingRewards } from "../utils/contractInteraction";

export const useLottery = (provider, account) => {
  const [lotteryStatus, setLotteryStatus] = useState(null);
  const [pendingRewards, setPendingRewards] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const contract = getContract(provider);

  // Fetch lottery status
  const fetchLotteryStatus = useCallback(async () => {
    if (!contract) return;

    setIsLoading(true);
    setError(null);

    try {
      const isOpen = await contract.lotteryOpen();
      const winningNumbers = await contract.winningNumbers();
      const entryFee = await contract.ENTRY_FEE();

      setLotteryStatus({
        isOpen,
        winningNumbers: Array.from(winningNumbers),
        entryFee: ethers.formatEther(entryFee),
      });
    } catch (err) {
      setError("Failed to fetch lottery status");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [contract]);

  // Fetch pending rewards
  const fetchPendingRewards = useCallback(async () => {
    if (!contract || !account) return;

    try {
      const rewards = await getPendingRewards(contract, account);
      setPendingRewards(rewards);
    } catch (err) {
      console.error("Error fetching rewards:", err);
    }
  }, [contract, account]);

  // Initial fetch
  useEffect(() => {
    if (contract) {
      fetchLotteryStatus();
      if (account) {
        fetchPendingRewards();
      }
    }
  }, [contract, account, fetchLotteryStatus, fetchPendingRewards]);

  // Refetch every 5 seconds
  useEffect(() => {
    if (!contract) return;

    const interval = setInterval(() => {
      fetchLotteryStatus();
      if (account) {
        fetchPendingRewards();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [contract, account, fetchLotteryStatus, fetchPendingRewards]);

  return {
    lotteryStatus,
    pendingRewards,
    isLoading,
    error,
    refetch: () => {
      fetchLotteryStatus();
      if (account) fetchPendingRewards();
    },
  };
};
