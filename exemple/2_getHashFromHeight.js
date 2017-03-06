const {math}=require('khal');
var height = math.randomBetweenMinAndMax(0,140000);//Get a random heigth

const config = require('./config.js');
var DBH = require('../index');
var blockchain = new DBH(config);

blockchain.getHashFromHeight(height).then(function(hash){
    console.log(`Hash of ${height} is ${hash}`);
})