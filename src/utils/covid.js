const request = require('request');

const getCovidData = (country, callback) => {
    let url = `https://corona.lmao.ninja/v2/countries/${country}`;

    request({
        url: url,
        json: true
    }, (error, response) => {

        if (response.body.message) {
            return callback('Invalid Location', undefined)
        } 
        
        return callback(undefined, response.body)


    });
}

module.exports = getCovidData;