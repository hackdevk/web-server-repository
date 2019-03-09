const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

//'process.env'  is an object that stores all our environment variables as key value pairs
// We are looking for the one in which 'heroku called as port' 
const port = process.env.PORT || 3000;  //if the 'process.env.PORT' does not exist then heroku will set the port to 3000

var app = express();   //calling the express function

// a partial is a partial piece of our website. Its something which we can reuse throughout our templates
// For example, the footer partial that renders the footer code. It is used when we want to reuse some part of our webite's page in some other pages.
// Just like the <?php include header.php ?> or <?php include footer.php ?>
//This function takes the directory for the handlebar partials which we want to use
hbs.registerPartials(__dirname + '/views/partials');

//setting express for using handlebars
//for templates we have to make new diectory called 'views'(which is the default one)
app.set('view engine', 'hbs');

//using express middleware(its a way to configure the server for user) function
//here we are using the predefined function 'static()'
//and the'__dirname' is the absolute directory
// app.use(express.static(__dirname + '/public'));
// currenly the express server is responding inside of the express static middleware. 
// So our maintenance middleware doesn't get a chance to execute

app.use((req, res, next) => {   //also a middleware
    var now = new Date().toString(); //getting the current date in the string format

    // console.log(`${now}: ${req.method} ${req.url}`)  //using template strings
    //the 'method' gives the request type(i.e GET or POST) and 'url' gives the path i.e page which the user goes to
    //And both are coming through the request object i.e 'req'  
    var log = `${now}: ${req.method} ${req.url}`;  //storing all the data in a variable for printing it into a log file
    console.log(log);
    fs.appendFile('server.log', log+ '\n', (err) => {
        if(err) {
            console.log('Unable to append to server.log')
        }
    });

    // when we do not pass 'next()' then the page will never finish loading 
    // because then the middleware doesn't call 'next()'
    next();
});

// app.use((req, res, next) => {   //This portion of the code restricts the user to access any page and gives the message of under maintenace
//     res.render('maintenace.hbs');
// });

//putting it after the 'maintenance.hbs' so that the 'public.html' file is also in the private section and not accessible
app.use(express.static(__dirname + '/public'));

// handlebars helper are the functions which we dynamically run in our program
//Like in here we will use with the 'currentYear' which generates the cuurent year with the help of the 'Date' object
//this function registers the helper which can be used throughout the program,The first argument is the name of the helper and we can use it in the program
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear()
});

//this handlebar helper takes the value and gives its uppercase value
hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

//it is for sending a response to the user who requests the root page
// the 'req' (request) contains information about the request made like headers,http,etc
// the 'res' (response) contains many functions which we can use to customize the data which we want to sent back and the http headers 
// the send function responds to the requests by sending some data back
//to see the message type 'localhost:3000'
app.get('/', (req, res) => {
    // res.send('<h1>Hello Express!!</h1>');      //we can also add html tags under it
    // res.send('<h1>Hello Express!!'); 
    // res.send({
    //     name: 'Andrew',
    //     likes: [
    //         'Biking',
    //         'Cities'
    //     ]
    // });

    //sending 
    res.render('home.hbs', {
        pageTitle: 'Root Page',
        // currentYear: new Date().getFullYear(),
        message: 'Welcome to my website new user!!'
    });
});

//adding another page called as the 'about'
//to see the message type 'localhost:3000/about'
//through the second argument we are passing the data through 'render()' function
app.get('/about', (req, res) => { //rendering this template('about.hbs') with the current view engine
    res.render('about.hbs', {
        pageTitle: 'About Page',
        // currentYear: new Date().getFullYear()
    });
});

//adding another page called as 'bad'
//it sends JSON data back 
app.get('/bad',(req, res) => {
    res.send({
        name:'Wrong page error',
        desc:'FUCK OFF!!'
    });
    // res.send('The error message shows!!');
    
});

//this listen() binds the application to a port on our machine
// app.listen(3000);

//now it's using a static value i.e 3000 so we want to change it to dynamic value 
//using listen() with the second argument 
// app.listen(3000, () => {
//     console.log('Server is up on port 3000.!!'); //but this message is more like a confirmational message and it will only show in CMD
// });

//using the constant we created for port
app.listen(port, () => {
    console.log(`Server is up on port ${port}.!!!`);
});
