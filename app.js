var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var Yamaform = require('yamaform');

let databaseConfig = {
  host     : 'localhost',
  user     : 'root',
  password : 'senha',
  database : 'yamaform'
}

let yamaform = new Yamaform(databaseConfig, `${__dirname}/database.json`)

generateTables = async () => {
  await yamaform.generateTables()
}
//generateTables()

render = (html) => {
  return '<html>'
        +'<head>'
        +'<title>Yamaform example</title>'
        +'</head>'
        +'<body>'
        +'<div class="content">'
        +'<h1>Yamaform</h1>'
        +html
        +'</div>'
        +'</body>'
        +'</html>' 
}

app.get('/', async (req, res) => {

  let addressTable = await yamaform.fetch('address', {})
  let personTable = await yamaform.fetch('person', {})
  let dogTable = await yamaform.fetch('dog', {})

  res.set('Content-Type', 'text/html');
  res.send(new Buffer(
    render(
      addressTable 
      +personTable
      +dogTable
    )
  ));
});

app.get('/add', async (req, res) => {

  let addAddressForm = await yamaform.generateForm('address', {'method':'post', 'action':'/address'})
  let addPersonForm = await yamaform.generateForm('person', {'method':'post', 'action':'/person'})
  let addDogForm = await yamaform.generateForm('dog', {'method':'post', 'action':'/dog'})

  res.set('Content-Type', 'text/html');
  res.send(new Buffer(
    render(
      addAddressForm 
      +addDogForm
      +addPersonForm
    )
  ));
});

app.post('/address', async(req,res) => {
  let data = {
    'address':[{'name':req.body.name}]
  }
  yamaform.insert(data)
  res.redirect('/add')
})

app.post('/person', async(req,res) => {
  let data = {
    'person':[{'name':req.body.name, 'age':req.body.age, 'address_id':req.body.address}]
  }
  yamaform.insert(data)
  res.redirect('/add')
})

app.post('/dog', async(req,res) => {
  let data = {
    'dog':[{'name':req.body.name, 'age':req.body.age}]
  }
  yamaform.insert(data)
  res.redirect('/add')
})


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});