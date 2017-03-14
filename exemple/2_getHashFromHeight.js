const randomBetweenMinAndMax=  function (min, max, precision = 1) {
    if (typeof(precision) === 'undefined') precision = 1;
    var r = Math.floor(Math.random() * (max - min + precision) / precision);
    return (r * precision + min);
};
var height = randomBetweenMinAndMax(0, 140000);//Get a random heigth

const config = require('./config.js');
var DBH = require('../index');
var blockchain = new DBH(config);

blockchain
    .getHashFromHeight(height)
    .then(function (hash) {
        console.log(`Hash of ${height} is ${hash}`);
    })