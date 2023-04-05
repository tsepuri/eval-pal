const express = require('express');
const app = express();
const path = require(`path`);
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('./public'))
const routerSubject = require('./routes/subject.js')
const routerProfessor = require('./routes/professors.js')
app.use(routerSubject)
app.use(routerProfessor)
const ejs = require('ejs');
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'ejs');
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
})
app.post("/Options", (req, res) => {
    //res.sendFile(path.join(__dirname, '/public/options.html'));
    res.render('options', {data: req.body.searched});


})
app.get('/submit', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/form.html'));
  });
  app.post('/submit', (req, res) => {
    
    console.log({
      name: req.body.name,
      message: req.body.message
    });
    res.end();
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
