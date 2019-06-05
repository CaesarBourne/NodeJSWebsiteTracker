/*
 *for storing and editing data in the .data foldr
 */

var fs = require("fs");
var path = require("path");
var helpers = require("./helpers");

lib = {};

lib.baseDir = path.join(__dirname, "/../.data/")
lib.create = function (dir, file, data, callback) {

    fs.open(lib.baseDir + dir + "/" + file + ".json", "wx", function (error, fileDescriptor) {
        if (!error && fileDescriptor) {

            var stringData = JSON.stringify(data);

            fs.writeFile(fileDescriptor, stringData, function (error) {
                if (!error) {

                    fs.close(fileDescriptor, function (err) {
                        if (!err) {
                            callback(false)
                        } else {
                            callback("error closing new file")
                        }
                    })
                } else {
                    callback("eror writing to file")
                }
            })
        } else {
            console("Ogoade you file ost likely exxists")
        }
    })


}

lib.read = function (dir, file, callback) {

    fs.readFile(lib.baseDir + dir + "/" + file + ".json", "utf8", function (error, data) {
        var parsedData = helpers.parseJsonToObject(data);
        callback(error, parsedData);
    })
}

lib.list = function(dir,  callback){
    fs.readdir(lib.baseDir+dir+"/", function(err, data){
        if(!err && data && data.length > 0){
            var trimmedFilenames = [];
            data.forEach(function(fileName){
                trimmedFilenames.push(fileName.replace(".jsom" , ""));
            })
            callback(false,trimmedFilenames)
        }else{
            callback(err, data)
        }
    })
}

lib.update = function (dir, file, data, callback) {

    fs.open(lib.baseDir + dir + "/" + file + ".json", "r+", function (error, fileDescriptor) {
        if (!error && fileDescriptor) {
            const stringData = JSON.stringify(data)
            fs.truncate(fileDescriptor, function (err) {
                if (!err) {

                    fs.writeFile(fileDescriptor, stringData, function (err) {
                        if (!error) {
                            fs.close(fileDescriptor, function (err) {
                                if (!err) {
                                    callback(false)
                                } else {
                                    callback("error closing file")
                                }
                            })
                        } else {
                            callback("error writing to rexisting file")
                        }
                    })
                } else {
                    callback("error truncating file")
                }
            })
        } else {
            callback("could not open file, it may not exist")
        }
    })
}

lib.delete = function (dir, file, callback) {
    fs.unlink(lib.baseDir + dir + "/" + file + ".json", function (err) {
        if (!err) {
            callback(false)
        } else {
            callback("error deleting file, it may not exist")
        }
    })
}
module.exports = lib;