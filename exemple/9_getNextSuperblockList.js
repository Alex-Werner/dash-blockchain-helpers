const config = require('./config.js');
var DBH = require('../index');
var blockchain = new DBH(config);

//Will return the next superblock
blockchain
    .getNextSuperblockList()
    .then(function (superblockList) {
        console.log(superblockList);
    });

//Will return the next superblock from the given block height
blockchain
    .getNextSuperblockList(598177,1)
    .then(function (superblockList) {
        console.log(superblockList);
    });