/* 
create andexport configuration varaible
*/

var enviroments = {}

enviroments.staging = {
    "httpPort": 3000,
    "httpsPort": 3001,
    "envName": "staging",
    "hashingSecret": "Thisihashingseceret",
    "maxChecks" : 5,
    "twilio" : {
        "accountSid" : "ACb32d411ad7fe886aac54c665d25e5c5d",
        "authToken" : "9455e3eb3109edc12e3d8c92768f7a67",
        "fromPhone" : "+15005550006"
      },
      "templateGlobals" : {
        "appName" : "WebsiteUPcheck",
        "companyName" : "CaeasarDev, Inc.",
        "yearCreated" : "2018",
        "baseUrl" : "http://localhost:3000/"
      }
}

enviroments.production = {
    "httpPort": 5000,
    "httpsPort": 5001,
    "envName": "production",
    "hashingSecret": "ThisisAhAshingseceret",
    "maxChecks" : 5,
    "twilio" : {
        "accountSid" : "",
        "authToken" : "",
        "fromPhone" : ""
      },
    "templateGlobals" : {
    "appName" : "WebsiteUPcheck",
    "companyName" : "CaeasarDev, Inc.",
    "yearCreated" : "2018",
    "baseUrl" : "http://localhost:5000/"
  }
}

//check global variable
var currentEnviroment = typeof (process.env.NODE_ENV) == "string" ? process.env.NODE_ENV.toLowerCase() : "";

var enviromentToExport = typeof (enviroments[currentEnviroment]) == "object" ? enviroments[currentEnviroment] : enviroments.staging

module.exports = enviromentToExport