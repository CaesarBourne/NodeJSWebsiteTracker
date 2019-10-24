var crypto = require("crypto");
var config = require("./config")
var querystring = require("querystring");
var https = require("https");
var fs = require("fs");
var path = require("path");

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
//this ha sto be put in a try catch TODO check why
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

helpers.getTemplate = (templateName,dataObject, callback) => {
    templateName = typeof(templateName) == "string" && templateName.length > 0 ? templateName : false
    dataObject = typeof(dataObject) == "object" && dataObject != null ? dataObject : {};
    if(templateName){
        var templateDirectory = path.join(__dirname, "/../templates/");
        fs.readFile(templateDirectory+templateName+".html" , "utf8", (err, htmlString)=>{
            if(!err && htmlString && htmlString.length > 0){
                //replace the html string
              var replacedHtmlString = helpers.interpolate(htmlString, dataObject)
              callback(false, replacedHtmlString)
                
            }else{
                callback("no template found");
            }
        })
    }else{
        callback( "template name is invalid ")
    }
    
}

//this is used to replace the data with the coreesponding key in the object, by searching the specified
//page object and the glbal object for all pages
helpers.interpolate = (htmlString, dataobject)=>{
    htmlString = typeof(htmlString) == "string" && htmlString.length > 0 ?htmlString: "";
    data = typeof(dataobject) == "object" && dataobject.length !== null ? dataobject : {};
    //this sis to add the values of the global variables as a key in the data object
    for(var key in config.templateGlobals){
        if(config.templateGlobals.hasOwnProperty(key)){
            data["global." + key] = config.templateGlobals[key];
        }
    }
    //find the keyname of data in the returned html string and reoplace
    for(var keyName in dataobject){
        if(dataobject.hasOwnProperty(keyName) && typeof(dataobject[keyName]) == "string"){
            var find ="{"+keyName+"}";
            var replacement = dataobject[keyName];
            htmlString = htmlString.replace(find,replacement);
        }
    }
    return htmlString
}
//add the header and footer above and below the html string espectively
helpers.addUniversalTemplates = (pageSpecificHtmlString,dataObject, callback)=>{
    //read the string html in header
    helpers.getTemplate("_header", dataObject, (error, replacedHtmlHeader)=>{
        if(!error && replacedHtmlHeader){
            helpers.getTemplate("_footer", dataObject,(err, replacedHtmlFooter)=>{
                if(!err && replacedHtmlFooter){
                    var concatenatedHtml = replacedHtmlHeader + pageSpecificHtmlString + replacedHtmlFooter;
                    callback(false, concatenatedHtml);
                }else{
                    callback("Error reading html footer");
                }          
            })
        }else{
            callback("Error reading html header");
        }
    });
}

helpers.getStaticAsset = (assetName, callback)=>{
    assetName = typeof(assetName) == "string" && assetName.length > 0? assetName: false
    if(assetName){
    var publicDirectory= path.join(__dirname, "/../public/")
    fs.readFile(publicDirectory+assetName, (err, asset)=>{
        if(!err && asset){
            callback(false, asset)
        }else{
            callback("not found")
        }
    })}else{
        callback("Invalid name")
    }
}

module.exports = helpers;