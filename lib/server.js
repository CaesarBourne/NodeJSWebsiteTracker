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
var util = require("util");
var debug = util.debuglog("server");


//  helpers.sendTwilioSms("7036414883","hello boss",function(msg){
//   console.log("This is the eror", msg)
// })

var server = {};

//server shuld respond to all requests witha string
server.httpServer = http.createServer(function (req, res) {
  server.unifiedServer(req, res)

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
url.parse(req.url, true);
req.method.toLowerCase
s = new StringDecoder("utf-8")
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
  });
  //sprocess request

  req.on("end", function (end) {
    buffer += decoder.end()
  

  var chosenHandler =
    typeof (server.router[trimmedPath]) !== "undefined" ? server.router[trimmedPath] : handlers.notFound
    
    //handle dynamic routes for public here by using the public handler if th trimmed path has "public/" string
    //else  let th router handl it
    chosenHandler = trimmedPath.indexOf("public/") > -1 ? handlers.public: chosenHandler;

   
  var data = {
    "trimmedPath": trimmedPath,
    "queryStringObject": queryStringObject,
    "method": method,
    "headers": headers,
    "payload": helpers.parseJsonToObject(buffer)
  }
   
  //the function below is to pass data to handler and handle the callback data
//pass data and expect apayload status code and contentType
try{
  chosenHandler(data, function (statusCode, payload, contentType) {
    server.processResponseForUser(res, method, trimmedPath, statusCode,payload, contentType)
  });

 }catch(e){
  debug(e);
  let error = { "Error": "unknown aerror has occured"}
  server.processResponseForUser(res, method, trimmedPath, 500,error, "json");
  
}

})
}
//procees response fro handler before client
server.processResponseForUser = (res,method, trimmedPath, statusCode, payload, contentType ) =>{
  statusCode = typeof (statusCode) == "number" ? statusCode : 200
  contentType = typeof(contentType) == "string"? contentType : "json";
  var payloadString ="";
  
if(contentType == "json"){
  res.setHeader("Content-Type", "application/json")
 payload = typeof (payload) == "object" ? payload : {};
 payloadString = JSON.stringify(payload);
 
}

if(contentType == "html"){
  res.setHeader("Content-Type", "text/html");
 payloadString = typeof(payload) == "string" ? payload: "";

}
if(contentType == "jpg"){
 payloadString = typeof(payload) !== "undefined" ? payload: "";
 res.setHeader("Content-Type", "image/jpeg");
}
if(contentType == "favicon"){
 payloadString = typeof(payload) !== "undefined"? payload: "";
 res.setHeader("Content-Type", "image/x-icon");
}
if(contentType == "png"){
 payloadString = typeof(payload)!== "undefined" ? payload: "";
 res.setHeader("Content-Type", "image/png");
}
if(contentType == "css"){
 payloadString = typeof(payload)!== "undefined" ? payload: "";
 res.setHeader("Content-Type", "text/css");
}
if(contentType == "plain"){
 payloadString = typeof(payload) !== "undefined" ? payload: "";
 res.setHeader("Content-Type", "text/plain");
}



res.writeHead(statusCode)
res.end(payloadString)

if(statusCode == 200){
 debug("\x1b[32m%s\x1b[0m", method.toUpperCase()+ " /" + trimmedPath+" " + statusCode)
}else{
 debug("\x1b[31m%s\x1b[0m", method.toUpperCase()+ " /" + trimmedPath+" " + statusCode)
}
// debug.log(
//   "this is the payload and statusCode respectively: ",
//   payloadString,
//   statusCode
// )
}

server.init = function(){

    //start server \and have it listen on port 3000
server.httpServer.listen(config.httpPort, function () {
  console.log( "\x1b[35m%s\x1b[0m", "boss your server is listening on port: " + config.httpPort)
  })

  //start server \and have it listen on port 3000
server.httpsServer.listen(config.httpsPort, function () {
    console.log( "\x1b[36m%s\x1b[0m" ,"boss your server is listening on port: " + config.httpsPort)
  })
  
}

server.router = {
  "" : handlers.index,
  "account/create" : handlers.accountCreate,
  "account/edit" : handlers.accountEdit,
  "account/deleted" : handlers.Deleted,
  "session/create" : handlers.sessionCreate,
  "session/deleted" : handlers.sessionDeleted,
  "checks/all" : handlers.checklist,
  "checks/create" : handlers.checksCreate,
  "checks/edit" : handlers.checksEdit,
  "ping": handlers.ping,
  "api/users": handlers.users,
  "api/tokens" : handlers.tokens,
  "api/checks" : handlers.checks,
  "favicon.ico": handlers.favicon,
  "public": handlers.public,
  "error": handlers.error
}

module.exports = server;