// 这是跟着视频写的，项目开发完成后，npm run build打包，
// 要打开dist文件夹下的index.html，需要HTTP server，所以写了一个小型的http server
// 参考视频11章 nodejs调试和webpack配置介绍视频的后半段， 与源文件build/dev-server.js
// 我自己有改动
// 要打开dist文件夹下的index.html, 需要在项目根目录用命令行node prod.server.js

var express = require('express')
var config = require('./config/index')

var port = process.env.PORT || config.build.port

var app = express()

var router = express.Router()

app.get('/', function(req, res, next) {
  req.url = '/index.html'
  next()
})

app.use(router)

var appData = require('./data.json')
var seller = appData.seller
var goods = appData.goods
var ratings = appData.ratings

var apiRoutes = express.Router()

app.get('/seller', function (req, res) {
  res.json({
    errno: 0,
    data: seller
  });
})

app.get('/goods', function (req, res) {
  res.json({
    errno: 0,
    data: goods
  })
})

app.get('/ratings', function (req, res) {
  res.json({
    errno: 0,
    data: ratings
  });
})

app.use('/api', apiRoutes)

app.use(express.static('./dist'))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('listening at http://localhost:9000')
})