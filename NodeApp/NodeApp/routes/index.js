var express = require('express');
var router = express.Router();
var path = require('path');

// Connect string to MySQL
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'cis450-final-project.ccgv1mp2bvqd.us-east-1.rds.amazonaws.com',
  user     : 'dorothychang',
  password : 'password450',
  database : 'cis450finalproject'
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

// most frequent pickup locations closest to input
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

// most frequent dropoff locations closest to input
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

// most common categories closest to input
router.get('/categories', function(req,res) {

  // replace these with user input location
  var latitude = 40.7172485;
  var longitude = -73.9448511;

  var query = 'Select Business.categories, count(distinct concat(Taxi.latitude, Taxi.longitude)) as count' +
              ' From ((SELECT latitude, longitude' +
              ' FROM Taxi_Pickup' +
              ' ORDER BY count)' +
              ' UNION ALL' +
              ' (Select latitude, longitude' +
              ' From Taxi_Dropoff' +
              ' Order by count)) Taxi' +
              ' Join BusinessLocationRel' +
              ' On ROUND(BusinessLocationRel.latitude,5)=ROUND(Taxi.latitude,5) and ROUND(BusinessLocationRel.longitude,5)=ROUND(Taxi.longitude,5)' +
              ' Join Business on BusinessLocationRel.id=Business.id' +
              ' Group by Business.categories';

  query = query + ' Order by ABS((' + latitude+ '-Business.latitude)+(' + longitude+ '-Business.longitude)), count desc';
  query = query + ' LIMIT 20'

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        console.log(rows);
        res.json(rows);
    }  
    });
});

// highest rated locations closest to input
router.get('/fivestar', function(req,res) {

  // replace these with user input location
  var latitude = 40.7172485;
  var longitude = -73.9448511;

  var query = 'SELECT DISTINCT Business.name, Business.rating, Business.latitude, Business.longitude' +
              ' FROM Taxi_Dropoff' +
              ' JOIN BusinessLocationRel ON ROUND(Taxi_Dropoff.latitude, 5) = ' +
              ' ROUND(BusinessLocationRel.latitude, 5) AND ROUND(Taxi_Dropoff.longitude, 5) = ' +
              ' ROUND(BusinessLocationRel.longitude, 5)' +
              ' JOIN Business ON Business.id = BusinessLocationRel.id'; 

  query = query + ' Order by Business.rating desc, ABS((' + latitude+ '-Business.latitude)+(' + longitude+ '-Business.longitude)) asc, Taxi_Dropoff.count desc';
  query = query + ' LIMIT 20';

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        console.log(rows);
        res.json(rows);
    }  
    });
});

// tourist destinations closest to input
router.get('/landmark', function(req,res) {

  // replace these with user input location
  var latitude = 40.7172485;
  var longitude = -73.9448511;

  var query = 'SELECT DISTINCT Business.name, Business.latitude, Business.longitude' +
              ' FROM Taxi_Dropoff' +
              ' JOIN BusinessLocationRel ON ROUND(Taxi_Dropoff.latitude,4) = ' +
              ' ROUND(BusinessLocationRel.latitude,4) AND ROUND(Taxi_Dropoff.longitude,4)= ' +
              ' ROUND(BusinessLocationRel.longitude,4)' +
              ' JOIN Business ON Business.id = BusinessLocationRel.id' +
              ' WHERE Business.categories LIKE \'%Landmarks%\'' +
              ' OR Business.categories LIKE \'%Local Flavor%\'';

  query = query + ' Order by ABS((' + latitude+ '-Business.latitude)+(' + longitude+ '-Business.longitude)), Taxi_Dropoff.count desc';
  query = query + ' LIMIT 20';

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        console.log(rows);
        res.json(rows);
    }  
    });
});

// restaurants closest to input
router.get('/restaurants', function(req,res) {

  // replace these with user input location
  var latitude = 40.7172485;
  var longitude = -73.9448511;

  var query = 'SELECT DISTINCT Business.name, Business.latitude, Business.longitude' +
              ' FROM Taxi_Dropoff' +
              ' JOIN BusinessLocationRel ON ROUND(Taxi_Dropoff.latitude,5) = ' +
              ' ROUND(BusinessLocationRel.latitude,5) AND ROUND(Taxi_Dropoff.longitude,5)= ' +
              ' ROUND(BusinessLocationRel.longitude,5)' +
              ' JOIN Business ON Business.business_id = BusinessLocationRel.business_id' +
              ' WHERE Business.categories LIKE \'%Food%\'' +
              ' OR Business.categories LIKE \'%Restaurants%\'' +
              ' OR Business.categories LIKE \'%Fast Food%\'';


  query = query + ' Order by ABS((' + latitude+ '-Business.latitude)+(' + longitude+ '-Business.longitude)), Taxi_Dropoff.count desc';
  query = query + ' LIMIT 20';

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        console.log(rows);
        res.json(rows);
    }  
    });
});

module.exports = router;