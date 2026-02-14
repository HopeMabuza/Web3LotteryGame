import React, { useState } from "react";
import { claimRewards } from "../utils/contractInteraction";

export const RewardsSection = ({ pendingRewards, signer, account, onSuccess, onError }) => {
  const [isClaiming, setIsClaiming] = useState(false);

  const handleClaimRewards = async () => {
    if (!signer) {
      onError("Please connect your wallet");
      return;
    }

    setIsClaiming(true);

    try {
      await claimRewards(signer);
      onSuccess("Rewards claimed successfully!");
    } catch (error) {
      onError(error.message || "Failed to claim rewards");
    } finally {
      setIsClaiming(false);
    }
  };

  const hasRewards = parseFloat(pendingRewards) > 0;

  return (
    <div className="rewards-section">
      <h2>Your Rewards</h2>

      <div className="rewards-info">
        <div className="rewards-amount">
          <span className="label">Pending Rewards:</span>
          <span className={`amount ${hasRewards ? "positive" : ""}`}>
            {parseFloat(pendingRewards).toFixed(6)} ETH
          </span>
        </div>

        <div className="rewards-account">
          <span className="label">Account:</span>
          <span className="account-addr">
            {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Not connected"}
          </span>
        </div>
      </div>

      {hasRewards && (
        <button
          onClick={handleClaimRewards}
          disabled={isClaiming || !signer}
          className="claim-btn"
        >
          {isClaiming ? "Claiming..." : "Claim Rewards"}
        </button>
      )}

      {!hasRewards && account && (
        <p className="no-rewards">No pending rewards to claim</p>
      )}

      {!account && (
        <p className="not-connected">Connect your wallet to see rewards</p>
      )}
    </div>
  );
};
