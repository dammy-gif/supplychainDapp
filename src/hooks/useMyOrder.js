/* eslint-disable no-constant-condition */
import { useEffect, useState } from "react";
import { readOnlyProvider } from "../constants/providers";
import { getSupplysContract, getMulticallContract } from "../constants/contracts";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { ethers } from "ethers";
import Abi from "../constants/supplyChainABI.json";
import useLatestBlock from "./useLatestBlock";

// Define the Status enum
const Status = {
    0: "N/A",
    1: "Created",
    2: "Ordered",
    3: "Shipped",
    4: "Delivered",
};

const useMyOrder = () => {
    const [data, setData] = useState({
        product: [],
        loadings: true,
        errors: null,
    });

    const { address } = useWeb3ModalAccount();
    const newBlock = useLatestBlock()

    const contract = getSupplysContract(readOnlyProvider);
    const multicallContract = getMulticallContract(readOnlyProvider);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const itf = new ethers.Interface(Abi);

                const latestId = await contract.latestProductId();
                let calls = [];

                for (let i = 1; i < Number(latestId); i++) {
                    calls.push({
                        target: import.meta.env.VITE_contract_address,
                        callData: itf.encodeFunctionData("getPurchasedDetails", [address, i]),
                    });
                }

                const callResults = await multicallContract.tryAggregate.staticCall(
                    false,
                    calls
                );

                // console.log("callResults22", callResults);

                const getAllUserInfo = [];
                for (let i = 0; i < (Number(latestId) - 1); i++) {
                    getAllUserInfo.push(
                        itf.decodeFunctionResult("getPurchasedDetails", callResults[address, i][1])
                    );
                }

                let allUserInfoArray = [];
                for (let i = 0; i < getAllUserInfo.length; i++) {
                    allUserInfoArray.push({
                        quantity: Number(getAllUserInfo[i][0]),
                        status: Status[Number(getAllUserInfo[i][1])],
                    });
                }

                setData({ product: allUserInfoArray, loadings: false, errors: null });
            } catch (error) {
                console.error("Error fetching products:", error);
                setData({ product: [], loadings: false, errors: "Connect wallet to see your orders" });
            }
        };

        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address, newBlock]);

    return data;
};

export default useMyOrder;
