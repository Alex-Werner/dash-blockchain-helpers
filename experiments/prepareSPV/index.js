const fetchMasternodeAPI = require('./masternodeAPIFetcher.js');
const BCHFetch = require('./blockchainHeadersFetch/index.js');
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
    // "http://192.168.0.19:3001/insight-api-dash",
    // "http://192.168.0.19:3001/insight-api-dash",
    // "http://192.168.0.19:3001/insight-api-dash",
    // "http://192.168.0.19:3001/insight-api-dash",
    // "http://192.168.0.20:3001/insight-api-dash",
    // "http://192.168.0.21:3001/insight-api-dash",
];

//Get a valid (pingable, consensus-verified data) API List we can now uses
const st = +new Date();
let APIListLen = 0;
fetchMasternodeAPI(knownNodes)
    .then(function (_validatedAPIList) {
        APIListLen=_validatedAPIList.length;
        return BCHFetch({mode: "full", apiList: _validatedAPIList});//Fetch full blockchain headers
        // BCHFetch({mode:"superfetch", apiList:_validatedAPIList});//Fetch last 2 superblock+remaining blockchain headers
        // BCHFetch({mode:"magicfetch", apiList:_validatedAPIList});//Fetch magicnumbers blockchain headers
        // BCHFetch({apiList:_validatedAPIList});//Fetch by default value (full)
    })
    .then(function (_blockchainHeaders) {
        console.log(`Fetched ${Object.keys(_blockchainHeaders).length} blocks in ${+new Date()-st}ms using ${APIListLen} endpoints`);
    });

process.on('unhandledRejection', r => console.log(r));
