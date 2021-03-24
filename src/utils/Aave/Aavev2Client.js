import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";


/*
    this url below will swap based on network
    - however - their kovan API is down atm so leaving it hard-coded in as mainnet...
*/
import { AAVE_V2_SUBGRAPH_URL } from "../../config/index"

export const aavev2client = new ApolloClient({
    // By default, this client will send queries to the
    //  `/graphql` endpoint on the same host
    // Pass the configuration option { uri: YOUR_GRAPHQL_API_URL } to the `HttpLink` to connect
    // to a different host
    link: new HttpLink({
        // pending uniswap with 'fixed' trade volumne
        uri: "https://api.thegraph.com/subgraphs/name/aave/protocol-v2",
    }),
    cache: new InMemoryCache(),
});