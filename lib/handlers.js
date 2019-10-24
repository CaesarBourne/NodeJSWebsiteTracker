/*
 * Request Handlers
 *
 */

// Dependencies
var _data = require('./data');
var helpers = require('./helpers');
var config = require("./config");
const url = require("url");
const performance = require("perf_hooks").performance
const util = require("util");
const debugLog = util.debuglog("performance");

// Define all the handlers
var handlers = {};
/** 
 * create 
 * all the html handlers */
//tjis is for the index page
handlers.index = (data, callback)=>{
  //allow this handler or only get requests since its a browser
  if(data.method == "get"){
    var specificPageData = {
      'head.title' : 'Website Uptime',
      'head.description' : 'This app helps you check the uptime of a website, set response times, and you get notified via sms if a website stae changes',
      'body.class' : 'index'
    };
    helpers.getTemplate("index", specificPageData, (err, pageSpecificHtmlString)=>{
      if(!err && pageSpecificHtmlString){
        helpers.addUniversalTemplates(pageSpecificHtmlString, specificPageData, (error, fullHtmlString)=>{
          if(!error && fullHtmlString){
             callback(200, fullHtmlString, "html")
          }else{
            callback(500, undefined, "html")
          }
        })
       
      }else{
        callback(500, undefined, "html");
      }
    })
  }else{
    callback(405)
  }
}
//get favicon at base directoy
handlers.favicon = (data, callback)=>{
  if(data.method == "get"){

    helpers.getStaticAsset("favicon.ico", (err, faviconAsset) => {
      if(!err && faviconAsset){
        callback(200, faviconAsset, "favicon")
      }else{
        callback(500)
      }
    })
  }else{
    callback(405)
  }
}

// create avcount
handlers.accountCreate = function(data, callback){

  //allow this handler or only get requests since its a browser
  if(data.method == "get"){
    var specificPageData = {
      'head.title' : 'Create an Account',
      'head.description' : 'Signup and start tracking your websites',
      'body.class' : 'accountCreate'
    };
    helpers.getTemplate("accountCreate", specificPageData, (err, pageSpecificHtmlString)=>{
      if(!err && pageSpecificHtmlString){
        helpers.addUniversalTemplates(pageSpecificHtmlString, specificPageData, (error, fullHtmlString)=>{
          if(!error && fullHtmlString){
             callback(200, fullHtmlString, "html")
          }else{
            callback(500, undefined, "html")
          }
        })
       
      }else{
        callback(500, undefined, "html");
      }
    })
  }else{
    callback(405)
  }
}

//test for errors
handlers.error = ()=>{
  var error = new Error("Oga ade na for testing purposes");
  throw error;
}
handlers.error
//public asssets
handlers.public = (data, callback)=>{
  if(data.method == "get"){
    //remove the "/public" from the name of the asset, this is not called from router
    var trimmedAssetName = data.trimmedPath.replace("public/", "").trim()
    if(trimmedAssetName.length > 0 ){
    helpers.getStaticAsset(trimmedAssetName, (err, asset)=>{
      if(!err && asset){
        var contentType = "plain"
        if(trimmedAssetName.indexOf(".css") > -1){
          contentType = "css"
        }
        if(trimmedAssetName.indexOf(".jpg") > -1){
          contentType = "jpg"
        }
        if(trimmedAssetName.indexOf(".png") > -1){
          contentType = "png"
        }
        if(trimmedAssetName.indexOf(".ico") > -1){
          contentType = "favicon"
        }
        callback(200, asset, contentType);

      }else{
        callback(500)
      }
    })}else{
      callback(404)
    }
  }else{
    callback(405)
  }
}

handlers.accountCreate = function(data, callback){

  //allow this handler or only get requests since its a browser
  if(data.method == "get"){
    var specificPageData = {
      'head.title' : 'Create an Account',
      'head.description' : 'Signup and start tracking your websites',
      'body.class' : 'accountCreate'
    };
    helpers.getTemplate("accountCreate", specificPageData, (err, pageSpecificHtmlString)=>{
      if(!err && pageSpecificHtmlString){
        helpers.addUniversalTemplates(pageSpecificHtmlString, specificPageData, (error, fullHtmlString)=>{
          if(!error && fullHtmlString){
             callback(200, fullHtmlString, "html")
          }else{
            callback(500, undefined, "html")
          }
        })
       
      }else{
        callback(500, undefined, "html");
      }
    })
  }else{
    callback(405)
  }
}

//create session or login
handlers.sessionCreate = function(data, callback){

  //allow this handler or only get requests since its a browser
  if(data.method == "get"){
    var specificPageData = {
      'head.title' : 'Login in',
      'head.description' : 'Login wih your phone number and password',
      'body.class' : 'sessionCreate'
    };
    helpers.getTemplate("sessionCreate", specificPageData, (err, pageSpecificHtmlString)=>{
      if(!err && pageSpecificHtmlString){
        helpers.addUniversalTemplates(pageSpecificHtmlString, specificPageData, (error, fullHtmlString)=>{
          if(!error && fullHtmlString){
             callback(200, fullHtmlString, "html")
          }else{
            callback(500, undefined, "html")
          }
        })
       
      }else{
        callback(500, undefined, "html");
      }
    })
  }else{
    callback(405)
  }
}

handlers.sessionDeleted =  function(data, callback){

  //allow this handler or only get requests since its a browser
  if(data.method == "get"){
    var specificPageData = {
      'head.title' : 'Logged Out',
      'head.description' : 'You have been logged out of your acc',
      'body.class' : 'sessionDeleted'
    };
    helpers.getTemplate("sessionDeleted", specificPageData, (err, pageSpecificHtmlString)=>{
      if(!err && pageSpecificHtmlString){
        helpers.addUniversalTemplates(pageSpecificHtmlString, specificPageData, (error, fullHtmlString)=>{
          if(!error && fullHtmlString){
             callback(200, fullHtmlString, "html")
          }else{
            callback(500, undefined, "html")
          }
        })
       
      }else{
        callback(500, undefined, "html");
      }
    })
  }else{
    callback(405)
  }
}

handlers.accountEdit =  function(data, callback){

  //allow this handler or only get requests since its a browser
  if(data.method == "get"){
    var specificPageData = {
      'head.title' : 'Account Settings',
      'body.class' : 'accountEdit'
    };
    helpers.getTemplate("accountEdit", specificPageData, (err, pageSpecificHtmlString)=>{
      if(!err && pageSpecificHtmlString){
        helpers.addUniversalTemplates(pageSpecificHtmlString, specificPageData, (error, fullHtmlString)=>{
          if(!error && fullHtmlString){
             callback(200, fullHtmlString, "html")
          }else{
            callback(500, undefined, "html")
          }
        })
       
      }else{
        callback(500, undefined, "html");
      }
    })
  }else{
    callback(405)
  }
}

handlers.checksCreate =  function(data, callback){

  //allow this handler or only get requests since its a browser
  if(data.method == "get"){
    var specificPageData = {
      'head.title' : 'Create new Check',
      'body.class' : 'checksCreate'
    };
    helpers.getTemplate("checksCreate", specificPageData, (err, pageSpecificHtmlString)=>{
      if(!err && pageSpecificHtmlString){
        helpers.addUniversalTemplates(pageSpecificHtmlString, specificPageData, (error, fullHtmlString)=>{
          if(!error && fullHtmlString){
             callback(200, fullHtmlString, "html")
          }else{
            callback(500, undefined, "html")
          }
        })
       
      }else{
        callback(500, undefined, "html");
      }
    })
  }else{
    callback(405)
  }
}

//edit account

//public asssets
handlers.public = (data, callback)=>{
  if(data.method == "get"){
    //remove the "/public" from the name of the asset, this is not called from router
    var trimmedAssetName = data.trimmedPath.replace("public/", "").trim()
    if(trimmedAssetName.length > 0 ){
    helpers.getStaticAsset(trimmedAssetName, (err, asset)=>{
      if(!err && asset){
        var contentType = "plain"
        if(trimmedAssetName.indexOf(".css") > -1){
          contentType = "css"
        }
        if(trimmedAssetName.indexOf(".jpg") > -1){
          contentType = "jpg"
        }
        if(trimmedAssetName.indexOf(".png") > -1){
          contentType = "png"
        }
        if(trimmedAssetName.indexOf(".ico") > -1){
          contentType = "favicon"
        }
        callback(200, asset, contentType);

      }else{
        callback(500)
      }
    })}else{
      callback(404)
    }
  }else{
    callback(405)
  }
}

/**
 * define all the json handlers
 */
// Ping
handlers.ping = function (data, callback) {
  callback(200);
};

// not founfd handler
handlers.notFound = function (data, callback) {
  callback(404);
};

// Users
handlers.users = function (data, callback) {
  var acceptableMethods = ['post', 'get', 'put', 'delete'];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for all the users methods
handlers._users = {};

// Users - post
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: none
handlers._users.post = function (data, callback) {
  // Check that all required fields are filled out
  var firstName = typeof (data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  var lastName = typeof (data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  var phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
  var password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  var tosAgreement = typeof (data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;

  if (firstName && lastName && phone && password && tosAgreement) {

    // Make sure the user doesnt already exist
    _data.read('users', phone, function (err, data) {
      if (err) {
        // Hash the password
        var hashedPassword = helpers.hash(password);

        // Create the user object
        if (hashedPassword) {
          var userObject = {
            'firstName': firstName,
            'lastName': lastName,
            'phone': phone,
            'hashedPassword': hashedPassword,
            'tosAgreement': true
          };

          // Store the user
          _data.create('users', phone, userObject, function (err) {
            if (!err) {
              callback(200);
            } else {
              console.log(err);
              callback(500, {
                'Error': 'Could not create the new user'
              });
            }
          });
        } else {
          callback(500, {
            'Error': 'Could not hash the user\'s password.'
          });
        }

      } else {
        // User alread exists
        callback(400, {
          'Error': 'A user with that phone number already exists'
        });
      }
    });

  } else {
    callback(400, {
      'Error': 'Missing required fields'.firstName
    });
  }

};

// Required data: phone
// Optional data: none
// @TODO Only let an authenticated user access their object. Dont let them access anyone elses.
handlers._users.get = function (data, callback) {
  // Check that phone number is valid
  var phone = typeof (data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
  if (phone) {
    //verify that te authorised user is logged in, verified user would have atoken in its header
    var token = typeof (data.headers.token) == "string" ? data.headers.token : false;
    handlers._tokens.verifyToken(token, phone, function (tokenisValid) {
      if (tokenisValid) {
        // Lookup the user
        _data.read('users', phone, function (err, data) {
          if (!err && data) {
            // Remove the hashed password from the user user object before returning it to the requester
            delete data.hashedPassword;
            callback(200, data);
          } else {
            callback(404);
          }
        });
      } else {
        callback(403, {
          "Error": "Token isn\'t for verified user"
        });
      }
    })


  } else {
    callback(400, {
      'Error': 'Missing required field'
    })
  }
};

// Required data: phone
// Optional data: firstName, lastName, password (at least one must be specified)
// @TODO Only let an authenticated user up their object. Dont let them access update elses.
handlers._users.put = function (data, callback) {
  // Check for required field
  var phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;

  // Check for optional fields
  var firstName = typeof (data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  var lastName = typeof (data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  var password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

  if (phone) {

    if (firstName || lastName || password) {

      //verify that te authorised user is logged in, verified user would have atoken in its header
      var token = typeof (data.headers.token) == "string" ? data.headers.token : false;
      handlers._tokens.verifyToken(token, phone, function (tokenisValid) {
        if (tokenisValid) {
          _data.read("users", phone, function (error, userdata) {
            if (!error && data) {
              if (firstName) {
                userdata.firstName = firstName;
              }
              if (lastName) {
                userdata.lastName = lastName;
              }
              if (password) {
                helpers
                userdata.hashedPassword = helpers.hash(password);
              }

              _data.update("users", phone, userdata, function (err) {
                if (!err) {
                  console.log(err)
                  callback(200)
                } else {
                  callback(500, {
                    "Error": "Cannot update now try later"
                  });
                }
              })

            } else {
              callback(400, {
                "Error": "User doesnt exist"
              })
            }

          })
        } else {
          callback(403, {
            "Error": "Token isn\'t for verified user"
          });
        }
      })


    } else {
      callback(400, {
        "Error": "Missing required field to update"
      })
    }

  } else {
    callback(400, {
      'Error': 'Missing required field'
    })
  }

};

handlers._users.delete = function (data, callback) {
  // Check that phone number is valid
  var phone = typeof (data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
  if (phone) {
    // Lookup the user
    //verify that te authorised user is logged in, verified user would have atoken in its header
    var token = typeof (data.headers.token) == "string" ? data.headers.token : false;
    handlers._tokens.verifyToken(token, phone, function (tokenisValid) {
      if (tokenisValid) {
        _data.read('users', phone, function (err, data) {
          if (!err && data) {

            _data.delete("users", phone, function (err) {
              if (!err) {
                var userChecks = typeof(data.checks) =="object" &&  data.checks instanceof Array ? data.checks :[];
                var checksToDelete = userChecks.length;
                if(checksToDelete > 0){
                  // for(i=0; 1< checksToDelete; 1++){
                    
                  // }
                }else{
                  callback(200)
                }
              } else {
                callback(500, {
                  "Error": "Couldn\'t delete file now pls try later"
                })
              }
            })
          } else {
            callback(404);
          }
        });
      } else {
        callback(403, {
          "Error": "Token isn\'t for verified user"
        });
      }
    })

  } else {
    callback(400, {
      'Error': 'Missing required field for delete'
    })
  }

}

handlers.tokens = function (data, callback) {

  var acceptableMethods = ["post", "get", "put", "delete"];

  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._tokens[data.method](data, callback)
  } else {
    callback(405)
  }
}

handlers._tokens = {};

handlers._tokens.post = function (data, callback) {
  
  //requred: phone and password
  performance.mark("varinit");
  var phone = typeof (data.payload.phone) == "string" && data.payload.phone.trim().length == 10 ? data.payload.phone : false
  var password = typeof (data.payload.password) == "string" && data.payload.password.trim().length > 0 ? data.payload.password : false
  // var phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 11 ? data.payload.phone.trim() : false;
  // var password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  performance.mark("varinitend");
  if (phone && password) {
    performance.mark("readusers");
    _data.read("users", phone, function (err, userData) {
      performance.mark("readusersend");
      if (!err && userData) {
        var hashedPassword = helpers.hash(password);
       
        if (hashedPassword == userData.hashedPassword) {

          var tokenID = helpers.createRandomString(20);
          var expires = Date.now() + 1000 * 60 * 60;
          var tokenData = {
            "phone": phone,
            "tokenID": tokenID,
            "expires": expires
          }
          
          _data.create("tokens", tokenID, tokenData, function (error) {
            if (!error) {
              callback(200, tokenData)
            } else {
              callback(500, {
                "Error": "couldnt save token now try later"
              })
            }
          })
        } else {
          callback(400, {
            "Error": "passed password is incorrect"
          })
        }
      } else {
        callback(400, {
          "Error": "specified user dosent exist"
        })
      }
    })

  } else {
    callback(400, {
      "Error": "Missing required field for tokens"
    })
  }
  performance.measure("Variable Declaraetion time", "varinit", "varinitend")
  const performanceListArray  = performance.getEntriesByType("measure")
  performanceListArray.forEach((perf)=>{
    debugLog(`\x1b[32m${perf.name} ${perf.duration}\x1b[0m`)
  })
}

handlers._tokens.get = function (data, callback) {
  // Check that phone number is valid
  var id = typeof (data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
  if (id) {
    // Lookup the user
    _data.read('tokens', id, function (err, data) {
      if (!err && data) {
        callback(200, data);
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, {
      'Error': 'Missing required field'
    })
  }

}

handlers._tokens.put = function (data, callback) {
  var id = typeof (data.payload.id) == "string" && data.payload.id.trim().length == 20 ? data.payload.id : false
  var extend = typeof (data.payload.extend) == "boolean" && data.payload.extend == true ? data.payload.extend : false

  if (id && extend) {
    _data.read("tokens", id, function (err, tokenData) {
      if (!err && tokenData) {
        if (tokenData.expires > Date.now()) {
          tokenData.expires = Date.now() + 1000 * 60 * 60;

          _data.update("tokens", id, tokenData, function (err) {
            if (!err) {
              callback(200)
            } else {
              callback(500, {
                "Error": "Could not extend token expiry try later"
              })
            }
          })
        } else {
          callback(400, {
            "Error": "Token has expired"
          })
        }
      } else {
        callback(400, {
          "Error": "User token is invalid and dosent exist"
        })
      }
    })
  } else {
    callback(400, {
      "Error": "Missing required fields"
    })
  }

}

handlers._tokens.delete = function (data, callback) {
  // Check that phone number is valid
  var id = typeof (data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
  if (id) {
    // Lookup the user
    _data.read('tokens', id, function (err, data) {
      if (!err && data) {

        _data.delete("tokens", id, function (err) {
          if (!err) {
            callback(200)
          } else {
            callback(500, {
              "Error": "Couldn\'t delete the token file now try later"
            })
          }
        })
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, {
      'Error': 'Missing required field for delete'
    })
  }
}

handlers._tokens.verifyToken = function (id, phone, callback) {

  _data.read("tokens", id, function (err, tokendata) {
    if (!err && tokendata) {
      if (tokendata.phone == phone && tokendata.expires > Date.now()) {
        callback(true)
      } else {
        callback(false)
      }
    } else {
      callback(false)
    }

  })

}

handlers.checks = function (data, callback) {
  var acceptableMethods = ["post", "get", "put", "delete"]
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._checks[data.method](data, callback);
  } else {
    callback(405);
  }
}

handlers._checks = {};

handlers._checks.post = function (data, callback) {
  var protocol = typeof (data.payload.protocol) == "string" && ["http", "https"].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
  var method = typeof (data.payload.method) == "string" && ["post", "get", "put", "delete"].indexOf(data.payload.method) > -1 ? data.payload.method : false;
  var timeoutseconds = typeof (data.payload.timeoutseconds) == "number" && data.payload.timeoutseconds % 1 === 0 && data.payload.timeoutseconds >= 1 && data.payload.timeoutseconds <= 5 ? data.payload.timeoutseconds : false;
  var url = typeof (data.payload.url) == "string" && data.payload.url.length > 0 ? data.payload.url : false;
  var succesCodes = typeof (data.payload.succesCodes) == "object" && data.payload.succesCodes instanceof Array && data.payload.succesCodes.length > 0 ? data.payload.succesCodes : false;

  var token = typeof (data.headers.token) == "string" && data.headers.token.length == 20 ? data.headers.token : false;
  if (protocol, method, timeoutseconds, url, succesCodes, token) {


    _data.read("tokens", token, function (err, tokenData) {
      if (!err && tokenData) {
       
        var phone = tokenData.phone;

        _data.read("users", phone, function (err, userData) {
          if (!err && userData) {

            var userChecks = typeof (userData.checks) == "object" && userData.checks instanceof Array ? userData.checks : [];

            if (userChecks.length < config.maxChecks) {
              //create check object
              var checkId = helpers.createRandomString(20)

              var checkObject = {
                "id": checkId,
                "userPhone": phone,
                "protocol": protocol,
                "url": url,
                "succesCodes": succesCodes,
                "method": method,
                "timeoutseconds": timeoutseconds
              }
              //SAVE THE CHECK OBJECT TO checks directory
              _data.create("checks", checkId, checkObject, function (err) {
                if (!err) {
                  //overwrite the previous checks arrays if it exists else add an empty check array to push checkid later
                  userData.checks = userChecks;
                  userData.checks.push(checkId)
                  //update the userid to have a referncd of the check object
                  _data.update("users", phone, userData, function (err) {
                    if (!err) {
                      callback(200, checkObject)
                    } else {
                      callback(500, {
                        "Error": "Cannot save check try later"
                      })
                    }
                  })
                } else {
                  callback(500, {
                    "Error": "Cannot create check now try later"
                  })
                }
              })
            } else {
              callback(400, {
                "Error": "User has the maximum number of checks (" + config.maxChecks + ")"
              })
            }
          } else {
            callback(403)
          }
        })
      } else {
        callback(403, {
          "Error": "Notauthorised token"
        })
      }
    })
  } else {
    callback(400, {
      "Error": "Misssing required fields post "+ headers.data.token +" token there"
    })
  }
}

handlers._checks.get = function (data, callback) {
  var id = typeof(data.queryStringObject.id) == "string" && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id : false;
  
  if(id){
    _data.read("checks", id, function(err, checkData){
      if(!err && checkData){
        var token = typeof(data.headers.token) == "string" && data.headers.token.length == 20? data.headers.token : false;
      handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenisValid){
        if(tokenisValid){
          callback(200, checkData);
        }else{
          callback(403, {"Error" : "Miising required toke in head or the token is invalid"})
        }
      })
      }else{
        callback(404)
      }
    })
  }else{
    callback(400, {"Error" : "Missing required id"})
  }
}

handlers._checks.put = function(data, callback){
  var id = typeof(data.payload.id) == "string" && data.payload.id.length == 20 ? data.payload.id : false;

  var protocol = typeof (data.payload.protocol) == "string" && ["http", "https"].indexOf(data.payload.protocol) > -1 ? data.payload.protocol : false;
            var method = typeof (data.payload.method) == "string" && ["post", "get", "put", "delete"].indexOf(data.payload.method) > -1 ? data.payload.method : false;
            var timeoutseconds = typeof (data.payload.timeoutseconds) == "number" && data.payload.timeoutseconds % 1 === 0 && data.payload.timeoutseconds >= 1 && data.payload.timeoutseconds <= 5 ? data.payload.timeoutseconds : false;
            var url = typeof (data.payload.url) == "string" && data.payload.url.length > 0 ? data.payload.url : false;
            var succesCodes = typeof (data.payload.succesCodes) == "object" && data.payload.succesCodes instanceof Array && data.payload.succesCodes.length > 0 ? data.payload.succesCodes : false;

  if(id){
    if(protocol  || method || timeoutseconds || url || succesCodes){
      var token = typeof(data.headers.token) == "string"? data.headers.token: false
    _data.read("checks", id, function(error, checkData){
      if(!error && checkData){

        handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenisValid){
          if(tokenisValid){
                        
           
              if(protocol){
                checkData.protocol =protocol
              }
              if(method){
                checkData.method = method
              }
              if(timeoutseconds){
                checkData.timeoutseconds = timeoutseconds
              }
              if(url){
                checkData.url = url;
              }
              if(succesCodes){
                checkData.succesCodes = succesCodes;
              }
           _data.update("checks", id, checkData, function(err){
             if(!err){
               callback(200)
             }else{
               callback(500, {"Error" : "Couldnt updat checkdata try later"})
             }
           })
          }else{
            callback(403, { "Error" : "Miising required token in header or the token is invalid"})
          }
        })
      }else{
        callback(400, {"Error" : "Check id does not exist"})
      }
    })
  }else{
    callback(400, { "Error" : "Missing required field"})
  }
  }else{
    callback(400, {"Error" : "Missin required id"})
  }
}

handlers._checks.delete = function (data, callback) {
  // Check that phone number is valid
  var id = typeof (data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
  if (id) {
    // Lookup the user
    _data.read('checks', id, function (err, checkData) {
      if (!err && checkData) {
        var token  = typeof(data.headers.token) == "string"? data.headers.token :false;
        //always verify token of user
        handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenisValid){
          if(tokenisValid){
            _data.delete("checks", id, function (err) {
              if (!err) {
                _data.read("users", checkData.userPhone, function(error, userData){
                  if(!error && userData){
                    var checks = typeof(userData.checks) == "object" && userData.checks instanceof Array ? userData.checks : [];
                    var errors = 0;
                    var checkPosition = checks.indexOf(id); 
                    if(checkPosition> -1){ 
                      checks.splice(checkPosition, 1);
                      // for(i= 0; i<checks.length; i++){
                        // if(checks[i] == id){
                        //   delete checks[i]
                        // }
                      // }
                      _data.update("users", checkData.userPhone, userData, function(errors){
                        if(!errors){
                          callback(200)
                        }else{
                          callback(500, {"Error" : "Could not update the specified user"})
                        }
                      })
                    }else{
                      callback(500, {"Error" : "Could not find the check on the user object and cant be removed"})
                    }
                   
                  }else{
                    
                    callback(500, {"Error" : "could not find the user who created the check"})
                  }
                }) 
              } else {
                callback(500, {
                  "Error": "Couldn\'t delete the token file now try later"
                })
              }
            })
          }else{
            callback(403, {"Error" : "Mising required token in header, or token is invalid"})
          }
        })
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, {
      'Error': 'Missing required field for delete'
    })
  }
}

// Export the handlers
module.exports = handlers;