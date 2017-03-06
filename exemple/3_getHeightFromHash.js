const {math}=require('khal');
var hash = "0000000001aa19ea48b859299d25e17e604d647307e30deebb19429c562bca90";//Should be the hash of block 15000 in livenet

const config = require('./config.js');
var DBH = require('../index');
var blockchain = new DBH(config);

blockchain
    .getHeightFromHash(hash)
    .then(function (height) {
        console.log(`Height of ${hash} is ${height}`);
    })