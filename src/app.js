const path = require('path');
const hbs = require('hbs');
const express = require('express');
const getCovidData = require('./utils/covid');

// declare express
const app = express();


//define path dirs
const publicDir = path.join(__dirname, '../public');
const partialsDir = path.join(__dirname, '../templates/partials');
const viewsDir = path.join(__dirname, '../templates/views');


//set up the static objs
app.set('view engine', 'hbs');
app.set('views', viewsDir);
app.use(express.static(publicDir));
hbs.registerPartials(partialsDir);

// home page
app.get('/home', (req, res) => {
    res.render('index', {
        title: 'Home'
    });
});


// covid page
app.get('/covid', (req, res) => {
    
    if(!req.query.country){
        return res.send({
            error: 'Place not specified'
        });
    }

    let countryQuery = req.query.country.toLowerCase();

    if(countryQuery.includes(' ')){
        countryQuery = countryQuery.replace(' ', '-');
    }

    getCovidData(countryQuery, (error, data) => {


        if(error && data === undefined){
            return res.send({
                error               
            });
        }
        
        // format date
        let date = data[data.length-1].Date;
        date = date.split('T')[0];
        date = date.split('-');
        date = `${date[2]}-${date[1]}-${date[0]}`;

        // format the numbers
        const confirmed = data[data.length-1].Confirmed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        const deaths = data[data.length-1].Deaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        const recovered = data[data.length-1].Recovered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        const active = data[data.length-1].Active.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        res.send({
            title: 'Results',
            country: req.query.country,
            confirmed: confirmed,
            deaths: deaths,
            recovered: recovered,
            active: active,
            date: date
        });
    });

});


// about page
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Page',
        aboutActive: 'active'
    });
})

//help page
app.get('/help', (req, res) => {
    res.render('help',{
        title: 'Help',
        helpActive: 'active'
    });
})

//errors
app.get('*', (req, res) => {
    res.render('error', {
        title: 'Error',
        msg: '404! Page not found!'
    });
})


app.listen(3000, () => {
    console.log('Server is running');
});