import { useState, useEffect } from "react";
import _ from 'lodash';

export async function getCapped(contracts, item) {
  let _data = { loading: true };
  console.log('inside get capped');
  console.log(item)
  if(contracts) {
    try {
      
      let pTokenIsCapped = await contracts[item.pTokenSymbol]["isCapped"]();
      let pTokenCap = null
      console.log('isCapped:')
      console.log(pTokenIsCapped)
      if(pTokenIsCapped){
          pTokenCap =  await contracts[item.pTokenSymbol]["maxDeposit"]();
          pTokenCap = Number(pTokenCap.toLocaleString()) / (1*10**item.pTokenDecimals)
          console.log('max deposit is:')
          console.log(pTokenCap)
      }

      let shieldTokenIsCapped = await contracts[item.shieldTokenSymbol]["isCapped"]();
      let shieldTokenCap = null
      console.log('isCapped:')
      console.log(shieldTokenIsCapped)
      if(shieldTokenIsCapped){
          shieldTokenCap =  await contracts[item.shieldTokenSymbol]["maxDeposit"]();
          shieldTokenCap = Number(shieldTokenCap.toLocaleString()) / (1*10**item.shieldTokenDecimals)
          console.log(shieldTokenCap)
      }
    
      _data = {
        pTokenIsCapped: pTokenIsCapped,
        pTokenCap: pTokenCap,
        shieldTokenIsCapped: shieldTokenIsCapped,
        shieldTokenCap: shieldTokenCap,
      };
    } catch (error) {
      console.error(error);
    }
    _data.loading = false;
  }
  return _data
}

export function useCapped(
  item,
  contracts
) {
  const [output, setOutput] = useState({loading: true});
  useEffect(() => {
    async function run() {
      const tempData = await getCapped(
        contracts,
        item
      );
      setOutput(tempData);
    }

    if(!_.isEmpty(contracts)) {
      run();       
    }
  },[contracts]);

  return output;
}