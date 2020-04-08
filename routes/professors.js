const express = require('express')
const mysql = require('mysql')
const router = express.Router()

const pool = mysql.createPool({
    connectionLimit: 10,
    user: 'root',
    password: 'cwru2023',
    database: 'evalpal',
    socketPath: `/cloudsql/metal-filament-270618:us-east1:evalpal`
})
function getConnection() {
    return pool
}

router.get("/professor/:professor", (req, res) => {
    
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
