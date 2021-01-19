import { useState } from "react";
import axios from "axios";
import { usePoller } from "eth-hooks";

export default function useTokenPrice(mainnetProvider, tokenSymbols, pollTime) {
  const [price, setPrice] = useState(0);

  const pollPrice = () => {
    async function getPrice() {
      try {
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${tokenSymbols}&vs_currencies=usd,eth`
        const response = await axios.get(url);
        const priceInUsd = response.data ? response.data : []
        setPrice(priceInUsd);
      } catch (error) {
        console.error(error);
      }
    }
    getPrice();
  };
  usePoller(pollPrice, pollTime || 9777);

  return price;
}
