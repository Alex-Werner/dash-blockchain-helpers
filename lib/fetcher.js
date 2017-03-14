'use strict';
const requesterJSON = require('../util/requesterJSON');
const Fetcher = {
    _fetch: function (opts, cb) {
        let _GET = function (opts, cb) {
            requesterJSON
                .get(opts.url)
                .then(function (r) {
                    cb(null, r);
                })
                .catch(function(e){
                    cb(e, null);
                });
        };
        
        var self = this;
        if (opts.type && opts.url) {
            if (opts.type == 'GET') {
                _GET(opts, cb);
            }
        } else {
            cb('missing parameter', null);
        }
    },
};
module.exports = Fetcher;