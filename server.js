const express = require('express');
const hbs = require('hbs');
const app = express(); //to create an app just call the method
const fs = require('fs');

hbs.registerPartials(__dirname + '/views/partials') //choose the partial directory as the argument
app.set('view engine', 'hbs') //tells app what view engine to set


app.use((req, res, next)=>{
  let now = new Date().toString();
  let log = `${now}: ${req.method} ${req.url}`
  console.log(log);
  fs.appendFile('server.log', log + '/n', (err) => {
    console.log(err);
  }) //what file, what to put to file, and cb function is required
  next();
}) //the response objects between this one and the app.get are the exact same response object

app.use((req,res,next) => {
  res.render('maintenance.hbs')
}) // the next call from the prior app.use automatically goes to the next piece of middleware

app.use(express.static(__dirname + '/public')); //order matters -- this will still show up (the html page) -- if its before the other app.use


hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
}) //use functions in partials -- first arg = name of function//what to put inside {{}}, then the cb called when invoked

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
})

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    currentYear: new Date().getFullYear(),
    welcomeMessage: 'welcome'
  }) //response from the http, sending some data back; whoever makes this request, gets this back
}) //2 args, the url, function to run//what to send back to the person who made the request

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
    currentYear: new Date().getFullYear()
  }) //render is going to let you render any of the templates you have set up with your current view engine, second arg can be an object
})

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Lol'
  })
})

//content type tells the browser what to expect
app.listen(3000, ()=>{
  console.log('Server is running on PORT 3000');
}); //binds port locally
