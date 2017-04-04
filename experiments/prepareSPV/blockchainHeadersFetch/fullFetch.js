const DBH = require('./../../../index.js');
const cl = console.log;

let apiList = [];
const nbrOfBlockPerCall = 100; //We will fetch 100 block per calls
const startingHeight = 614500; //TODO : Change this for 0
// const startingHeight = 0; //TODO : Change this for 0
let DBHs = [];
let blockchainHeaders = {};
let pendingVerification = false;
let nbrOfVerificationDone = 0;

function isPending(obj) {
    if(obj && obj.hasOwnProperty('pending')){
        if(obj.pending==true){
            return true;
        }
    }
    return false;
}
function isEmpty(obj) {
    if (obj == null) return true;
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;
    if (typeof obj !== "object") return true;
    for (var key in obj) {
        if (obj.hasOwnProperty.call(obj, key)) return false;
    }
    return true;
}
const processFetching = function () {
    return new Promise(function (resolve, reject) {

        const fetchMultiplesBlocks = function (_dbhObj, _startingHeight) {
            return new Promise(function (resolve, reject) {
                let promise = _dbhObj.retrieveBlockHeaders(_startingHeight, nbrOfBlockPerCall);
                promise.then(function (r) {
                    if (r && r.hasOwnProperty('headers')) {
                        let headers = r.headers;
                        headers.filter(function (_h) {
                            blockchainHeaders[_h.height] = _h;
                        })
                        return resolve(true);
                    }
                }).catch(function (err) {
                    console.log('ezr', err);
                    return resolve(false);
                });
            });
        };

        const getUnfetchedBlockHeight = function () {
            for (let i = 0; i <= Object.keys(blockchainHeaders).length; i++) {
                if ((isEmpty(blockchainHeaders[Object.keys(blockchainHeaders)[i]])))
                    return (Object.keys(blockchainHeaders)[i]);
            }
        };
        const prepareFetchingMultipleBlock = function (_h) {
            _h = parseInt(_h);

            let lastBCHIdx = Object.keys(blockchainHeaders).length-1;
            let lastBCHHeight = Object.keys(blockchainHeaders)[lastBCHIdx];
            let limit = (_h + nbrOfBlockPerCall<=lastBCHHeight)? _h+nbrOfBlockPerCall : nbrOfBlockPerCall+(lastBCHHeight-(_h + nbrOfBlockPerCall));
            if(limit){
                for (let i = _h; i < limit; i++) {
                    blockchainHeaders[i]['pending'] = true;
                }
                return true;
            }
            return false;
        };
        const verifyAllFetched = function(){
            let valid = true;
            if(!pendingVerification){
                pendingVerification=true;
                nbrOfVerificationDone++;
                console.log('Verifying...');

                // blockchainHeaders.filter(function(_bh){
                //     console.log(_bh);
                // })
                let keys = Object.keys(blockchainHeaders);
                for(let i = 0; i<keys.length;i++){
                    if(isEmpty(blockchainHeaders[keys[i]])){
                        console.log('IS EMPTY', blockchainHeaders[keys[i]]);
                        valid=false;
                    }
                    if(isPending(blockchainHeaders[keys[i]])){
                        console.log('IS pending', blockchainHeaders[keys[i]]);
                        valid=false;
                    }
                }
                return valid;
            }
            return null;
        };
        const finishedFetching = function () {
            return resolve(true);
        };
        const remainingFetching = function (_aL) {
            let _height = getUnfetchedBlockHeight();
            if(!_height){
                if(verifyAllFetched()===true){
                    return finishedFetching()
                }
                return;
            }
            console.log(`API ${_aL._nbId} - Processing Height ${_height}`);
            if(prepareFetchingMultipleBlock(_height)){
                fetchMultiplesBlocks(_aL, _height)
                    .then(function (resultFetching) {
                        // cl(resultFetching);
                        remainingFetching(_aL);
                    });
            }else{
                if(verifyAllFetched()===true){
                    return finishedFetching()
                }
            }

        };
        const initFetching = function () {
            DBHs.filter(async function (_aL,i) {
                _aL._nbId = i;
                let _height = getUnfetchedBlockHeight();
                if(prepareFetchingMultipleBlock(_height)){//"reserve" the fetching
                    fetchMultiplesBlocks(_aL, _height)
                        .then(function (resultFetching) {
                            remainingFetching(_aL);
                        });
                }

            });
        }
        initFetching();

    });

}
module.exports = function (_apiList) {
    return new Promise(async function (resolve, reject) {
        // console.log(_apiList);
        if (!_apiList || !(_apiList.length > 0))
            throw new Error('Cannot proceed : No apiList');
        apiList = _apiList;


        for (let i = 0; i < _apiList.length; i++) {
            let insightAPIUrl = _apiList[i];
            DBHs.push(new DBH({insightAPI: {uri: insightAPIUrl}}));
        }

        //GET TIP HEIGHT
        let lastHeight = await DBHs[0].getLastBlockHeight();
        // console.log(lastHeight);

        //init the blockchain headers to void
        blockchainHeaders = function initBlockchainHeaders() {
            for (let i = startingHeight; i <= lastHeight; i++) {
                blockchainHeaders[i] = {};
            }
            return blockchainHeaders;
        }();

        await processFetching();

        // cl("NB oF HEADERS", Object.keys(blockchainHeaders).length);
        resolve(blockchainHeaders);
    });
}