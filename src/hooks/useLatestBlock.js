import { ethers } from "ethers";
import { useEffect, useState } from "react";

const useLatestBlock = () => {

    const [blockNumber, setBlockNumber] = useState(undefined);

    useEffect(() => {
        const wssProvider = new ethers.WebSocketProvider(
            import.meta.env.VITE_wss_rpc_url
        );
        console.log("wssProvider: ", wssProvider);
        const onBlock = (newBlockNumber) => setBlockNumber(newBlockNumber);
        wssProvider.on("block", onBlock);
        return () => {
            wssProvider.off("block", onBlock);
        };
    }, []);

    return blockNumber;
}

export default useLatestBlock