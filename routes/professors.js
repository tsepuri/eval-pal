const express = require('express')
const mysql = require('mysql')
const router = express.Router()
require('dotenv').config();
const pool = mysql.createPool('mysql://b506c08de67802:f6489f31@us-cdbr-east-02.cleardb.com/heroku_44f21432f75dfd0?reconnect=true')
/*
const pool = mysql.createPool({
    host: 'http://us-cdbr-east-02.cleardb.com/',
    connectionLimit: 10,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: 'heroku_44f21432f75dfd0'
    //socketPath: `/cloudsql/metal-filament-270618:us-east1:evalpal`
})
*/
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
    let keys = [];
    if(isLetter(professorId.charAt(0))){
        if(hasSpace(professorId)){
    professorId = professorId.split(" ");
    sqlQueryString = " instructor_name LIKE ? AND instructor_name LIKE ?"
    let professorFirstName = '%' + professorId[0] + '%';
    let professorLastName = '%' + professorId[1] + '%';
    keys = [professorFirstName, professorLastName];
    }
    else{
        sqlQueryString = " instructor_name LIKE ?"
        professorId = '%' + professorId + '%';
        keys = [professorId];
    }
}
    else{
    sqlQueryString = " instructor_netid = ?"
    keys = [professorId];
    }
    

    
    for(let key in req.query){
        sqlQueryString = sqlQueryString + " AND " +key+ " = ?";
        keys.push(req.query[key]);
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
function hasSpace(str){
    for(let index = 0; index < str.length; index++){
        if(str[index] == ' ')
        return true;
    }
    return false;
}
function isLetter(str) {
    return str.length === 1 && str.match(/[A-Z]/i);
  }
module.exports = router
