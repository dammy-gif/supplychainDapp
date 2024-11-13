import { useCallback } from "react";
import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { getProvider } from "../constants/providers.js";
import { getSupplysContract } from "../constants/contracts.js";
import { toast } from "react-toastify";
import { ethers } from "ethers";

const usePurchase = () => {
    const { walletProvider } = useWeb3ModalProvider();

    return useCallback(async (id, quantity, price) => {
        const readWriteProvider = getProvider(walletProvider);
        const signer = await readWriteProvider.getSigner();

        // Convert price to Wei and calculate total price
        const priceInWei = ethers.parseEther(price.toString());
        const totalCost = priceInWei * BigInt(quantity); // Make sure to use BigInt for large numbers
        console.log(totalCost);

        const contract = getSupplysContract(signer);

        try {
            const transaction = await contract.purchaseProduct(id, quantity, {
                value: totalCost
            });
            // console.log("transaction: ", transaction);
            const receipt = await transaction.wait();

            // console.log("receipt: ", receipt);

            if (receipt.status) {
                return toast.success("Purchased successfully!");
            }

            toast.error("Purchase failed!");
        } catch (error) {
            console.log("error :", error);
            toast.error("Error | Insufficient fund for purchase.");
        }
    }, [walletProvider]);
}

export default usePurchase;
