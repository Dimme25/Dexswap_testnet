"use client";

import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";

export default function ThirdwebWrapper({ children }: { children: React.ReactNode }) {
  return <ThirdwebProvider activeChain={ChainId.AvalancheFujiTestnet}>{children}</ThirdwebProvider>;
}