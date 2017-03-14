const config = require('./config.js');
var DBH = require('../index');
var blockchain = new DBH(config);

blockchain
    .getLastBlockHash()
    .then(function (hash) {
        console.log(`hash of lastBlock is ${hash}`);
    })