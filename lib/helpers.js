var crypto = require("crypto");
var config = require("./config")
var querystring = require("querystring");
var https = require("https");

var helpers = {};

helpers.hash = function (stri) {
    if (typeof (stri) == "string" && stri.length > 0) {
        var hashedPassword = crypto.createHmac("sha256", config.hashingSecret).update(stri).digest("hex");
        return hashedPassword;
    } else {
        return false;
    }

}

helpers.parseJsonToObject = function (str) {

    try {
        var parsedObject = JSON.parse(str)
        return parsedObject;
    } catch (e) {
        return {};
    }
}

helpers.createRandomString = function (striLength) {
    striLength = typeof (striLength) == "number" && striLength > 0 ? striLength : false
    if (striLength) {
        var possibleVaues = "abcdefghijklmnopqrstuvwxyz1234567890";
        var stri = "";
        for (i = 1; i <= striLength; i++) {
            var randomVal = possibleVaues.charAt(Math.floor(Math.random() * possibleVaues.length))
            stri += randomVal;
        }
        return stri;
    } else {
        return false
    }

}
helpers.sendTwilioSms = function(phone, msg, callback){
    phone = typeof(phone) == "string" && phone.trim().length == 10 ? phone : false;
    msg =  typeof(msg) == "string" && msg.trim().length > 0 && msg.trim.length < 1600 ? phone : false;

    if(phone && msg){
        var payload = {
            "From" : config.twilio.fromPhone,
            "To" : "+234" + phone,
            "Body" : msg
        }
        var stringPayload = querystring.stringify(payload)

        var requestDetails = {
            "protocol" : "https:",
            "hostname" : "api.twilio.com",
            "method" : "POST",
            "path" : "/2010-04-01/Accounts/"+config.twilio.accountSid+"/Messages.json",
            "auth" : config.twilio.accountSid +  ":" +config.twilio.authToken,
            "headers" : {
                "Content-Type" : "application/x-www-form-urlencoded",
                "Content-Length" : Buffer.byteLength(stringPayload)
            }
        }
        var req = https.request(requestDetails, function(res){
            var status = res.statusCode;
            if(status == 200 ||  status == 201){
                callback(false)
            }else{
                callback("Status code returned was " + status)
            }

           
        })
        req.on("error", function(err){
            callback(err);
        })
        req.write(stringPayload)
        req.end()
    }else{
        callback("message and phone number inputs are invalid or empty");
    }
};


module.exports = helpers;