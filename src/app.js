const path = require('path');
const express = require('express');
const hbs = require('hbs');

const geocode = require('./utils/geocode/geocode');
const weather = require('./utils/weather/weather');
const { resourceLimits } = require('worker_threads');


const app = express();
const port = process.env.PORT || 3000;

//set views location
const viewsPath = path.join(__dirname,'../templates/views');
app.set('views', viewsPath);
app.set('view engine','hbs');

//set partials location
const partialsPath = path.join(__dirname,'../templates/partials');
hbs.registerPartials(partialsPath);

//set public folder
const publicPath = path.join(__dirname,'../public');
app.use(express.static(publicPath));

//set pages
app.get('/',(req,res) => {
    res.render('index',{
        title: 'Welcome',
        text: 'Please look around',
        name: 'Bruto_1',
    });
});

app.get('/help',(req,res) => {
    res.render('help',{
        title: 'Help',
        text: 'Nothing to help you about yet',
        name: 'Arciere_2',
    });
});

app.get('/about',(req,res) => {
    res.render('about',{
        title: 'About',
        text: 'This website uses data from mapbox.com and weatherstack.com',
        name: 'Guerriero_3',
    });
}),

app.get('/weather', (req,res) => {
    let location = req.query.location;

    if(!location){
        return res.send({
            error: 'Provide a location'
        });
    }

    if(location === 'default'){
        location = undefined;
    }

    geocode(location,(error, result) => {
        if(error){
            return res.send({error});
        }
        let {geocodingName, latitude, longitude} = result;

        weather(latitude,longitude,(error, result) => {
            if(error){
                return res.send({error});
            } 
            let {weatherName, temperature, feelslike, precip} = result;
            res.send({
                query: location,
                dataString:`In ${weatherName},it is currently ${temperature} degree (but it feels like ${feelslike}) with ${precip}% probability of rain`,
                location: weatherName,
                place: geocodingName,
                latitude,
                longitude, 
                temperature, 
                feelslike, 
                precipitation: precip
            });
        });    
    });
});

//error page
app.get('/help/*', (req,res) => {
    res.status(404).render('error', {
        title: 'Article not found',
        text: 'Please search again',
        name: 'Scout_4'
    });
});

app.get('*', (req,res) => {
    res.status(404).render('error', {
        title: '404',
        text: 'Page not found',
        name: 'Scout_4'
    });
});

//start app
app.listen(port, () => {
    console.log(`running server on http://localhost:${port}`);
});
