const express = require('express')
const mysql = require('mysql')
const router = express.Router()
require('dotenv').config();
const pool = mysql.createPool({
    connectionLimit: 10,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: 'evalpal',
    socketPath: `/cloudsql/metal-filament-270618:us-east1:evalpal`
})
function getConnection() {
    return pool
}
router.get("/professor/:professor", (req, res) => {

    url = "/api"+req.url;
    res.render('ratings.ejs', {data:url});
})
router.get("/api/professor/:professor", (req, res) => {
    
    const connection = getConnection();
    let professorId = req.params.professor;
    let sqlQueryString = "";
    if(isLetter(professorId.charAt(0))){
    sqlQueryString = " instructor_name LIKE ?"
    professorId = '%' + professorId + '%';
    }
    else{
    sqlQueryString = " instructor_netid = ?"
    }
    var keys = [professorId];

    
    for(var key in req.query){
        sqlQueryString = sqlQueryString + " AND " +key+ " = ?";
        keys.push(req.query[key]);
    }
    const queryString = "SELECT * FROM summer WHERE"+sqlQueryString;
    console.log(keys);
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
module.exports = router
