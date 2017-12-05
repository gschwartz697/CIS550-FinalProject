var express = require('express');
var router = express.Router();
var path = require('path');

// Connect string to MySQL
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'xxx',
  user     : 'xxx',
  password : 'xxx',
  database : 'xxx'
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'index.html'));
});

/* GET image search page */
router.get('/image', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'images.html'));
});

router.get('/reference', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'reference.html'));
});

router.get('/insert', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'insert.html'));
});

// stella you can change the routes to whatever you want
// ie you will probably need to add query params for long lat
router.get('/data/:email', function(req,res) {

  // replace these with user input location
  var latitude = 40.7172485;
  var longitude = -73.9448511;

  var query = 'Select DISTINCT Business.name, Business.latitude, Business.longitude' +
              ' From (Select latitude, longitude' + 
              ' From Taxi_Pickup' +
              ' Order by count) Taxi' +
              ' Join BusinessLocationRel' +
              ' On ROUND(BusinessLocationRel.latitude,4)=ROUND(Taxi.latitude,4) and ROUND(BusinessLocationRel.longitude,4)=ROUND(Taxi.longitude,4)' +
              ' Join Business on BusinessLocationRel.id=Business.id';

  // var query =' Select DISTINCT Business.name, Business.latitude, Business.longitude From (Select latitude, longitude From Taxi_Pickup Order by count) Taxi Join Business on  ROUND(Business.latitude, 4)=ROUND(Taxi.latitude, 4) and ROUND(Business.longitude,5)=ROUND(Taxi.longitude, 5)';

  query = query + ' Order by ABS((' + latitude+ '-Business.latitude)+(' + longitude+ '-Business.longitude))';
  query = query + ' LIMIT 40'

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        console.log(rows);
        res.json(rows);
    }  
    });
});

router.get('/dropoff', function(req,res) {

  // replace these with user input location
  var latitude = 40.7172485;
  var longitude = -73.9448511;

  var query = 'Select DISTINCT Business.name, Business.latitude, Business.longitude' +
              'From (Select latitude, longitude' + 
              'From Taxi_Dropoff' +
              'Order by count) Taxi' +
              'Join BusinessLocationRel' +
              'On ROUND(BusinessLocationRel.latitude,4)=ROUND(Taxi.latitude,4) and ROUND(BusinessLocationRel.longitude,4)=ROUND(Taxi.longitude,4)' +
              'Join Business on BusinessLocationRel.id=Business.id';

  query = query + ' Order by ABS((' + latitude+ '-Business.latitude)+(' + longitude+ '-Business.longitude))';
  query = query + ' LIMIT 40'

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        console.log(rows);
        res.json(rows);
    }  
    });
});




module.exports = router;