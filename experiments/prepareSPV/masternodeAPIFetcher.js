var DBH = require('./../../index.js');
const fetcher = require('./../../lib/fetcher');
const objectHash = require('object-hash');
const requesterJSON = require('./../../util/requesterJSON');


//From a URI, will ping the status path, in order to validate it's a valid one
const isValidAPI = function (uri) {
    return new Promise(function (resolve, reject) {
        uri = uri+'/status';
        requesterJSON
            .get(uri)
            .then(function (resp) {
                if ((resp && resp.hasOwnProperty('info'))) {
                    return resolve(true);
                }else{
                    return resolve(false);
                }
            })
            .catch(function (err) {
                return resolve(false);
            });
    })
};

//TODO : This will allow to get a list of selected (randomly) masternodes
const fetchMasternodesAPIList = function(){
    return new Promise(function(resolve, reject){
        return resolve([]);
    })
};
/*
 * getAvailableAPIList - Fetch a list of available API from verified MN. Verification goes from checking API network's availabilty to proof-of-masternode
 *
 * @params knownNodes - allow to pass a known list of INSIGHT-API from which we want to fetch some data (or add in our list)
 *                        If so, they will have to be validate, and will pass threw the same consensus verification.
 *
 * @return {Promise} - availableAPIURIList
 *
 *
 * */
const getAvailableAPIURIList = function (_knownNodes) {
    return new Promise(async function (resolve, reject) {
        //Store the passed list of nodes that we assume exist
        const knownNodes = (!_knownNodes) ? [] : _knownNodes;
        const fetchedList = await fetchMasternodesAPIList();
        let unvalidatedList = [].concat(knownNodes);
        unvalidatedList = unvalidatedList.concat(fetchedList);

        let availableAPIURIList = [];
        let promisesValidateAPIAccess = [];

        /* Validate API */
        for (let i = 0; i < unvalidatedList.length; i++) {
            let baseURI = unvalidatedList[i];
            promisesValidateAPIAccess.push(isValidAPI(baseURI));
        };

        /* Proof-Of-Masternode */
        //TODO : Concept for now, it intend to validate that the masternode is a read masternode with it's TX valid
        //POC TO BE DONE

        //Wait for all promises
        return Promise
            .all(promisesValidateAPIAccess)
            .then(function(promisesResults){
                promisesResults.filter(function(_pr,i){
                    if(_pr)
                        availableAPIURIList.push(unvalidatedList[i]);
                })
                return resolve(availableAPIURIList);
            })
    });
};

/**
 * Given a list of INSIGHT-API, we want to validate that the data from each of the insight-api form a consensus
 *  We will achieve that by :
 *      - Ask for the last block (which will contains the last diff)
 *      - Ask for the previous 25 block
 *      - Validate that the prev 25 block has a DGW which equivalent the 26th.
 *      - Verify that each of the API return the same value (if not, isolate the liar and remove from the list)
 * @return {Promise} - validatedAPIList
 */
const validateAPIList = function (availableAPIList) {
    return new Promise(async function (resolve, reject) {
        let validatedAPIList = [];
        let DBHs = [];
        let dataFromAPIs = [];

        for (let i = 0; i < availableAPIList.length; i++) {
            let insightAPIUrl = availableAPIList[i];
            DBHs.push(new DBH({insightAPI: {uri: insightAPIUrl}}));
        }

        for (let i = 0; i < DBHs.length; i++) {
            let _dbh = DBHs[i];
            let lastHeight = await _dbh.getLastBlockHeight();
            let retrieveBlocksHeaders = (await DBHs[i].retrieveBlockHeaders(lastHeight, 25, -1)).headers;
            let lastBlock = retrieveBlocksHeaders.splice(25, 1)[0]; //remove last item (last block) from list)
            let previous25Blocks = retrieveBlocksHeaders;

            if (_dbh.validateContinuousBlocks(previous25Blocks, lastBlock.bits)) {
                //Value of the 26 last block are valid given the requested API
                dataFromAPIs.push({
                    config: _dbh.config,
                    lastBlock: lastBlock,
                    previous25Blocks: previous25Blocks
                })
            };
        }

        //Validate consensus over the last block
        //if all API validate that last block
        //then we know that the last+25 previous block are the same for all API.
        //As we already validate the last block from the 25 previous one's
        let listOfObjectHash = {};
        for (let i = 0; i < dataFromAPIs.length; i++) {
            let sha1 = objectHash.sha1(dataFromAPIs[i]);
            if (i == 1) {
                //Simulate fake one TODO : REMOVE BEFORE USING IT !!!!!!
                String.prototype.replaceAt = function (index, replacement) {
                    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
                }
                sha1 = sha1.replaceAt(0, '5');
            }
            if (!listOfObjectHash.hasOwnProperty(sha1)) {
                listOfObjectHash[sha1] = [i];
            } else {
                listOfObjectHash[sha1].push(i);
            }
        }

        //seek for consensus
        if (Object.keys(listOfObjectHash).length == 0) {
            //Consensus found
            validatedAPIList = availableAPIList;
        } else {
            //Consensus not found, which is the biggest ?
            let biggest = 0, consensus = null;
            for (let i = 0; i < Object.keys(listOfObjectHash).length; i++) {
                let l = listOfObjectHash[Object.keys(listOfObjectHash)[i]].length;
                if (l > biggest) {
                    biggest = l;
                    consensus = Object.keys(listOfObjectHash)[i];
                }
            }
            listOfObjectHash[consensus].filter(function (_APIIdx) {
                validatedAPIList.push(availableAPIList[_APIIdx]);
            })
        }
        return resolve(validatedAPIList);
    });
};
module.exports = function (knownNodes) {
    return new Promise(function (resolve, reject) {
        return getAvailableAPIURIList(knownNodes)
            .then(validateAPIList)
            .then(function (validMNList) {
                return resolve(validMNList);
            })
    });
}

