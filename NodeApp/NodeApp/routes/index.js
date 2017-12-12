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

/* GET image search page */
router.get('/images', function(req, res, next) {
  //console.log("GOT IMAGES SIGNAL");
  res.sendFile(path.join(__dirname, '../', 'views', 'images.html'));
});

router.get('/reference', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'reference.html'));
});

router.get('/insert', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'insert.html'));
});

router.get('/queries', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'queries.html'));
});

var temp;
// most frequent pickup locations closest to input
router.post('/pickup/', function(req,res) {

  var latitude = req.body.latitude;
  var longitude = req.body.longitude;

  var query = 'Select DISTINCT Business.name, Business.latitude, Business.longitude' +
              ' From (Select latitude, longitude' + 
              ' From Pickup' +
              ' Order by count) Taxi' +
              ' Join BusinessLocationRel' +
              ' On ROUND(BusinessLocationRel.latitude,4)=ROUND(Taxi.latitude,4) and ROUND(BusinessLocationRel.longitude,4)=ROUND(Taxi.longitude,4)' +
              ' Join Business on BusinessLocationRel.id=Business.id';

  query = query + ' Order by ABS((' + latitude+ '-Business.latitude)+(' + longitude+ '-Business.longitude))';
  query = query + ' LIMIT 40'
  console.log(query);
  connection.query(query, function(err, rows, fields) {
      if (err) console.log(err);
      else {
          console.log(rows);
          temp = rows;
          res.sendFile(path.join(__dirname, '../', 'views', 'queries.html'));
      }  
    });    
});

router.get('/data', function(req, res) {
  console.log("TEmp: " + temp);
  res.send(temp);
});

// most frequent dropoff locations closest to input
router.post('/dropoff', function(req,res) {

  var latitude = req.body.latitude;
  var longitude = req.body.longitude;

  var query = 'Select DISTINCT Business.name, Business.latitude, Business.longitude' +
              ' From (Select latitude, longitude' + 
              ' From Dropoff' +
              ' Order by count) Taxi' +
              ' Join BusinessLocationRel' +
              ' On ROUND(BusinessLocationRel.latitude,4)=ROUND(Taxi.latitude,4) and ROUND(BusinessLocationRel.longitude,4)=ROUND(Taxi.longitude,4)' +
              ' Join Business on BusinessLocationRel.id=Business.id';

  query = query + ' Order by ABS((' + latitude + '-Business.latitude)+(' + longitude + '-Business.longitude))';
  query = query + ' LIMIT 40'

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        console.log(rows);
        temp = rows;
        res.sendFile(path.join(__dirname, '../', 'views', 'queries.html'));
    }  
    });
});

router.get('/queries', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../', 'views', 'queries.html'));
});

// most common categories closest to input
router.post('/categories', function(req,res) {

  var latitude = req.body.latitude;
  var longitude = req.body.longitude;

  var query = 'Select DISTINCT Business.categories, count(distinct concat(Taxi.latitude, Taxi.longitude)) as count' +
              ' From ((SELECT latitude, longitude' +
              ' FROM Pickup' +
              ' ORDER BY count)' +
              ' UNION ALL' +
              ' (Select latitude, longitude' +
              ' From Dropoff' +
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
        temp = rows;
        res.sendFile(path.join(__dirname, '../', 'views', 'queries.html'));
    }  
    });
});

// highest rated locations closest to input
router.post('/fivestar', function(req,res) {

  var latitude = req.body.latitude;
  var longitude = req.body.longitude;

  var query = 'SELECT DISTINCT Business.name, Business.latitude, Business.longitude ' +
              'FROM Dropoff' + 
              'JOIN BusinessLocationRel ON ROUND(Dropoff.latitude, 5) = ' +
              'ROUND(BusinessLocationRel.latitude, 5) AND ROUND(Dropoff.longitude, 5) = ' + 
              'ROUND(BusinessLocationRel.longitude, 5)' +  
              'JOIN Business ON Business.id = BusinessLocationRel.id'; 

  query = query + ' Order by Business.rating desc, ABS((' + latitude+ '-Business.latitude)+(' + longitude+ '-Business.longitude)) asc, Dropoff.count desc';
  query = query + ' LIMIT 20';

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        console.log(rows);
        temp = rows;
        res.sendFile(path.join(__dirname, '../', 'views', 'queries.html'));
    }  
    });
});

// tourist destinations closest to input
router.post('/landmark', function(req,res) {

  var latitude = req.body.latitude;
  var longitude = req.body.longitude;

  var query = 'SELECT DISTINCT Business.name, Business.latitude, Business.longitude ' +
              ' FROM Dropoff' +
              ' JOIN BusinessLocationRel ON ROUND(Dropoff.latitude,4) = ' +
              ' ROUND(BusinessLocationRel.latitude,4) AND ROUND(Dropoff.longitude,4)= ' +
              ' ROUND(BusinessLocationRel.longitude,4)' +
              ' JOIN Business ON Business.id = BusinessLocationRel.id' +
              ' WHERE Business.categories LIKE \'%Landmarks%\'' +
              ' OR Business.categories LIKE \'%Local Flavor%\'';

  query = query + ' Order by ABS((' + latitude+ '-Business.latitude)+(' + longitude+ '-Business.longitude)), Dropoff.count desc';
  query = query + ' LIMIT 20';

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        console.log(rows);
        temp = rows;
        res.sendFile(path.join(__dirname, '../', 'views', 'queries.html'));
    }  
    });
});

// restaurants closest to input
router.post('/restaurants', function(req,res) {

  var latitude = req.body.latitude;
  var longitude = req.body.longitude;

  var query = 'SELECT DISTINCT Business.name, Business.latitude, Business.longitude ' +
              ' FROM Dropoff' +
              ' JOIN BusinessLocationRel ON ROUND(Dropoff.latitude,4) = ' +
              ' ROUND(BusinessLocationRel.latitude,4) AND ROUND(Dropoff.longitude,4)= ' +
              ' ROUND(BusinessLocationRel.longitude,4)' +
              ' JOIN Business ON Business.business_id = BusinessLocationRel.business_id' +
              ' WHERE Business.categories LIKE \'%Food%\'' +
              ' OR Business.categories LIKE \'%Restaurants%\'' +
              ' OR Business.categories LIKE \'%Fast Food%\'';


  query = query + ' Order by ABS((' + latitude+ '-Business.latitude)+(' + longitude+ '-Business.longitude)), Dropoff.count desc';
  query = query + ' LIMIT 20';

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        console.log(rows);
        temp = rows;
        res.sendFile(path.join(__dirname, '../', 'views', 'queries.html'));
    }  
    });
});

router.post('/images', function(req,res){
	var city = req.body.city;

	// var query =' SELECT B.name, P.photo_id' +
	// 			' FROM Business_NonNY B JOIN Business_Photos P' +
	// 			' ON B.business_id = P.business_id AND B.city = ' + '\''+ city + '\'';

  var query = 'SELECT B.name, P.photo_id' +
              ' FROM (SELECT Bus.business_id, Bus.name FROM Business_NonNY Bus WHERE Bus.city = ' + '\''+ city + '\' LIMIT 50) B JOIN Business_Photos P' +
              ' ON B.business_id = P.business_id LIMIT 50';

	connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
        console.log(rows);
        temp = rows;
        res.sendFile(path.join(__dirname, '../', 'views', 'images.html'));
    }  
    });

});

module.exports = router;