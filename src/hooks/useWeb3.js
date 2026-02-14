import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { SUPPORTED_CHAIN_ID, NETWORK_NAME } from "../utils/constants";

export const useWeb3 = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Check if MetaMask is available
  const isMetaMaskAvailable = useCallback(() => {
    return typeof window !== "undefined" && typeof window.ethereum !== "undefined";
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (!isMetaMaskAvailable()) {
      setError("MetaMask is not installed");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      // Create provider and signer
      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      const ethersSigner = await ethersProvider.getSigner();
      const network = await ethersProvider.getNetwork();

      setAccount(accounts[0]);
      setProvider(ethersProvider);
      setSigner(ethersSigner);
      setChainId(Number(network.chainId));

      // Check if on correct network
      if (Number(network.chainId) !== SUPPORTED_CHAIN_ID) {
        await switchToCorrectNetwork();
      }
    } catch (err) {
      setError(err.message);
      console.error("Error connecting wallet:", err);
    } finally {
      setIsConnecting(false);
    }
  }, [isMetaMaskAvailable]);

  // Switch to correct network
  const switchToCorrectNetwork = useCallback(async () => {
    if (!isMetaMaskAvailable()) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${SUPPORTED_CHAIN_ID.toString(16)}` }],
      });
    } catch (err) {
      if (err.code === 4902) {
        // Network not added, user needs to add it manually
        setError(`Please manually switch to ${NETWORK_NAME} network in MetaMask`);
      } else {
        setError("Failed to switch network");
      }
    }
  }, [isMetaMaskAvailable]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setChainId(null);
    setError(null);
  }, []);

  // Listen to account changes
  useEffect(() => {
    if (!isMetaMaskAvailable()) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
      }
    };

    const handleChainChanged = (chainIdHex) => {
      setChainId(parseInt(chainIdHex, 16));
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [account, isMetaMaskAvailable, disconnectWallet]);

  const isCorrectNetwork = chainId === SUPPORTED_CHAIN_ID;

  return {
    account,
    provider,
    signer,
    chainId,
    isConnecting,
    error,
    isMetaMaskAvailable: isMetaMaskAvailable(),
    isCorrectNetwork,
    connectWallet,
    disconnectWallet,
    switchToCorrectNetwork,
  };
};
