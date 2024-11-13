import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";

export const SUPPORTED_CHAIN = 84532;

const baseSepolia = {
    chainId: SUPPORTED_CHAIN,
    name: "Base Sepolia",
    currency: "ETH",
    explorerUrl: 'https://sepolia.basescan.org/',
    rpcUrl: import.meta.env.VITE_rpc_url,
};

const metadata = {
    name: "My Website",
    description: "My Website description",
    url: "https://mywebsite.com", // origin must match your domain & subdomain
    icons: ["https://avatars.mywebsite.com/"],
};

export const configureWeb3Modal = () =>
    createWeb3Modal({
        ethersConfig: defaultConfig({ metadata }),
        chains: [baseSepolia],
        projectId: import.meta.env.VITE_projectId,
        enableAnalytics: false, // Optional - defaults to your Cloud configuration
    });
