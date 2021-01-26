import { ethers } from "ethers";

export default function useTokenBalances(address, item, tokenPrices, contracts, tokens=[], allowances=[]) {
  // let temp = {loading: true};
  // tokens.forEach(t => {
  //   temp[t] = {
  //     token: 0,
  //     usd: 0,
  //     allowance: 0
  //   }
  // });
  // const [balances, setBalances] = useState(temp);

  // useEffect( () => {
  //   console.log("Checking")
  //   console.log(address, item, tokenPrices, contracts)
  //   const getBalances = async () => {
  //     let _balances = balances;
  //     if(address && contracts && tokenPrices) {
  //       try {
  //         for (let i = 0; i < tokens.length; i++) {
  //           let tokenBalance = await contracts[tokens[i]]["balanceOf"](...[address]);
  //           let tokenAllowance = await contracts[tokens[i]]["allowance"](...[address, allowances[i]]);

  //           _balances[tokens[i]] = {
  //             token: tokenBalance.toString(),
  //             usd: 0,
  //             allowance: tokenAllowance
  //           };
  //         };
  //       } catch (error) {
  //         console.error(error);
  //       }
  //       _balances.loading = false;
  //       // console.log(address, item, tokenPrices, contracts)
  //       setBalances(_balances);
  //     }
  //   };
  //   getBalances();
  // });
  // JSON.stringify(balances)
  // return balances
}

export async function getTokenBalances(address, tokenPrices, contracts, tokens=[], decimals=[], allowances=[]) {
  let _balances = { loading: true };

  if(address && contracts && tokenPrices) {
    try {
      for (let i = 0; i < tokens.length; i++) {
        let tokenBalance = await contracts[tokens[i]]["balanceOf"](...[address]);
        let tokenAllowance = await contracts[tokens[i]]["allowance"](...[address, allowances[i]]);
        let tokenBalanceUsd = 0;

        if(tokenPrices[tokens[i]] && tokenPrices[tokens[i]]["usd"]) {
          tokenBalanceUsd = ethers.utils.formatUnits(tokenBalance.toString(),decimals[i]) * tokenPrices[tokens[i]]["usd"];
        }

        _balances[tokens[i]] = {
          token: tokenBalance.toString(),
          usd: tokenBalanceUsd,
          allowance: tokenAllowance
        };
      };
    } catch (error) {
      console.error(error);
    }
    _balances.loading = false;
  }
  return _balances
}