const config = require('./config.js');
var DBH = require('../index');
var blockchain = new DBH(config);

blockchain
    .getLastBlockHeight()
    .then(function (height) {
        console.log(`height of lastBlock is ${height}`);
    })