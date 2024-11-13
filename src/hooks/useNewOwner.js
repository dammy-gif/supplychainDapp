import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { wssProvider } from "../constants/providers";


const useNewOwner = () => {
    const [addr, setAddress] = useState("");
    const [tokenId, setTokenId] = useState(0);




    const eventListerner = useCallback((log) => {
        const addressFrom = String(log.topics[1])
        const id = String(log.topics[3])

        const decodedResponses = ethers.AbiCoder.defaultAbiCoder().decode(["address"], addressFrom)

        const decodedId = ethers.AbiCoder.defaultAbiCoder().decode(["uint256"], id)

        console.log("decodedResponses: ", decodedResponses);
        console.log("TransferedId: ", id);


        setAddress(decodedResponses)
        setTokenId(decodedId)
    }, []);


    useEffect(() => {
        const filter = {
            address: import.meta.env.VITE_contract_address,
            topics: [ethers.id("Transfer(address,address,uint256)")],
        };
        wssProvider
            .getLogs({ ...filter, fromBlock: 5465128 })
            // eslint-disable-next-line no-unused-vars
            .then((events) => {
            });

        const wssProvider2 = new ethers.WebSocketProvider(
            import.meta.env.VITE_wss_rpc_url
        );
        wssProvider2.on(filter, eventListerner);

        return () => wssProvider2.off(filter, eventListerner);
    }, [eventListerner]);


    return { addr, tokenId };
};

export default useNewOwner;