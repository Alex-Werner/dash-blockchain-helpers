var clone = require('../util/clone');
var validateConfig = require('./validateConfig.js');
var _fetch = require('./fetcher.js')._fetch;
var DGW = require('dark-gravity-wave-js');
var insight = require('./protocols/insight-api');
var rpc = require('./protocols/dash-rpc');

var parseConfig = require('./parseConfig.js');
var DashBlockchainHelpers = function (config) {
    var self = this;
    this.config = parseConfig(config);
    
    this.getHashFromHeight = function (height) {
        return (self.config.type==='RPC') ? rpc.getHashFromHeight(self.config, height): insight.getHashFromHeight(self.config.uri, height);
    };
    this.getLastBlockHash = this.getTip = this.getBest= function () {
        return (self.config.type==='RPC') ? rpc.getLastBlockHash(self.config): insight.getLastBlockHash(self.config.uri);
    };
    this.getLastBlockHeight = function(){
        return (self.config.type==='RPC') ? rpc.getLastBlockHeight(self.config): insight.getLastBlockHeight(self.config.uri);
    },
    this.getStatus = this.getInfo = function () {
        return (self.config.type==='RPC') ? rpc.getStatus(self.config): insight.getStatus(self.config.uri);
    };
    this.getBlockFromHash = function(hash){
        return (self.config.type==='RPC') ? rpc.getBlockFromHash(self.config,hash): insight.getBlockFromHash(self.config.uri,hash);
    };
    this.getHeightFromHash = function (hash) {
        return (self.config.type==='RPC') ? rpc.getHeightFromHash(self.config,hash): insight.getHeightFromHash(self.config.uri,hash);
    
    };
    /**
     * Retrieve a number of headers in the wanted direction
     * @params fromHeight - Number - The height from where to start syncing
     * @params numberOfBlockheaders - Number - The number of headers to retrieve
     * @params direction - Number - The direction to retrieve
     *                               Where 1(default): forward, -1: backward.
     **/
    this.retrieveBlockHeaders = function (fromHeight, numberOfBlockheaders, direction) {
        return (self.config.type==='RPC') ? 
            rpc.retrieveBlockHeaders(self.config,fromHeight, numberOfBlockheaders, direction): 
            insight.retrieveBlockHeaders(self.config.uri,fromHeight, numberOfBlockheaders, direction);
    };
    this.expectNextDifficulty = function () {
        return (self.config.type==='RPC') ?
            rpc.expectNextDifficulty(self.config):
            insight.expectNextDifficulty(self.config.uri);
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
