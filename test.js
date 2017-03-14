const randomBetweenMinAndMax = function (min, max, precision = 1) {
    if (typeof(precision) === 'undefined') precision = 1;
    var r = Math.floor(Math.random() * (max - min + precision) / precision);
    return (r * precision + min);
};
var height = randomBetweenMinAndMax(0, 140000);//Get a random heigth


var DBH = require('./index.js');

const configInsight = {
    insightAPI: {
        uri: "http://192.168.0.19:3001/insight-api-dash"
    }
};
const configRPC = {
    dashRPC: {
        user: 'dashrpc',
        password: 'dashpwd',
        port: 9998,
        host: '127.0.0.1'
    }
};
var blockchainInsightAPI = new DBH(configInsight);
var blockchainRPC = new DBH(configRPC);

/* - Get hashFromHeight
 blockchainInsightAPI
 .getHashFromHeight(height)
 .then(function (hash) {
 console.log(`Hash of ${height} is ${hash}`);
 })
 blockchainRPC
 .getHashFromHeight(height)
 .then(function (hash) {
 console.log(`Hash of ${height} is ${hash}`);
 })
 */

// - Get Last Block (tip/best)
//  blockchainRPC
//  .getLastBlockHash()
//  .then(function (hash) {
//  console.log(`Last is ${hash}`);
//  })
//  blockchainInsightAPI
//  .getLastBlockHash()
//  .then(function (hash) {
//  console.log(`Last is ${hash}`);
//  })
 

/* - GetInfo / getStatus*/
// blockchainRPC.getStatus().then(function (status) {console.log(status);})
// blockchainInsightAPI.getStatus().then(function (status) {console.log(status);})


/* - Get Block
let hash = "000000000016aa0ede55a3d77e9a545eb928e68f8ef70807f93d06171b49dedd";
blockchainRPC.getBlockFromHash(hash).then(function (block) {console.log(block);})
blockchainInsightAPI.getBlockFromHash(hash).then(function (block) {console.log(block);})
*/

/* - Get Height From Hash
 let hash = "000000000016aa0ede55a3d77e9a545eb928e68f8ef70807f93d06171b49dedd";
 blockchainRPC.getHeightFromHash(hash).then(function (block) {console.log(block);})
 blockchainInsightAPI.getHeightFromHash(hash).then(function (block) {console.log(block);})
 */

/* - Get Last Height */
 // let hash = "000000000016aa0ede55a3d77e9a545eb928e68f8ef70807f93d06171b49dedd";*/
 // blockchainRPC.getLastBlockHeight().then(function (block) {console.log(block);})
 // blockchainInsightAPI.getLastBlockHeight().then(function (block) {console.log(block);})
 
 