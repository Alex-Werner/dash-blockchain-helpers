//TODO
module.exports = function(config){
    if(!config){
        throw new Error('No configuration given');
    }else{
        if(config.hasOwnProperty('insightAPI')){
            let insightConfig = {
                type:'insight',
                uri:'localhost/insight-api-dash'
            }
            if(config.insightAPI.hasOwnProperty('uri')){ insightConfig.uri = config.insightAPI.uri;}
            return insightConfig;
        }else if(config.hasOwnProperty('dashRPC')){
            let RPCConfig = {
                type:'RPC',
                user:'',
                password:'',
                port:'9998',
                host:'127.0.0.1'
            };

            if(config.dashRPC.hasOwnProperty('user')){ RPCConfig.user = config.dashRPC.user;}
            if(config.dashRPC.hasOwnProperty('password')){ RPCConfig.password = config.dashRPC.password;}
            if(config.dashRPC.hasOwnProperty('port')){ RPCConfig.port = config.dashRPC.port;}
            if(config.dashRPC.hasOwnProperty('host')){ RPCConfig.host = config.dashRPC.host;}
            return RPCConfig;
        }
    }
    throw new Error('Configuration Error')
};
