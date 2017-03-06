var {clone} = require('khal');
var validateConfig = require('./validateConfig.js');
var _fetch = require('./fetcher.js')._fetch;

var DashBlockchainHelpers = function(config){
    var self = this;
    var validConfig = validateConfig(config);
    if(validConfig!==true){
        return new Error('Missing configuration property :',validConfig);
    }
    
    this.config = clone(config);
    
    this.getHashFromHeight=function(height){
        return new Promise(function(resolve, reject){
            let url = `${self.config.insightAPI_URI}/block-index/${height}`;
            _fetch({type:"GET", url:url}, function(err, data){
                if(data && data.hasOwnProperty('blockHash')){
                    return resolve(data.blockHash);
                }else{
                    console.log('NULL');
                    console.log(err, data);
                }
            });
        });
    };
    this.getHeightFromHash=function(hash){
        return new Promise(function(resolve, reject){
            let url = `${self.config.insightAPI_URI}/block/${hash}`;
            _fetch({type:"GET", url:url}, function(err, data){
                return resolve(data.height);
            });
        });
    };
    this.validateBlockchain=function(){
        return new Promise(function(resolve, reject){
            return resolve(self.config.id);
        });
    }
};
module.exports =DashBlockchainHelpers;
