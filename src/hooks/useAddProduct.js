import { useCallback } from "react";
import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { getProvider } from "../constants/providers";
import { toast } from "react-toastify"
import { getSupplysContract } from "../constants/contracts";
import { ethers } from "ethers";

const useAddProduct = () => {
    const { walletProvider } = useWeb3ModalProvider();
    // const { address } = useWeb3ModalAccount();

    return useCallback(async (name, imageIPFS, quantity, price, description) => {
        const readWriteProvider = getProvider(walletProvider);
        const signer = await readWriteProvider.getSigner();
        const amount = ethers.toBigInt(price);
        console.log(amount);

        const contract = getSupplysContract(signer);

        try {
            const transaction = await contract.addProduct(name, imageIPFS, quantity, amount, description);
            // console.log("transaction: ", transaction);
            const receipt = await transaction.wait();

            // console.log("receipt: ", receipt);

            if (receipt.status) {
                return toast.success("Added successfully!");
            }

            toast.error("Minting failed!");
        } catch (error) {
            console.log("error :", error);
        }
    }, [walletProvider]);
}

export default useAddProduct