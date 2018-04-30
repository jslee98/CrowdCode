const express = require('express')
const bodyParser= require('body-parser')
const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
app.use(function(req, res, next) { res.header("Access-Control-Allow-Origin", "*"); res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');next(); });
app.set('view engine', 'ejs')

const MongoClient = require('mongodb').MongoClient

var db = null

//creates RESTful API
//https://calm-headland-11311.herokuapp.com/
//Above is the link
//Endpoint is the pin used by /pin or an example https://calm-headland-11311.herokuapp.com//100001
//if a pin exists it displays the json
//otherwise it displays an error

MongoClient.connect('mongodb://admin:password@18.191.29.110/projectDB', (err, client) => {
  //MongoDB hosted on AWS
  if (err) return console.log(err)
  db = client.db('projectDB')
  app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
})

app.get('/', (req, res) => {
  //returns whole JSON MongoDB database
  db.collection('projects').find().toArray((err, result) => {
    if (err) return console.log(err)
    console.log(result)
    res.send(result)
  })
})

app.get('/:pin', function (req, res) {
  //returns a specific pin and the fields associated with it
  //if the pin is not there, it returns a JSON object, result: error
  //React checks for the error
  db.collection("projects").findOne(req.params, function(err, result) {
    if (err) throw err
    if (result == null)
      result = { result: "error" }
    console.log(result)
    res.send(result)
  });
})

app.post('/projects', (req, res) => {
  //used to post to the projects collection in the MongoDB
  //this post is used when creating a new pin
  db.collection('projects').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.post('/:pin', (req, res) => {
  //this post is used to update to an existing pin when changing a function
  db.collection('projects').updateOne({pin:req.params.pin}, {$set: {functions:req.body.updatedFunctions}}, function(err, count, result) {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})
