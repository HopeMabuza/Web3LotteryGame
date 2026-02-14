import React from "react";

export const LotteryStatus = ({ status, isLoading }) => {
  if (!status) {
    return (
      <div className="lottery-status">
        <p>{isLoading ? "Loading..." : "Unable to load lottery status"}</p>
      </div>
    );
  }

  return (
    <div className="lottery-status">
      <h2>Lottery Status</h2>
      <div className="status-info">
        <div className="status-item">
          <label>Status:</label>
          <span className={`status-badge ${status.isOpen ? "open" : "closed"}`}>
            {status.isOpen ? "🟢 OPEN" : "🔴 CLOSED"}
          </span>
        </div>

        <div className="status-item">
          <label>Entry Fee:</label>
          <span>{status.entryFee} ETH</span>
        </div>

        {!status.isOpen && status.winningNumbers && status.winningNumbers.length > 0 && (
          <div className="status-item">
            <label>Winning Numbers:</label>
            <div className="numbers-grid">
              {status.winningNumbers.map((num, idx) => (
                num !== 0 && (
                  <span key={idx} className="number-badge">
                    {num}
                  </span>
                )
              ))}
            </div>
          </div>
        )}

        {status.isOpen && (
          <div className="status-item info">
            <p>The lottery is currently open. Purchase a ticket to participate!</p>
          </div>
        )}
      </div>
    </div>
  );
};
