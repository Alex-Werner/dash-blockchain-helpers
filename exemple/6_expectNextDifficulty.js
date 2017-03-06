const config = require('./config.js');
var DBH = require('../index');
var blockchain = new DBH(config);

blockchain
    .expectNextDifficulty()
    .then(function (nextbits) {
        console.log(`bits of next block should be ${nextbits}`);
    })