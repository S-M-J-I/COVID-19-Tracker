const request = require('request');

const getCovidData = (country, callback) => {
    let url = `https://api.covid19api.com/live/country/${country}`;

    request({
        url: url,
        json: true
    }, (error, response) => {

        if (response.body.length === 0) {
            return callback('Invalid Location', undefined)
        } 
        
        return callback(undefined, response.body)


    });
}

module.exports = getCovidData;