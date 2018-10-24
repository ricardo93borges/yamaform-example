var express = require('express');
var app = express();

var Yamaform = require('yamaform');
let yamaform = new Yamaform({}, `${__dirname}/database.json`)

app.get('/', function (req, res) {

  res.set('Content-Type', 'text/html');
  res.send(new Buffer('<h2>Hello World!</h2>'));;
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});