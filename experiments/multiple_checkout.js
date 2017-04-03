var DBH = require('./../index.js');
const fetcher = require('./../lib/fetcher');
const objectHash = require('object-hash');
const requesterJSON = require('./../util/requesterJSON');
/* TODO : This will allow to get a list of selected (randomly) masternodes
 * This list could be fetch by many options like having a old referenced MN in a file for exemple
 *
 * The given list will :
 *   - Check for API being available
 *   - Proof-of-masternode
 * */
const getMNList = function () {
    return new Promise(async function (resolve, reject) {
        const MNList = [];
        //Node we know exist from last fetch for-exemple
        const knownNodes = [
            "http://192.168.0.19:3001/insight-api-dash",
            "http://192.168.0.19:3001/insight-api-dash",
            "http://192.168.0.19:3001/insight-api-dash",
            "http://192.168.0.19:3001/insight-api-dash",
        ];

        /* Validate API */

        //We will ping the API in order to validate it's a valid one
        const isValidAPI = async function (uri) {
            let resp = await requesterJSON.get(uri);
            return (resp && resp.hasOwnProperty('info'));
        };

        for (let i = 0; i < knownNodes.length; i++) {
            let baseURI = knownNodes[i];
            if (await isValidAPI(baseURI + '/status'))
                MNList.push(baseURI);
        }
        ;
        /* Proof-Of-Masternode */
        //TODO : Concept for now, will have to POC this later
        return resolve(MNList);
    });
};

/**
 * Given a list of INSIGHT-API, we want to validate that the data from each of the insight-api form a consensus
 *  We will achieve that by :
 *      - Ask for the last block (which will contains the last diff)
 *      - Ask for the previous 25 block
 *      - Validate that the prev 25 block has a DGW which equivalent the 26th.
 *      - Verify that each of the API return the same value (if not, isolate the liar and remove from the list)
 * @return listOfApi
 */
const validateAPIList = function (APIlist) {
    return new Promise(async function (resolve, reject) {
        let validMNList = [];
        let DBHs = [];
        let dataFromAPIs = [];

        for(let i = 0; i<APIlist.length; i++){
            let insightAPIUrl = APIlist[i];
            DBHs.push(new DBH({insightAPI:{uri:insightAPIUrl}}));
        }

        for (let i=0;i<DBHs.length; i++ ){
            let _dbh = DBHs[i];
            let lastHeight = await _dbh.getLastBlockHeight();

            let retrieveBlocksHeaders = (await DBHs[i].retrieveBlockHeaders(lastHeight, 25,-1)).headers;
            let lastBlock = retrieveBlocksHeaders.splice(25,1)[0]; //remove last item (last block) from list)
            let previous25Blocks = retrieveBlocksHeaders


            if(_dbh.validateContinuousBlocks(previous25Blocks,lastBlock.bits)){
                //Value of the 26 last block are valid given the requested API
                dataFromAPIs.push({
                    config:_dbh.config,
                    lastBlock:lastBlock,
                    previous25Blocks:previous25Blocks
                })
            };
        }

        //Validate consensus over the last block
        //if all API validate that last block
        //then we know that the last+25 previous block are the same for all API.
        //As we already validate the last block from the 25 previous one's
        let listOfObjectHash = {};
        for(let i = 0; i<dataFromAPIs.length;i++){
            let sha1 = objectHash.sha1(dataFromAPIs[i]);
            if(i==1){
                //Simulate fake one TODO : REMOVE BEFORE USING IT !!!!!!
                String.prototype.replaceAt=function(index, replacement) {
                    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
                }
                sha1 = sha1.replaceAt(0,'5');
            }
            if(!listOfObjectHash.hasOwnProperty(sha1)){
                listOfObjectHash[sha1]=[i];
            }else{
                listOfObjectHash[sha1].push(i);
            }
        }


        //seek for consensus
        if(Object.keys(listOfObjectHash).length==0){
            //Consensus found
            validMNList = APIlist;
        }else{
            //Consensus not found, which is the biggest ?
            let biggest = 0, consensus = null;
            for(let i = 0; i<Object.keys(listOfObjectHash).length; i++){
                let l = listOfObjectHash[Object.keys(listOfObjectHash)[i]].length;
                if(l>biggest){
                    biggest=l;
                    consensus=Object.keys(listOfObjectHash)[i];
                }
            }
            listOfObjectHash[consensus].filter(function(_APIIdx){
                validMNList.push(APIlist[_APIIdx]);
            })
        }

        return resolve(validMNList);
    });
};
getMNList()
    .then(validateAPIList)
    .then(function(validMNList){
        console.log(validMNList);
    })

