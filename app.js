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

let formClasses = {
  'formClass':'', 
  'labelClass':'', 
  'inputClass':'form-control',
  'inputWrapperClass':'form-group', 
  'buttonClass':'btn btn-default pull-right'
}

generateTables = async () => {
  await yamaform.generateTables()
}
//generateTables()

render = (html) => {
  return '<html>'
        +'<head>'
        +'<title>Yamaform example</title>'
        +'<link href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css" rel="stylesheet">'
        +'</head>'
        +'<body>'
        +'<div class="container">'
        +'<h1 class="text-center">Yamaform</h1>'
        +html
        +'</div>'
        +'</body>'
        +'</html>' 
}

/**
 * Display records
 */
app.get('/', async (req, res) => {

  let addressTable = await yamaform.fetch('address', {'tableClass':'table', 'viewUrl':'/address', 'deleteUrl':'/address/delete' })
  let personTable = await yamaform.fetch('person', {'tableClass':'table','viewUrl':'/person', 'deleteUrl':'/person/delete' })
  let dogTable = await yamaform.fetch('dog', {'tableClass':'table','viewUrl':'/dog', 'deleteUrl':'/dog/delete' })

  res.set('Content-Type', 'text/html');
  res.send(new Buffer(
    render(
      `<div class="row"><div class="col-md-12">${addressTable}</div></div>`
      +`<div class="row"><div class="col-md-12">${personTable}</div></div>`
      +`<div class="row"><div class="col-md-12">${dogTable}</div></div>`
      +`<div class="row"><div class="col-md-12"><a href="/add" class="btn btn-primary pull-right">Add</a></div></div>`
    )
  ));
});

/**
 * View to insert records
 */
app.get('/add', async (req, res) => {

  let addAddressForm = await yamaform.generateForm('address', {'method':'post', 'action':'/address', ...formClasses})
  let addPersonForm = await yamaform.generateForm('person', {'method':'post', 'action':'/person', ...formClasses})
  let addDogForm = await yamaform.generateForm('dog', {'method':'post', 'action':'/dog', ...formClasses})

  res.set('Content-Type', 'text/html');
  res.send(new Buffer(
    render(
      `<div class="row"><div class="col-md-12">${addAddressForm}</div></div>`
      +`<div class="row"><div class="col-md-12">${addDogForm}</div></div>`
      +`<div class="row"><div class="col-md-12">${addPersonForm}</div></div>`
    )
  ));
});

/**
 * Insert address
 */
app.post('/address', async(req,res) => {
  let data = {
    'address':[{'name':req.body.name}]
  }
  yamaform.insert(data)
  res.redirect('/add')
})

/**
 * Insert person
 */
app.post('/person', async(req,res) => {
  let data = {
    'person':[{'name':req.body.name, 'age':req.body.age, 'address_id':req.body.address}]
  }
  yamaform.insert(data)
  res.redirect('/add')
})

/**
 * Insert dog
 */
app.post('/dog', async(req,res) => {
  let data = {
    'dog':[{'name':req.body.name, 'age':req.body.age}]
  }
  yamaform.insert(data)
  res.redirect('/add')
})

/**
 * View address
 */
app.get('/address/:id', async(req,res) => {
  let form = await yamaform.generateForm('address', {'method':'put', 'action':'/address/update', 'id':req.params.id, ...formClasses})
  res.set('Content-Type', 'text/html');
  res.send(new Buffer(render(
    `<div class="row"><div class="col-md-12">${form}</div></div>`
  )));  
})

/**
 * View person
 */
app.get('/person/:id', async(req,res) => {
  let form = await yamaform.generateForm('person', {'method':'put', 'action':'/person/update', 'id':req.params.id, ...formClasses})
  res.set('Content-Type', 'text/html');
  res.send(new Buffer(render(
    `<div class="row"><div class="col-md-12">${form}</div></div>`
  )));  
})

/**
 * View dog
 */
app.get('/dog/:id', async(req,res) => {
  let form = await yamaform.generateForm('dog', {'method':'put', 'action':'/dog/update', 'id':req.params.id, ...formClasses})
  res.set('Content-Type', 'text/html');
  res.send(new Buffer(render(
    `<div class="row"><div class="col-md-12">${form}</div></div>`
  )));  
})

/**
 * Update address
 */
app.post('/address/update', async(req,res) => {
  let data = {
    'address':[{'id':req.body.id, 'name':req.body.name}]
  }
  yamaform.update(data)
  res.redirect('/')
})

/**
 * Update person
 */
app.post('/person/update', async(req,res) => {
  let data = {
    'person':[{'id':req.body.id, 'name':req.body.name, 'age':req.body.age, 'address_id':req.body.address}]
  }
  yamaform.update(data)
  res.redirect('/')
})

/**
 * Update dog
 */
app.post('/dog/update', async(req,res) => {
  let data = {
    'dog':[{'id':req.body.id, 'name':req.body.name, 'age':req.body.age}]
  }
  yamaform.update(data)
  res.redirect('/')
})

/**
 * Delete address
 */
app.get('/address/delete/:id', async(req,res) => {
  let data = {
    "address":[{"where":`id = ${req.params.id}`}]
  }
  yamaform.remove(data)
  res.redirect('/')
})

/**
 * Delete person
 */
app.get('/person/delete/:id', async(req,res) => {
  let data = {
    "person":[{"where":`id = ${req.params.id}`}]
  }
  yamaform.remove(data)
  res.redirect('/')
})

/**
 * Delete dog
 */
app.get('/dog/delete/:id', async(req,res) => {
  let data = {
    "dog":[{"where":`id = ${req.params.id}`}]
  }
  yamaform.remove(data)
  res.redirect('/')
})


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});