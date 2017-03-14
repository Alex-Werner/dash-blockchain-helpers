var _fetch = require('../fetcher.js')._fetch;
const dashRPC = {
    getHashFromHeight: function (config, height) {
        return new Promise(function (resolve, reject) {
            let data = {
                id:+new Date(),
                method:'getblockhash',
                params:[height]
            }
            let auth = `${config.user}:${config.password}`;
            _fetch({type: "POST", host: config.host, port:config.port, auth:auth,data:data}, function (err, data) {
                if (data && data.hasOwnProperty('result')) {
                    return resolve(data.result);
                } else {
                    console.log('NULL');
                    console.log(err, data);
                }
            });
        });
    },
    getLastBlockHash:function(config){
        return new Promise(function (resolve, reject) {
            let data = {
                id:+new Date(),
                method:'getbestblockhash',
                params:[]
            }
            let auth = `${config.user}:${config.password}`;
            _fetch({type: "POST", host: config.host, port:config.port, auth:auth,data:data}, function (err, data) {
                if (data && data.hasOwnProperty('result')) {
                    return resolve(data.result);
                } else {
                    console.log('NULL');
                    console.log(err, data);
                }
            });
        });
    },
    getStatus:function(config){
        return new Promise(function (resolve, reject) {
            let data = {
                id:+new Date(),
                method:'getinfo',
                params:[]
            }
            let auth = `${config.user}:${config.password}`;
            _fetch({type: "POST", host: config.host, port:config.port, auth:auth,data:data}, function (err, data) {
                if (data && data.hasOwnProperty('result')) {
                    return resolve(data.result);
                } else {
                    console.log('NULL');
                    console.log(err, data);
                }
            });
        });
    },
    getLastBlockHeight:function(config){
        return this.getStatus(config).then(function (_status) {
            return _status.blocks;//Can also retrieve using getblockcount
        });
    },
    getBlockFromHash:function(config,hash){
        return new Promise(function (resolve, reject) {
            let data = {
                id:+new Date(),
                method:'getblock',
                params:[hash]
            }
            let auth = `${config.user}:${config.password}`;
            _fetch({type: "POST", host: config.host, port:config.port, auth:auth,data:data}, function (err, data) {
                if (data && data.hasOwnProperty('result')) {
                    return resolve(data.result);
                } else {
                    console.log('NULL');
                    console.log(err, data);
                }
            });
        });
    },
    getHeightFromHash:function(config, hash){
        return new Promise(function (resolve, reject) {
            let data = {
                id:+new Date(),
                method:'getblock',
                params:[hash]
            }
            let auth = `${config.user}:${config.password}`;
            _fetch({type: "POST", host: config.host, port:config.port, auth:auth,data:data}, function (err, data) {
                if (data && data.hasOwnProperty('result') && data.result.hasOwnProperty('height')) {
                    return resolve(data.result.height);
                } else {
                    console.log('NULL');
                    console.log(err, data);
                }
            });
        });
    },
    retrieveBlockHeaders:function(config,fromHeight, numberOfBlockheaders, direction){
        return new Promise(function(resolve, reject){
            return resolve(new Error('Not handled by RPC yet'));
        })
    },
    expectNextDifficulty:function(config){
        return new Promise(function(resolve, reject){
            return resolve(new Error('Not handled by RPC yet'));
        })
    }
};
module.exports = dashRPC;