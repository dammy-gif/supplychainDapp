/* eslint-disable no-constant-condition */
import { useEffect, useState } from "react";
import { readOnlyProvider } from "../constants/providers";
import { getSupplysContract } from "../constants/contracts";
import { ethers } from "ethers";
import useLatestBlock from "./useLatestBlock";

const useCollections = () => {
    const [data, setData] = useState({
        products: [],
        loading: true,
        error: null,
    });
    const newBlock = useLatestBlock()

    const contract = getSupplysContract(readOnlyProvider);

    useEffect(() => {
        const fetchProducts = async () => {
            const fetchedProducts = [];
            let _index = 1;

            try {
                while (true) {
                    const product = await contract.products(_index);

                    if (product.exists) {
                        // console.log("Product", product);

                        const structuredProduct = {
                            name: product[0],
                            imageIPFS: product[1],
                            price: ethers.formatEther(product[2].toString()),
                            quantity: Number(product[3]),
                            status: product[4],
                            exists: product[5],
                            description: product[6],
                            // buyers: product[7],
                        };

                        fetchedProducts.push(structuredProduct);
                    } else {
                        break;
                    }

                    _index += 1;
                }

                setData({ products: fetchedProducts, loading: false, error: null });
            } catch (error) {
                console.error("Error fetching products:", error);
                setData({ products: [], loading: false, error: "Failed to fetch products" });
            }
        };

        fetchProducts();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newBlock]);

    return data;
};

export default useCollections;
