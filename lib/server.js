/* created by Caesar Emmanuel */

//dependencies
var http = require("http")
var https = require("https")
var url = require("url")
var StringDecoder = require("string_decoder").StringDecoder
var config = require("./config")
var fs = require("fs")
var _data = require("./data")
var handlers = require("./handlers")
var helpers = require("./helpers")
var path = require("path")


//  helpers.sendTwilioSms("7036414883","hello boss",function(msg){
//   console.log("This is the eror", msg)
// })

var server = {};

//server shuld respond to all requests witha string
server.httpServer = http.createServer(function (req, res) {
  unifiedServer(req, res)

  //   //log the request path
  //   console.log(
  //     "this is the payload ", buffer)

  // })
})



server.httpsServerOptions = {
  key: fs.readFileSync(path.join(__dirname, "/../https/key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "/../https/cert.pem"))
}

server.httpsServer = https.createServer(server.httpsServerOptions, function (req, res) {
  server.unifiedServer(req, res)

  //   //log the request path
  //   console.log(
  //     "this is the payload ", buffer)

  // })
})


server.unifiedServer = function (req, res) {
  //get the url and parse it
  var parsedUrl = url.parse(req.url, true)

  //get the path from the urlthe untrimmed patrh
  var path = parsedUrl.pathname
  var trimmedPath = path.replace(/^\/+|\/+$/g, "")

  //get the querystring as an object
  var queryStringObject = parsedUrl.query
  //header
  var headers = req.headers

  var method = req.method.toLowerCase()


  //get the payload if any
  var decoder = new StringDecoder("utf-8")

  var buffer = "";

  req.on("data", function (data) {
    buffer += decoder.write(data)
  })
  //send the response

  req.on("end", function (end) {
    buffer += decoder.end()
  

  var chosenHandler =
    typeof (server.router[trimmedPath]) !== "undefined" ? server.router[trimmedPath] : handlers.notFound
    
  var data = {
    "trimmedPath": trimmedPath,
    "queryStringObject": queryStringObject,
    "method": method,
    "headers": headers,
    "payload": helper.parseJsonToObject(buffer)
  }

  chosenHandler(data, function (statusCode, payload) {
    statusCode = typeof (statusCode) == "number" ? statusCode : 200
    payload = typeof (payload) == "object" ? payload : {}

    var payloadString = JSON.stringify(payload)

    res.setHeader("Content-Type", "application/json")
    res.writeHead(statusCode)
    res.end(payloadString)

    console.log(
      "this is the payload and statusCode respectively: ",
      payloadString,
      statusCode, "na buffer", buffer, "na parsed buffer", helper.parseJsonToObject(buffer)
    )
  })
})
}

server.init = function(){

    //start server \and have it listen on port 3000
server.httpServer.listen(config.httpPort, function () {
    console.log("boss your server is listening on port: " + config.httpPort)
  })

  //start server \and have it listen on port 3000
server.httpsServer.listen(config.httpsPort, function () {
    console.log("boss your server is listening on port: " + config.httpsPort)
  })
  
}

server.router = {
  "ping": handlers.ping,
  "users": handlers.users,
  "sample": handlers.sample,
  "tokens" : handlers.tokens,
  "checks" : handlers.checks
}

module.exports = server;