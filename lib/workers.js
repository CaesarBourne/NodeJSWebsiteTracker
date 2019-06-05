/*
*workertasks
*/

var path = require("path")
var fs= require("fs")
var _data= require("./data")
var https= require("https")
var http= require("http")
var helpers= require("./helpers")
var url= require("url")

var workers = {};

workers.init = function(){
    workers.gatherAllChecks()

    workers.loop()
}
//look at all checks and send data to a validator
workers.gatherAllChecks = function(){
_data.list("checks", function(err, checks){
    if(!err && checks && checks.length > 0){
        checks.forEach(check => {
            _data.read("checks", check, function(err, originalCheckData){
                if(!err && originalCheckData){
                    workers.validateCheckData(originalCheckData);
                }else{
                    console.log("Error, reading one of the checks")
                }
            })
        });
    }else{
        console.log("Erro could not find any checks to process")
    }
})
}
workers.loop = function(){
    setTimeout(() => {
        workers.gatherAllChecks()
    }, 1000 *60);
}

workers.validateCheckData = function(originalCheckData){
    originalCheckData = typeof(orientation) == "object" && originalCheckData !== null ? originalCheckData : originalCheckData;
    originalCheckData.userPhone = typeof(originalCheckData.userPhone) == "string" &&  originalCheckData.userPhone.trim().length == 10 ? originalCheckData.userPhone.trim() : false
    originalCheckData.id = typeof(originalCheckData.id) == "string" &&  originalCheckData.id.trim().length == 20 ? originalCheckData.id.trim() : false
    originalCheckData.protocol = typeof (originalCheckData.protocol) == "string" && ["http", "https"].indexOf(originalCheckData.protocol) > -1 ? originalCheckData.protocol : false;
    originalCheckData.method = typeof (originalCheckData.method) == "string" && ["post", "get", "put", "delete"].indexOf(originalCheckData.method) > -1 ? originalCheckData.method : false;
    originalCheckData.timeoutseconds = typeof (originalCheckData.timeoutseconds) == "number" && originalCheckData.timeoutseconds % 1 === 0 && originalCheckData.timeoutseconds >= 1 && originalCheckData.timeoutseconds <= 5 ? data.payload.timeoutseconds : false;
    originalCheckData.url = typeof (originalCheckData.url) == "string" && originalCheckData.url.length > 0 ? originalCheckData.url : false;
    originalCheckData.succesCodes = typeof (originalCheckData.succesCodes) == "object" && originalCheckData.succesCodes instanceof Array && originalCheckData.succesCodes.length > 0 ? originalCheckData.succesCodes : false;

    originalCheckData.state = typeof (originalCheckData.state) == "string" && ["up", "down"].indexOf(originalCheckData.state) > -1 ? originalCheckData.state : down;
    originalCheckData.lastChecked = typeof (originalCheckData.lastChecked) == "string" && originalCheckData.lastChecked > 1 ? originalCheckData.lastChecked : false;

    if(originalCheckData.userPhone &&
        originalCheckData.id &&
        originalCheckData.protocol &&
        originalCheckData.method &&
        originalCheckData.timeoutseconds &&
        originalCheckData.url &&
        originalCheckData.succesCodes){
            workers.performCheck(originalCheckData)
        }else{
            console.log("Error one of the checks is not properly formatted")
        }
}

workers.performCheck = function(originalCheckData){

    var checkOutcome = {
        "error" : false,
        "responseCode" : false
    }
    
    var outcomeSent = false;
    
    var parsedUrl = url.parse(originalCheckData.protocol+ "://"+ originalCheckData.url, true )
    var hostname = parsedUrl.hostname;
    var path = parsedUrl.path;

    var requestDetails= {
        "protocol": originalCheckData.protocol,
        "hostname": hostname,
        "path" : path,
        "method" : originalCheckData.method,
        "timeout" : originalCheckData.timeoutseconds * 1000 //cos the user passed the second rom the request
    }

    var protocolType =  originalCheckData.protocol == "http" ?originalCheckData.protocol : "https";
    var req = protocolType.request(requestDetails, function(res){

        var status = typeof(res.statusCode) == "number" && originalCheckData.succesCodes.indexOf(res.statusCode) > -1;
        if(!outcomeSent){// thaat is if outcome has not been sent
            checkOutcome.responseCode = status
            outcomeSent = true;
            workers.processCheckOutcome(originalCheckData, checkOutcome)
        }
    });

    req.on("error", function(e){
        checkOutcome.error = {
            "error" : true,
            "value" : e
        }

        if(!outcomeSent){
            outcomeSent = true;
            workers.processCheckOutcome(originalCheckData, checkOutcome)
        }
    })
    
    req.on("timeout", function(e){
        checkOutcome.error = {
            "error" : true,
            "value" : timeout
        }

        if(!outcomeSent){
          
            outcomeSent = true;
            workers.processCheckOutcome(originalCheckData, checkOutcome)
        }
    })

    req.end();
};




module.exports = workers