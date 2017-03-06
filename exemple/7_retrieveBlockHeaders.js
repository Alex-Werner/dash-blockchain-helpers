const config = require('./config.js');
var DBH = require('../index');
var blockchain = new DBH(config);

//Will return a blockheaders array (25) from 614767 to 614791 
blockchain
    .retrieveBlockHeaders(614767,25)
    .then(function (headers) {
        console.log(headers);
    })

//Will return a blockheaders array (25) from 614791 to 614767 
blockchain
    .retrieveBlockHeaders(614791,25,-1)
    .then(function (headers) {
        console.log(headers);
    })