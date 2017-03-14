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
};
module.exports = insightAPI;