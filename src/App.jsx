import React, { useState } from "react";
import { useWeb3 } from "./hooks/useWeb3";
import { useLottery } from "./hooks/useLottery";
import { WalletConnect } from "./components/WalletConnect";
import { LotteryStatus } from "./components/LotteryStatus";
import { TicketForm } from "./components/TicketForm";
import { RewardsSection } from "./components/RewardsSection";
import { Toast } from "./components/Toast";
import "./App.css";

function App() {
  const {
    account,
    provider,
    signer,
    isConnecting,
    error: walletError,
    isMetaMaskAvailable,
    isCorrectNetwork,
    connectWallet,
    disconnectWallet,
    switchToCorrectNetwork,
  } = useWeb3();

  const { lotteryStatus, pendingRewards, isLoading: statusLoading, refetch } = useLottery(
    provider,
    account
  );

  const [toast, setToast] = useState({ message: "", type: "" });

  const handleShowToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleCloseToast = () => {
    setToast({ message: "", type: "" });
  };

  const handleTicketSuccess = (message) => {
    handleShowToast(message, "success");
    refetch();
  };

  const handleRewardSuccess = (message) => {
    handleShowToast(message, "success");
    refetch();
  };

  const handleError = (error) => {
    handleShowToast(error, "error");
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🎰 Web3 Lottery Game</h1>
          <WalletConnect
            account={account}
            isConnecting={isConnecting}
            isMetaMaskAvailable={isMetaMaskAvailable}
            isCorrectNetwork={isCorrectNetwork}
            error={walletError}
            onConnect={connectWallet}
            onDisconnect={disconnectWallet}
            onSwitchNetwork={switchToCorrectNetwork}
          />
        </div>
      </header>

      <main className="app-main">
        {account && isCorrectNetwork && (
          <div className="container">
            <section className="section">
              <LotteryStatus status={lotteryStatus} isLoading={statusLoading} />
            </section>

            {lotteryStatus && (
              <>
                <section className="section">
                  <TicketForm
                    signer={signer}
                    isOpen={lotteryStatus.isOpen}
                    onSuccess={handleTicketSuccess}
                    onError={handleError}
                  />
                </section>

                <section className="section">
                  <RewardsSection
                    pendingRewards={pendingRewards}
                    signer={signer}
                    account={account}
                    onSuccess={handleRewardSuccess}
                    onError={handleError}
                  />
                </section>
              </>
            )}
          </div>
        )}

        {(!account || !isCorrectNetwork) && (
          <div className="placeholder">
            <p>🔗 Connect your wallet to get started</p>
          </div>
        )}
      </main>

      <Toast message={toast.message} type={toast.type} onClose={handleCloseToast} />
    </div>
  );
}

export default App;
