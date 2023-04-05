const express = require('express')
const { Client } = require('pg')
const router = express.Router()
const path = require(`path`);
const bodyParser = require('body-parser')
const ejs = require('ejs');
require('dotenv').config();
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})
router.get('/messages', (req, res) => {
    console.log("Show messages")
    res.end()
})

router.get("/subject/:subject", (req, res) => {

    url = "/api"+req.url;
    res.render('ratings.ejs', {data:url});
})
router.get("/api/subject/:subject", (req, res) => {
    pool.connect((err, client, done) => {
    let subjectWithCode = req.params.subject;
    let subject = "";
    let index = 0;
    let parameterIndex = 1;
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
    const catalogNbr = subjectWithCode.substring(index);
    let keys = [subject];
    let sqlQueryString = ` subject = $${parameterIndex++}`
    if(catalogNbr){
    sqlQueryString += ` AND catalog_nbr = $${parameterIndex++}`;
    keys.push(catalogNbr);
    }
    for(let key in req.query){
        if(key==="instructor_name"){
            sqlQueryString = sqlQueryString + ` AND instructor_name LIKE $${parameterIndex++}`
            keys.push('%'+req.query[key]+'%');
        }
        else{
        sqlQueryString = sqlQueryString + " AND " +key+ ` = $${parameterIndex++}`;
        keys.push(req.query[key]);
        }
        
    }
    const queryString = "SELECT * FROM historical WHERE"+sqlQueryString;
    client.query(queryString, keys, (err, rows) => {
        if(err){
            throw err;
        }
        /*const users= rows.map((row) => {
            return {term: row.term_name, classNumber: row.class_nbr, subject: row.subject, instructorId : row.instructor_netid, enrollment: row.enrollment, catalogNumber: row.catalog_nbr, responses: row.responses}
        })
        */
       
        res.json(rows)
        client.end()
    })
    done()
})
})

function isLetter(str) {
    return str.length === 1 && str.match(/[A-Z]/i);
  }

module.exports = router
