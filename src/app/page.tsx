'use client';

import {
  toEther,
  toWei,
  useAddress,
  useBalance,
  useContract,
  useContractRead,
  useContractWrite,
  useTokenBalance,
} from "@thirdweb-dev/react";
import styles from "./styles/Home.module.css";
import { useEffect, useState } from "react";
import SwapInput from "./components/SwapInput";

const Home = () => {
  const TOKEN_CONTRACT = "0xA0B51195a274c96f0E7d7374ee1649994c83fc77";
  const DEX_CONTRACT = "0xE4B71577264934020bcBB7430aa40Cf41fDEc4D6";

  const address = useAddress();
  const { contract: tokenContract } = useContract(TOKEN_CONTRACT);
  const { contract: dexContract } = useContract(DEX_CONTRACT);

  const { data: symbol, error: symbolError } = useContractRead(
    tokenContract,
    "symbol"
  );

  const { data: tokenBalance } = useTokenBalance(tokenContract, address);
  const { data: nativeBalance } = useBalance();
  const { data: contractTokenBalance } = useTokenBalance(
    tokenContract,
    DEX_CONTRACT
  );
  const { data: contractBalance } = useBalance(DEX_CONTRACT);

  const [nativeValue, setNativeValue] = useState<string>("0");
  const [tokenValue, setTokenValue] = useState<string>("0");
  const [currentFrom, setCurrentFrom] = useState<string>("native");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { mutateAsync: swapNativeToken } = useContractWrite(
    dexContract,
    "swapEthToToken"
  );
  const { mutateAsync: swapTokenToNative } = useContractWrite(
    dexContract,
    "swapTokenToEth"
  );
  const { mutateAsync: approveTokenSpending } = useContractWrite(
    tokenContract,
    "approve"
  );

  const isValidReserves =
    contractBalance?.value?.gt(0) && contractTokenBalance?.value?.gt(0);

  const calculateReserves = () => {
    if (!isValidReserves) return [toWei("0"), toWei("0"), toWei("0")];

    const inputAmount = toWei(
      currentFrom === "native" ? nativeValue || "0" : tokenValue || "0"
    );
    const inputReserve = toWei(
      currentFrom === "native"
        ? contractBalance?.value?.toString() || "0"
        : contractTokenBalance?.value?.toString() || "0"
    );
    const outputReserve = toWei(
      currentFrom === "native"
        ? contractTokenBalance?.value?.toString() || "0"
        : contractBalance?.value?.toString() || "0"
    );

    return [inputAmount, inputReserve, outputReserve];
  };

  const { data: amountToGet } = useContractRead(
    dexContract,
    "getAmountOfTokens",
    calculateReserves()
  );

  const executeSwap = async () => {
    setIsLoading(true);
    try {
      if (currentFrom === "native") {
        if (!nativeValue || toWei(nativeValue).eq(0)) {
          alert("Invalid native token amount.");
          return;
        }
        await swapNativeToken({
          overrides: {
            value: toWei(nativeValue),
          },
        });
      } else {
        if (!tokenValue || toWei(tokenValue).eq(0)) {
          alert("Invalid token amount.");
          return;
        }
        await approveTokenSpending({
          args: [DEX_CONTRACT, toWei(tokenValue)],
        });
        await swapTokenToNative({
          args: [toWei(tokenValue)],
        });
      }
      alert("Swap executed successfully!");
    } catch (error) {
      console.error("Swap error:", error);
      alert("An error occurred while executing the swap.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!amountToGet || !isValidReserves) return;

    if (currentFrom === "native") {
      setTokenValue(toEther(amountToGet.toString() || "0"));
    } else {
      setNativeValue(toEther(amountToGet.toString() || "0"));
    }
  }, [amountToGet, isValidReserves, currentFrom]);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div
          style={{
            backgroundColor: "#111",
            padding: "2rem",
            borderRadius: "10px",
            minWidth: "500px",
          }}
        >
          <SwapInput
            current={currentFrom}
            type="native"
            max={nativeBalance?.displayValue || "0"}
            value={nativeValue}
            setValueAction={setNativeValue}
            tokenSymbol="AVAX"
            tokenBalance={nativeBalance?.displayValue || "0"}
          />
          <button
            onClick={() =>
              setCurrentFrom(currentFrom === "native" ? "token" : "native")
            }
            className={styles.toggleButton}
          >
            ↓
          </button>
          <SwapInput
            current={currentFrom}
            type="token"
            max={tokenBalance?.displayValue || "0"}
            value={tokenValue}
            setValueAction={setTokenValue}
            tokenSymbol={symbolError ? "TOKEN" : (symbol as string)} // Fallback to "TOKEN" on error
            tokenBalance={tokenBalance?.displayValue || "0"}
          />
          {address ? (
            <div style={{ textAlign: "center" }}>
              <button
                onClick={executeSwap}
                disabled={isLoading}
                className={styles.swapButton}
              >
                {isLoading ? "Loading..." : "Swap"}
              </button>
            </div>
          ) : (
            <p>Connect wallet to exchange.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
