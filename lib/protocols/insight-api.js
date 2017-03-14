var _fetch = require('../fetcher.js')._fetch;
const insightAPI = {
    getHashFromHeight: function (insightAPIRoot, height) {
        return new Promise(function (resolve, reject) {
            let url = `${insightAPIRoot}/block-index/${height}`;
            _fetch({type: "GET", url: url}, function (err, data) {
                if (data && data.hasOwnProperty('blockHash')) {
                    return resolve(data.blockHash);
                } else {
                    console.log('NULL');
                    console.log(err, data);
                }
            });
        });
    },
    getHeightFromHash:function(insightAPIRoot, hash){
        return new Promise(function (resolve, reject) {
            let url = `${insightAPIRoot}/block/${hash}`;
            _fetch({type: "GET", url: url}, function (err, data) {
                return resolve(data.height);
            });
        });  
    },
    getLastBlockHash: function (insightAPIRoot) {
        return new Promise(function (resolve, reject) {
            let url = `${insightAPIRoot}/status?q=getLastBlockHash`;
            _fetch({type: "GET", url: url}, function (err, data) {
                return resolve(data.lastblockhash);
            });
        });
    },
    getLastBlockHeight:function(insightAPIRoot){
        return this.getStatus(insightAPIRoot).then(function (_status) {
            return _status.info.blocks;
        });  
    },
    getStatus: function (insightAPIRoot) {
        return new Promise(function (resolve, reject) {
            let url = `${insightAPIRoot}/status`;
            _fetch({type: "GET", url: url}, function (err, data) {
                return resolve(data);
            });
        })
    },
    getBlockFromHash: function (insightAPIRoot, hash) {
        return new Promise(function (resolve, reject) {
            let url = `${insightAPIRoot}/block/${hash}`;
            _fetch({type: "GET", url: url}, function (err, data) {
                if (data && data.hasOwnProperty('hash')) {
                    return resolve(data);
                } else {
                    console.log('NULL');
                    console.log(err, data);
                }
            });
        });
    },
    retrieveBlockHeaders:function(insightAPIRoot,fromHeight, numberOfBlockheaders, direction){
        if (typeof(direction) === 'undefined') direction = 1;
        if (typeof(numberOfBlockheaders) === 'undefined') numberOfBlockheaders = 25;
        if (typeof(fromHeight) === 'undefined') fromHeight = 0;
        if (direction === -1) {
            fromHeight -= numberOfBlockheaders++;
        }
        return new Promise(function (resolve, reject) {
            let url = `${insightAPIRoot}/block-headers/${fromHeight}/${numberOfBlockheaders}`;
            _fetch({type: "GET", url: url}, function (err, data) {
                if (data == null || err) {
                    return resolve([])
                }
                return resolve(data);
            });
        });
    },
    expectNextDifficulty:function(insightAPIRoot){
        let self = this;
        var DGW = require('dark-gravity-wave-js');
        return new Promise(function (resolve, reject) {
            self.getLastBlockHeight(insightAPIRoot)//Retrieve last height
                .then(self.getFirstHeightRequired)//Determine the first height needed of 25 (from last)
                .then(function (height) {
                    return height - 24;
                })
                .then(function(height){
                    return self.retrieveBlockHeaders(insightAPIRoot,height)
                })
                .then(function (headers) {
                    headers = headers.headers;
                    headers = headers.map(function (_h) {
                        return {
                            height: _h.height,
                            target: `0x${_h.bits}`,
                            timestamp: _h.time
                        };
                    })
                    var nextbits = DGW.darkGravityWaveTargetWithBlocks(headers).toString(16);
                    return resolve(nextbits);
                })
                .catch(function (err) {
                    console.log(err);
                    return reject(err);
                })
        });
    }
};
module.exports = insightAPI;