const config = {
    insightAPI_URI:"http://192.168.0.19:3001/insight-api-dash"
};
var DBH = require('../index');
var blockchain = new DBH(config);