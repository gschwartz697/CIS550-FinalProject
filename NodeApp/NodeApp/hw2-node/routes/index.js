var express = require('express');
var router = express.Router();
var path = require('path');

// Connect string to MySQL
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'fling.seas.upenn.edu',
  user     : 'schwg',
  password : 'JaGaDa264!',
  database : 'schwg'
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'index.html'));
});

router.get('/reference', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'reference.html'));
});

router.get('/insert', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'insert.html'));
});

router.get('/data/:email', function(req,res) {
  // use console.log() as print() in case you want to debug, example below:
  var query = '(SELECT P.*, COUNT(F.login) AS numberOfFriends from Person P LEFT JOIN Friends F ON P.login = F.login GROUP BY P.login)';
  // var query = 'SELECT * FROM Person';
  // you may change the query during implementation
  var email = req.params.email;
  if (email != 'undefined') query = query + ' where login ="' + email + '"' ;
  // console.log(query);
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        res.json(rows);
    }  
    });
});

// ----Your implemention of route handler for "Insert a new record" should go here-----

router.get('/insert/:login/:name/:sex/:RelationshipStatus/:Birthyear', function(req, res) {
  var login1 = req.params.login;
  var name1 = req.params.name;
  var sex1 = req.params.sex;
  var relationshipStatus1 = req.params.RelationshipStatus;
  var birthyear1 = req.params.Birthyear;

  var query = 'INSERT INTO Person SET ?'
  console.log(query);
  var set = {login: login1, 
             name: name1, 
             sex: sex1, 
             RelationshipStatus: relationshipStatus1, 
             Birthyear: birthyear1
  };

  connection.query(query, set, function(err, rows, fields){
    if (err) console.log(err);
    else {
        res.json(rows);
    }  
  });
});


module.exports = router;