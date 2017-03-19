var request = require('request');

function Client(opts) {
    if (!opts.API_KEY) throw new Error('API_KEY is required');
    
    var self = this;
    this.API_KEY = opts.API_KEY;
}

Client.prototype.get = function (sentence, cb) {
    return new Promise((resolve, reject) => {

        if (!sentence) throw new Error('sentence is required');

        cb = cb || (() => {});
        var self = this;

        var url = 'https://westus.api.cognitive.microsoft.com/contentmoderator/moderate/v1.0/ProcessText/Screen/?language=ita&autocorrect';

        var options = {
            url : url,
            method : 'POST',
  			headers: {
    		    'Content-Type': 'text/plain',
    			'Ocp-Apim-Subscription-Key': self.API_KEY,
                'Accept': 'application/json'
  			},
			body: sentence          
        };

        return request(options, function(err, response, result) {
            if (err) {
                reject(err);
                return cb(err);
            }

            if (response.statusCode !== 200) {
                var error = new Error('Error invoking web request, statusCode: ' + 
                    response.statusCode + ' statusMessage: ' + 
                    response.statusMessage + ' URL: ' + options.url);

                reject(error);
                return cb(error)
            }

            resolve(result);
            return cb(null, result);
        });
    });
}

module.exports = Client;