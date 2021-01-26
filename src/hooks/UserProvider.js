import { useMemo } from "react";
// import { Web3Provider } from "@ethersproject/providers";
// import { INFURA_ID } from "../utils/constants"

const useUserProvider = (injectedProvider, localProvider) =>
useMemo(() => {
  if (injectedProvider) {
    console.log("🦊 Using injected provider");
    return injectedProvider;
  }
  if (!localProvider) return undefined;

}, [injectedProvider, localProvider]);

export default useUserProvider;
