import { useEffect, useState } from "react";
import { readOnlyProvider } from "../constants/providers";
import { getSupplysContract, getMulticallContract } from "../constants/contracts";
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

const useAllPurchase = () => {
    const [data, setData] = useState({
        purchased: [],
        loader: true,
        errorz: null,
    });

    const newBlock = useLatestBlock()

    const contract = getSupplysContract(readOnlyProvider);
    const multicallContract = getMulticallContract(readOnlyProvider);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const itf = new ethers.Interface(Abi);
                const latestId = await contract.latestProductId();
                let calls = [];

                // First, collect all buyers for each product
                for (let i = 1; i < Number(latestId); i++) {
                    calls.push({
                        target: import.meta.env.VITE_contract_address,
                        callData: itf.encodeFunctionData("getProductBuyers", [i]),
                    });
                }

                // Get all buyer addresses per product
                const callResults = await multicallContract.tryAggregate.staticCall(false, calls);
                const getAllUserInfo = callResults.map(result =>
                    itf.decodeFunctionResult("getProductBuyers", result[1])
                );

                let allUserInfoArray = getAllUserInfo.map(info => ({
                    buyersAddressesArray: info[0],
                }));

                // Now, prepare calls to get purchase details for each buyer address
                let calls2 = [];
                allUserInfoArray.forEach((userInfo, productIndex) => {
                    userInfo.buyersAddressesArray.forEach((buyerAddress) => {
                        calls2.push({
                            target: import.meta.env.VITE_contract_address,
                            callData: itf.encodeFunctionData("getPurchasedDetails", [buyerAddress, productIndex + 1]),
                        });
                    });
                });

                // Fetch purchase details for each buyer
                const purchaseDetailsResults = await multicallContract.tryAggregate.staticCall(false, calls2);
                const purchaseDetailsDecoded = purchaseDetailsResults.map(result =>
                    itf.decodeFunctionResult("getPurchasedDetails", result[1])
                );

                // Structure data by product with buyer purchase details and addresses
                let allPurchaseData = [];
                let detailIndex = 0;
                allUserInfoArray.forEach((userInfo, productIndex) => {
                    let buyersDetails = userInfo.buyersAddressesArray.map(buyerAddress => {
                        const purchaseDetails = purchaseDetailsDecoded[detailIndex++];
                        return {
                            buyerAddress, // Include the buyer address here
                            quantity: Number(purchaseDetails[0]),
                            status: Status[Number(purchaseDetails[1])],
                        };
                    });
                    allPurchaseData.push({
                        productId: productIndex + 1,
                        buyers: buyersDetails,
                    });
                });

                setData({ purchased: allPurchaseData, loader: false, errorz: null });
            } catch (error) {
                console.error("Error fetching products:", error);
                setData({ purchased: [], loader: false, errorz: "Failed to fetch products" });
            }
        };

        fetchProducts();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newBlock]);

    return data;
};

export default useAllPurchase;
