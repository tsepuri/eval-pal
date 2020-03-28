const express = require('express');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const app = express();
const mysql = require('mysql');
const path = require(`path`);
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('./public'))
const routerSubject = require('./routes/subject.js')
const routerProfessor = require('./routes/professors.js')
app.use(routerSubject)
app.use(routerProfessor)
const cheerio = require('cheerio')
const request = require('request')
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
   
})
app.post("/Options.html", (req, res) => {
    res.sendFile(path.join(__dirname, '/public/options.html'));
    
})
app.get('/submit', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/form.html'));
  });
  app.post('/submit', (req, res) => {
    console.log({
      name: req.body.name,
      message: req.body.message
    });
    var xmlHttp = new XMLHttpRequest();
    let url = 'metal-filament-270618.appspot.com/professor/' + req.body.name;

    xmlHttp.open("GET", url, true);
    xmlHttp.send();
    console.log(xmlHttp.responseText);
    
    xmlHttp.onreadystatechange = (e) => {
    console.log(xmlHttp.responseText)
  }
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
/*app.listen(3000, () => {
    console.log("Serve is running..")
});
*/
module.exports = app;