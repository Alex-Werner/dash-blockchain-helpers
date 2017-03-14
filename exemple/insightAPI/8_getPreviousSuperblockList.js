const config = require('./config.js');
var DBH = require('../index');
var blockchain = new DBH(config);

//Will return all superblocks issues since the last block height generated.
blockchain
    .getPreviousSuperblockList()
    .then(function (superblockList) {
        console.log(superblockList);
    });

//Will return the last superblock from the given block height
blockchain
    .getPreviousSuperblockList(598177,1)
    .then(function (superblockList) {
        console.log(superblockList);
    });

