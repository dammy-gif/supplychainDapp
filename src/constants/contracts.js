import { ethers } from "ethers";
import Abi from "./supplyChainABI.json";
import multicallAbi from "./multicall.json";


export const getSupplysContract = (providerOrSigner) =>
    new ethers.Contract(
        import.meta.env.VITE_contract_address,
        Abi,
        providerOrSigner
    );



export const getMulticallContract = (providerOrSigner) =>
    new ethers.Contract(
        import.meta.env.VITE_multicall_address,
        multicallAbi,
        providerOrSigner
    );