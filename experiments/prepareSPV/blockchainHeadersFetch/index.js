const fullFetch = require('./fullFetch');
const superFetch = require('./superFetch');
const magicFetch = require('./magicFetch');

module.exports = function(options){
  if(options && options.hasOwnProperty('apiList')){
      let apiList = options.apiList;
      if(options.hasOwnProperty('mode')){
          let mode = options.mode;
          switch(mode){
              case "full":
                  return fullFetch(apiList);
                  break;
              case "superfetch":
                  return superFetch(apiList);
                  break;
              case "magicfetch":
                  return magicFetch(apiList);
                  break;
          }
      }
      return fullFetch(apiList);
  }else{
      throw new Error('Missing APILIST');
  }
};