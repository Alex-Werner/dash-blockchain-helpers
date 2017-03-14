module.exports = function(config){
    
    
    //TODO
    
    /*var expectedConfigurationProperty = {
        'insightAPI_URI':'String'
    };
    var keys = Object.keys(expectedConfigurationProperty);
    for(var i in keys){
        var keyName = keys[i];
        var keyValue = expectedConfigurationProperty[keys[i]];
        if(!config.hasOwnProperty(keyName)){
            return `Expected key :${keyName} to be provided`;
        }
        if(config[keyName]==null){
            return `Expected key :${keyName} to not be null`;
        }
        var keyType = config[keyName].constructor.name;
        if(keyType!=keyValue){
            return `Expected key :${keyName} to have type ${keyValue} got ${keyType} instead`;
        }
    }*/
    return true;
}