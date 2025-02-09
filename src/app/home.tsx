import { Metadata } from "next";
import Home from "./page"; // Import the client component

// Setting up the metadata for the page
export const metadata: Metadata = {
  title: "Swap Tokens - Thirdweb DEX",
  description: "Swap native tokens for ERC20 tokens using the Thirdweb SDK in a decentralized exchange.",
};

export default function Page() {
  return <Home />;
}
