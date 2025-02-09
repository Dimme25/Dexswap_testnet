'use client';

import React from "react";
import styles from "../styles/Home.module.css";

type Props = {
    type: "native" | "token";
    tokenSymbol?: string;
    tokenBalance?: string;
    current: string;
    setValueAction: (value: string) => void;  // Renamed to match Next.js convention
    max?: string;
    value: string;
};

export default function SwapInput({
    type,
    tokenSymbol,
    tokenBalance,
    setValueAction,  // Updated usage
    value,
    current,
    max,
}: Props) {
    const truncate = (value: string) => {
        if (value === undefined) return;
        if (value.length > 5) {
            return value.slice(0, 5);
        }
        return value;
    };

    return (
        <div className={styles.swapInputContainer}>
            <input
                type="number"
                placeholder="0.0"
                value={value}
                onChange={(e) => setValueAction(e.target.value)}  // Updated usage
                disabled={current !== type}
                className={styles.swapInput}
            />
            <div style={{
                position: "absolute",
                top: "10px",
                right: "10px",
            }}>
                <p style={{
                    fontSize: "12px",
                    marginBottom: "-5px",
                }}>{tokenSymbol}</p>
                <p style={{
                    fontSize: "10px",
                }}>Balance: {truncate(tokenBalance as string)}</p>
                {current === type && (
                    <button
                        onClick={() => setValueAction(max || "0")}  // Updated usage
                        className={styles.maxButton}
                    >Max</button>
                )}
            </div>
        </div>
    );
}
