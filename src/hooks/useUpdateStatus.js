import { useCallback } from "react";
import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { getProvider } from "../constants/providers";
import { toast } from "react-toastify"
import { getSupplysContract } from "../constants/contracts";

const useUpdateStatus = () => {
    const { walletProvider } = useWeb3ModalProvider();

    return useCallback(async (id, account, status) => {
        const readWriteProvider = getProvider(walletProvider);
        const signer = await readWriteProvider.getSigner();

        const contract = getSupplysContract(signer);

        try {
            const transaction = await contract.updatePurchaseStatus(id, account, status);
            // console.log("transaction: ", transaction);
            const receipt = await transaction.wait();

            // console.log("receipt: ", receipt);

            if (receipt.status) {
                return toast.success("Updated successfully!");
            }

            toast.error("failed!");
        } catch (error) {
            console.log("error :", error);
        }
    }, [walletProvider]);
}

export default useUpdateStatus