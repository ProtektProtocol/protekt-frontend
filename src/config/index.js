import { JsonRpcProvider } from '@ethersproject/providers'

export const env = process.env.APP_ENV || 'test'; // defaulting to after ||
export const network = env === "production" ?
  `mainnet` :
  `kovan`;
export const INFURA_ID = '395c09a1d60042e2bcb49522b34fcb4e';
export const INFURA_LINK = env === "production" ?
  `https://mainnet.infura.io/v3/${INFURA_ID}` :
  `https://kovan.infura.io/v3/${INFURA_ID}`
export const infuraProvider = new JsonRpcProvider(INFURA_LINK);