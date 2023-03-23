const express = require('express')
const dbRouter = require('./dbRouter')
const port = process.env.PORT||8000
var bodyParser = require('body-parser')

const app = express()
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(bodyParser.json());
app.use(express.json())
app.use(dbRouter)
app.listen(port, () => {
    console.log(`Server running on ${port}`)
})