const express = require('express')
const mysql = require('mysql')
const router = express.Router()
const path = require(`path`);
const bodyParser = require('body-parser')
const ejs = require('ejs');
require('dotenv').config();
router.get('/messages', (req, res) => {
    console.log("Show messages")
    res.end()
})

router.get("/subject/:subject", (req, res) => {

    url = "/api"+req.url;
    res.render('ratings.ejs', {data:url});
})
router.get("/api/subject/:subject", (req, res) => {
    
    const connection = getConnection();
    let subjectWithCode = req.params.subject;
    let subject = "";
    let index = 0;
    //diving the inputted subject code, for example, dividing CHEM111 into CHEM and 111
    for(; index < subjectWithCode.length; index++){
        if(isLetter(subjectWithCode.charAt(index))){
            subject += subjectWithCode.charAt(index);
        }
        //exiting loop since everything after the first set of letters is part of the catalog number
        else{
            break;
        }
    }
    const catalogNbr = subjectWithCode.substr(index);
    let keys = [subject];
    let sqlQueryString = " subject = ?"
    if(catalogNbr){
    sqlQueryString += " AND catalog_nbr = ?";
    keys.push(catalogNbr);
    }
    for(let key in req.query){
        if(key==="instructor_name"){
            sqlQueryString = sqlQueryString + " AND instructor_name LIKE ?"
            keys.push('%'+req.query[key]+'%');
        }
        else{
        sqlQueryString = sqlQueryString + " AND " +key+ " = ?";
        keys.push(req.query[key]);
        }
        
    }
    const queryString = "SELECT * FROM summer WHERE"+sqlQueryString;
    connection.query(queryString, keys, (err, rows, fields) => {
        if(err){
            throw err;
        }
        /*const users= rows.map((row) => {
            return {term: row.term_name, classNumber: row.class_nbr, subject: row.subject, instructorId : row.instructor_netid, enrollment: row.enrollment, catalogNumber: row.catalog_nbr, responses: row.responses}
        })
        */
       
        res.json(rows)
        

    })
})

function isLetter(str) {
    return str.length === 1 && str.match(/[A-Z]/i);
  }
const pool = mysql.createPool('mysql://b506c08de67802:f6489f31@us-cdbr-east-02.cleardb.com/heroku_44f21432f75dfd0?reconnect=true')

function getConnection() {
    return pool
}
module.exports = router
