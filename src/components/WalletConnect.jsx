import React from "react";

export const WalletConnect = ({
  account,
  isConnecting,
  isMetaMaskAvailable,
  isCorrectNetwork,
  error,
  onConnect,
  onDisconnect,
  onSwitchNetwork,
}) => {
  if (!isMetaMaskAvailable) {
    return (
      <div className="wallet-connect error">
        <p>MetaMask is not installed. Please install it to use this DApp.</p>
        <a href="https://metamask.io" target="_blank" rel="noopener noreferrer">
          Install MetaMask
        </a>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wallet-connect error">
        <p>Error: {error}</p>
        <button onClick={onConnect}>Try Again</button>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="wallet-connect">
        <button onClick={onConnect} disabled={isConnecting}>
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      </div>
    );
  }

  if (!isCorrectNetwork) {
    return (
      <div className="wallet-connect warning">
        <p>You're on the wrong network. Please switch to Sepolia testnet.</p>
        <button onClick={onSwitchNetwork}>Switch Network</button>
        <button onClick={onDisconnect} className="secondary">
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="wallet-connect connected">
      <p>Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
      <button onClick={onDisconnect} className="secondary">
        Disconnect
      </button>
    </div>
  );
};
