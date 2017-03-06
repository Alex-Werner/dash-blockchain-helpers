'use strict';
const request = require('request');

const Fetcher = {
    _fetch : function(opts,cb) {
        let _GET = function(opts, cb){
            request({type:'GET',url:opts.url, data: {format: "json"}}, function(e, r, data) {
                if (!e && r.statusCode == 200) {
                    cb(null, JSON.parse(data));
                }else{
                    if(r && r.statusCode){
                        cb(`Error ${r.statusCode}: ${e}`, null);
                    }else{
                        cb(e, null);
                    }
                }
            });
        };
        
        var self = this;
        if(opts.type && opts.url) {
            if (opts.type == 'GET') {
                _GET(opts,cb);
            }
        } else {
            cb('missing parameter',null);
        }
    },
};
module.exports = Fetcher;