import { JsonRpcProvider } from '@ethersproject/providers'

export const env = process.env.REACT_APP_APP_ENV || 'test'; // defaulting to after ||
export const network = env === "production" ?
  `homestead` :
  `kovan`;
export const INFURA_ID = '395c09a1d60042e2bcb49522b34fcb4e';
export const INFURA_LINK = env === "production" ?
  `https://mainnet.infura.io/v3/${INFURA_ID}` :
  `https://kovan.infura.io/v3/${INFURA_ID}`
export const infuraProvider = new JsonRpcProvider(INFURA_LINK);

export const AAVE_PROTOCOL_DATA_PROVIDER_ADDRESS = env === "production" ?
"0x057835Ad21a177dbdd3090bB1CAE03EaCF78Fc6d" : "0x3c73A5E5785cAC854D468F727c606C07488a29D6"

export const AAVE_V2_SUBGRAPH_URL = env === "production" ? "https://api.thegraph.com/subgraphs/name/aave/protocol-v2"
: "https://api.thegraph.com/subgraphs/name/aave/protocol-v2-kovan"
