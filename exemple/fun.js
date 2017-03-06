const config = require('./config.js');
var DBH = require('../index');
var blockchain = new DBH(config);

async function test(){
    var superblockList = await blockchain.getPreviousSuperblockList();
    console.log(superblockList);
}
test();