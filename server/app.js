const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const apis = require('./apis')
const url = "mongodb://master:wu154236@localhost:12180/wishes";

let connection = mongoose.connection
connection.once('open', function () {
  console.log('数据库链接成功')
})
mongoose.connect(url, {useNewUrlParser: true})

const app = express()
app.use(bodyParser())
apis(app)

app.use(express.static('dist'))
app.listen(3003, () => {
  console.log('服务器运行在3003')
})
