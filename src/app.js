const path = require('path');
const hbs = require('hbs');
const express = require('express');
const getCovidData = require('./utils/covid');

// declare express
const app = express();
const port = process.env.PORT || 3000;

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

    getCovidData(countryQuery, (error, data) => {


        if(error){
            return res.send({
                error               
            });
        }
        

        // format the numbers
        const confirmed = data.todayCases.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        const deaths = data.todayDeaths.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        const recovered = data.todayRecovered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        const active = data.active.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        res.send({
            title: 'Results',
            country: req.query.country,
            confirmed: confirmed,
            deaths: deaths,
            recovered: recovered,
            active: active
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


app.listen(port, () => {
    console.log('Server is running');
});