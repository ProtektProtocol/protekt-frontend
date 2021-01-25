/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import { Contract } from "@ethersproject/contracts";
import { useState, useEffect } from "react";

export default function useAccountBalances(providerOrSigner) {
  const [accountBalances, setAccountBalances] = useState();
  useEffect(() => {
    async function getAccountBalances() {
      
    }
    getAccountBalances();
  }, [providerOrSigner]);
  return accountBalances;
}

async function getAccountBalances(item, tokenPrices, contracts) {
  let balances = accountBalances;
  if(web3Context.ready && web3Context.address && contracts) {
    try {
      const underlyingTokenBalance = await contracts[item.underlyingTokenSymbol]["balanceOf"](...[web3Context.address]);
      const underlyingAllowanceAmount = await contracts[item.underlyingTokenSymbol]["allowance"](...[web3Context.address, item.pTokenAddress]);
      const pTokenBalance = await contracts["pToken"]["balanceOf"](...[web3Context.address]);

      const reserveTokenBalance = await contracts[item.reserveTokenSymbol]["balanceOf"](...[web3Context.address]);
      const reserveAllowanceAmount = await contracts[item.reserveTokenSymbol]["allowance"](...[web3Context.address, item.shieldTokenAddress]);
      const shieldTokenBalance = await contracts["shieldToken"]["balanceOf"](...[web3Context.address]);

      // console.log('-------')
      // console.log('underlying',underlyingTokenBalance.toString())
      // console.log('ptoken',pTokenBalance.toString())

      balances[item.underlyingTokenSymbol] = {
        token: underlyingTokenBalance.toString(),
        usd: 0,
        allowance: underlyingAllowanceAmount
      };
      balances[item.pTokenSymbol] = {
        token: pTokenBalance.toString(),
        usd: 0
      };
      balances[item.reserveTokenSymbol] = {
        token: reserveTokenBalance.toString(),
        usd: 0,
        allowance: reserveAllowanceAmount
      };
      balances[item.shieldTokenSymbol] = {
        token: shieldTokenBalance.toString(),
        usd: 0
      };
    } catch (error) {
      console.error(error);
    }
  }
  return balances;  
}