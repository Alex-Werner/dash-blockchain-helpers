const {cl} = require('khal');
const config = require('./config.js');
var DBH = require('../index');
var blockchain = new DBH(config);

blockchain
    .validateBlockchain()
    .then(function (isValid) {
        console.log("Valid blockchain :", isValid);
    })
