const fetchMasternodeAPI = require('./masternodeAPIFetcher.js');

/**
 *  Prepare for SPV client by fetching the blockchain headers
 *
 *  Under-the-hood step :
 *      1) Fetch a list of API from different masternodes
 *      2) Verify that theses API deliver the same consensus (data consistency) and verify that the masternodes are legit (TX)
 *      3) Retrieve the blockchain-headers from multiple mode :
 *          a) FULL : Fetch all the blockchain
 *          b) SUPERFETCH : Fetch the last 2 superblocks + remaining recent blocks
 *          c) MAGICFETCH : Fetch a number of blocks that we can assume being safe.
 *
 *
 *  Improvement idea :
 *      1) Allow to do the same from public Nodes (RPC)
 */

const knownNodes = [
    "http://192.168.0.19:3001/insight-api-dash",
    "http://192.168.0.19:3001/insight-api-dash",//TODO: In this state, this idx1 will be given simulated bad data (consensus). See masternodeAPIFetcher.js:130
    "http://192.168.0.19:3001/insight-api-dash",
    // "http://192.168.0.20:3001/insight-api-dash",
    // "http://192.168.0.21:3001/insight-api-dash",
];

fetchMasternodeAPI(knownNodes)
    .then(function (_validMNList) {
        console.log(_validMNList);
    });

process.on('unhandledRejection', r => console.log(r));
