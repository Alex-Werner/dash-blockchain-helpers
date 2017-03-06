var {clone} = require('khal');
var validateConfig = require('./validateConfig.js');
var _fetch = require('./fetcher.js')._fetch;
var DGW = require('dark-gravity-wave-js');

var DashBlockchainHelpers = function (config) {
    var self = this;
    var validConfig = validateConfig(config);
    if (validConfig !== true) {
        return new Error('Missing configuration property :', validConfig);
    }
    
    this.config = clone(config);
    
    /* METHODS USING INSIGHT API */
    this.getHashFromHeight = function (height) {
        return new Promise(function (resolve, reject) {
            let url = `${self.config.insightAPI_URI}/block-index/${height}`;
            _fetch({type: "GET", url: url}, function (err, data) {
                if (data && data.hasOwnProperty('blockHash')) {
                    return resolve(data.blockHash);
                } else {
                    console.log('NULL');
                    console.log(err, data);
                }
            });
        });
    };
    this.getLastBlockHash = function () {
        return new Promise(function (resolve, reject) {
            let url = `${self.config.insightAPI_URI}/status?q=getLastBlockHash`;
            _fetch({type: "GET", url: url}, function (err, data) {
                return resolve(data.lastblockhash);
            });
        });
    };
    this.getStatus = function () {
        return new Promise(function (resolve, reject) {
            let url = `${self.config.insightAPI_URI}/status`;
            _fetch({type: "GET", url: url}, function (err, data) {
                return resolve(data);
            });
        });
    };
    /**
     * Retrieve a number of headers in the wanted direction
     * @params fromHeight - Number - The height from where to start syncing
     * @params numberOfBlockheaders - Number - The number of headers to retrieve
     * @params direction - Number - The direction to retrieve
     *                               Where 1(default): forward, -1: backward.
     **/
    this.retrieveBlockHeaders = function (fromHeight, numberOfBlockheaders, direction) {
        if (typeof(direction) === 'undefined') direction = 1;
        if (typeof(numberOfBlockheaders) === 'undefined') numberOfBlockheaders = 25;
        if (typeof(fromHeight) === 'undefined') fromHeight = 0;
        if (direction === -1) {
            fromHeight -= numberOfBlockheaders++;
        }
        return new Promise(function (resolve, reject) {
            let url = `${self.config.insightAPI_URI}/block-headers/${fromHeight}/${numberOfBlockheaders}`;
            _fetch({type: "GET", url: url}, function (err, data) {
                if (data == null || err) {
                    return resolve([])
                }
                return resolve(data);
            });
        });
    };
    this.getHeightFromHash = function (hash) {
        return new Promise(function (resolve, reject) {
            let url = `${self.config.insightAPI_URI}/block/${hash}`;
            _fetch({type: "GET", url: url}, function (err, data) {
                return resolve(data.height);
            });
        });
    };
    
    /* METHOD USING SUB-METHODS or LOGIC FN */
    this.getLastBlockHeight = function () {
        return this.getStatus().then(function (_status) {
            return _status.info.blocks;
        });
    };
    
    this.expectNextDifficulty = function () {
        return new Promise(function (resolve, reject) {
            self.getLastBlockHeight()//Retrieve last height
                .then(self.getFirstHeightRequired)//Determine the first height needed of 25 (from last)
                .then(function (height) {
                    return height - 24;
                })
                .then(self.retrieveBlockHeaders)
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
    };
    this.getPreviousSuperblockList = function (height, nbOfSuperblock) {
        return new Promise(function (resolve, reject) {
            const superblockCycle = 16616;
            if (!height) {
                return self
                    .getLastBlockHeight()
                    .then(function (height) {
                        return self
                            .getPreviousSuperblockList(height, Math.round(height / superblockCycle) + 1)
                            .then(function (list) {
                                return resolve(list);
                            })
                    });
            }
            if (!nbOfSuperblock)
                nbOfSuperblock = 1;
            
            var superblockHeightList = [];
            while (nbOfSuperblock--) {
                var superblock = height - (height % superblockCycle);
                superblockHeightList.push(superblock);
                if (superblock - 1 < 0)
                    break;
                height = (superblock - 1);
            }
            return resolve(superblockHeightList);
        });
    };
    this.getNextSuperblockList = function (height, nbOfSuperblock) {
        return new Promise(function (resolve, reject) {
            const superblockCycle = 16616;
            if (!height) {
                return self
                    .getLastBlockHeight()
                    .then(function (height) {
                        return self
                            .getNextSuperblockList(height, 1)
                            .then(function (list) {
                                return resolve(list);
                            })
                    });
            }
            if (!nbOfSuperblock)
                nbOfSuperblock = 1;
            
            var superblockHeightList = [];
            
            while (nbOfSuperblock--) {     
                var superblock = height - (height % superblockCycle) + superblockCycle;
                superblockHeightList.push(superblock);
                if (superblock - 1 < 0)
                    break;
                height = (superblock - 1);
            }
            return resolve(superblockHeightList);
        });
    };
    
    this.validateBlockchain = function (nbOfSuperblock, startingHeight) {
        return new Promise(function (resolve, reject) { 
            if(!nbOfSuperblock)
                nbOfSuperblock=1;
            if(!startingHeight){
                return self
                    .getLastBlockHeight()
                    .then(function (height) {
                        return self
                            .validateBlockchain(null, height)
                            .then(function (result) {
                                return resolve(result);
                            })
                    });
            }
               
            
            console.log(nbOfSuperblock, startingHeight);
            return resolve(false);
        });
    }
};
module.exports = DashBlockchainHelpers;
