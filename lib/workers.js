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
var _logs  = require("./logs")
var util = require("util");
var debug = util.debuglog("workers");

var workers = {};

workers.init = function(){
    
    console.log("\x1b[33m%s\x1b[0m", "Background workers have started");
    workers.gatherAllChecks()

    workers.loopChecksGather()

    workers.logRotation();

    workers.logRotationLoop();
}

workers.logRotationLoop = ()=> {
    setInterval( ()=>{
        workers.logRotation()
    }, 1000*60*60*24)
}
workers.logRotation = ()=>{
    _logs.list(false,function(err, logArray){
        if(!err && logArray, logArray.length > 0){
          
            logArray.forEach((logName)=>{

                var logID =logName.replace(".log", "");
                var compressedName = logID +"-"+Date.now();

                _logs.compress(logID, compressedName, function(error){
                    if(!error){

                        _logs.truncate(logID, (ero)=>{
                            if(!ero){
                                debug("Success : success truncating log file");
                            }else{
                                debug("Error : couldnt truncate file", ero)
                            }
                        })
                    }else{
                        debug("Error: error compresing a log file", error)
                    }
                })
            })
        }else{
            debug("error listing logs: ",err)
        }
    })
}

workers.loopChecksGather = function(){
    setInterval(()=> {
        workers.gatherAllChecks()
    }, 1000 *60);
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
                    debug("Error, reading one of the checks")
                }
            })
        });
    }else{
        debug("Error could not find any checks to process")
    }
})
}


workers.validateCheckData = function(originalCheckData){
    originalCheckData = typeof(originalCheckData) == "object" && originalCheckData !== null ? originalCheckData : originalCheckData;
    originalCheckData.userPhone = typeof(originalCheckData.userPhone) == "string" &&  originalCheckData.userPhone.trim().length == 10 ? originalCheckData.userPhone.trim() : false
    originalCheckData.id = typeof(originalCheckData.id) == "string" &&  originalCheckData.id.trim().length == 20 ? originalCheckData.id.trim() : false
    originalCheckData.protocol = typeof (originalCheckData.protocol) == "string" && ["http", "https"].indexOf(originalCheckData.protocol) > -1 ? originalCheckData.protocol : false;
    originalCheckData.method = typeof (originalCheckData.method) == "string" && ["post", "get", "put", "delete"].indexOf(originalCheckData.method) > -1 ? originalCheckData.method : false;
    originalCheckData.timeoutseconds = typeof (originalCheckData.timeoutseconds) == "number" && originalCheckData.timeoutseconds % 1 === 0 && originalCheckData.timeoutseconds >= 1 && originalCheckData.timeoutseconds <= 5 ? originalCheckData.timeoutseconds : false;
    originalCheckData.url = typeof (originalCheckData.url) == "string" && originalCheckData.url.length > 0 ? originalCheckData.url : false;
    originalCheckData.succesCodes = typeof (originalCheckData.succesCodes) == "object" && originalCheckData.succesCodes instanceof Array && originalCheckData.succesCodes.length > 0 ? originalCheckData.succesCodes : false;

    originalCheckData.state = typeof (originalCheckData.state) == "string" && ["up", "down"].indexOf(originalCheckData.state) > -1 ? originalCheckData.state : "down";
    originalCheckData.lastChecked = typeof (originalCheckData.lastChecked) == "number" && originalCheckData.lastChecked > 0 ? originalCheckData.lastChecked : false;
    
    if(originalCheckData.userPhone &&
        originalCheckData.id &&
        originalCheckData.protocol &&
        originalCheckData.method &&
        originalCheckData.timeoutseconds &&
        originalCheckData.url &&
        originalCheckData.succesCodes){
            workers.performCheck(originalCheckData)
        }else{
            debug("Error one of the checks is not properly formatted")
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
        "protocol": originalCheckData.protocol+":",
        "hostname": hostname,
        "path" : path,
        "method" : originalCheckData.method,
        "timeout" : originalCheckData.timeoutseconds * 1000 //cos the user passed the second rom the request
    }

    //use protocol without quotes
    var protocolType =  originalCheckData.protocol == "http" ? http : https;
    var req = protocolType.request(requestDetails, function(res){

        var status = res.statusCode;
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

//this function is to test if a website is up or down and set it to the check and to determine if an alert would be
//sent to the user, new fields of "state " and "lastchecked"
workers.processCheckOutcome = function(originalCheckData, checkOutcome){
   
    // test if check state would be set to up or down, and process if theres no error nd check is succesful with response codes
    var state = !checkOutcome.error   && checkOutcome.responseCode && originalCheckData.succesCodes.indexOf(checkOutcome.responseCode) > -1 ? "up" : "down";
    
    //i wanna test if the user would be alerted by checking if a check as being made which means a check was made
    // before and not the default "false" value as lastchecked field was created when a check was made at line 55
    // and state changes from one value to another by comparing check data state with above checkoutcome state
    var alertWarranted = originalCheckData.lastChecked && originalCheckData.state !== state ? true : false;
    var timeOfCheck = Date.now();
    workers.log(originalCheckData, checkOutcome, state, alertWarranted, timeOfCheck);

    //update the check data
    var newCheckData = originalCheckData;
    newCheckData.state = state;
    newCheckData.lastChecked = Date.now();
    _data.update("checks", newCheckData.id, newCheckData, function(error){
        if(!error){
            if(alertWarranted){
                workers.alertUsersToStatusChange(newCheckData)
            }else{
                debug("Check outcome is the same and has not changed, no alert needed")
            }
        }else{
            debug("Error couldnt save new check data")
        }
    })

}

workers.alertUsersToStatusChange = function(newCheckData){
    var message = "Alert your check for the website for"+ newCheckData.method.toUpperCase() + newCheckData.protocol+ "://" + newCheckData.url +"is"+ newCheckData.state
    helpers.sendTwilioSms(newCheckData.userPhone,message, function(err){
        if(!err){
            debug("Success: user ws sent a message for a statius change in their check")
        }else{
            debug("Error: could not send sms to user to alert them on the status change")
        }
    } )
}
workers.log = (originalCheckData, checkOutcome, state, alertWarranted, timeOfCheck) => {
    //create the log Data
    var logData = {
        "check" : originalCheckData,
        "outcome": checkOutcome,
        "state": state,
        "alert" : alertWarranted,
        "time": timeOfCheck
    }
    
    var logString = JSON.stringify(logData);

    var fileName = originalCheckData.id;

    //append the log sting to a log file
    -_logs.appendLog(fileName, logString, function(error){
        if(!error){
            debug("Success: logging to file succeded")
       }else{
        debug("Error: logging to file failed", error)
        }
    })
}

module.exports = workers