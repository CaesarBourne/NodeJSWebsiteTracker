var path = require("path");
var fs = require("fs");
var zlib = require("zlib");


var lib = {};

lib.baseDir = path.join(__dirname,"/../.logs/")

lib.appendLog = (filename, striData, callback) => {
    fs.open(lib.baseDir+filename+".log","a",function(error, fileDescriptor){
        if(!error && fileDescriptor){
            fs.appendFile(fileDescriptor,striData+"\n", function(err){
                if(!err){
                    fs.close(fileDescriptor, function(er){
                        if(!er){
                            callback(false)
                        }else{
                            callback("Error closing file")
                        }
                    })
                }else{
                    callback("error appending file: "+ err)
                }
            })
        }else{
            callback("Error opening file"+ error);
        }
    })
}

lib.list =(addCompressedLogs, callback)=>{
    fs.readdir(lib.baseDir, (err, logDataArray)=>{
        if(!err && logDataArray &&logDataArray > 0){
            var trimmedLogNames = [];
            logDataArray.forEach((log)=>{
                //chec if the files are log filees bfore adding
                if(log.indexOf(".log") >-1){
                    trimmedLogNames.push(log.replace(".log", ""))
                }
                
                if(addCompressedLogs && log.indexOf("gz.b64")  > -1 ){
                    trimmedLogNames.push(log.replace(".gz.b64", ""));
                }
                callback(false, trimmedLogNames);
            })
        }else{
            callback("Error reading logs, they might not exist and directory might be empty: "+ err, logDataArray)
        }
    })
}

lib.compress = (logID, newfileID, callback)=>{
    var logFile = logID + ".log";
    var compressedFile = newfileID + ".gz.b64";
    fs.readFile(lib.baseDir+logFile,"utf8", (error, stringLog)=>{
        if(!error && stringLog){
            zlib.gzip(stringLog, (err, buffer)=>{
                if(!err && buffer){
                    
                    fs.open(lib.baseDir+compressedFile,"wx", (er, fileDescriptor)=>{
                        if(!er && fileDescriptor){
                            fs.writeFile(fileDescriptor, buffer.toString("base64"), (e)=>{
                                if(!e){
                                    fs.close(fileDescriptor, (ero)=>{
                                        if(!ero){
                                            callback(false);
                                        }else{
                                            callback("Error: error clossing zipped log file"+ero);
                                        }
                                    })
                                }else{
                                    callback("Error: error writing to file"+e);
                                }
                            })
                        }else{
                            callback("Error : error opening file"+ er)
                        }
                    })
                }else{
                    callback("Error: error zipping the specified file"+ err);
                }
            })
        }else{
            callback( error)
        }
    })
}

lib.truncate = ( logID, callback)=>{
    fs.truncate(lib.baseDir+logID+".log", 0, (err)=>{
        if(!err){
            callback(false)
        }else{
            callback("Error truncating file given as: "+ err)
        }
    })
}

lib.decompress = (fileName, callback)=>{
    fs.readFile(lib.baseDir+fileName+".gz.b64",(err, strngData)=>{
        if(!err &&strngData){
           //create buffer from string which is inbase 64
            var inputBuffer = Buffer.from(strngData, "base64");
            zlib.unzip(inputBuffer, (error, outpurBufFer)=>{
                if(!error && outputBufer){
                    var unzippedStringFile = outpurBufFer.toString();
                    callback(false, unzippedStringFile)
                }else{
                    callback("couldnt unzip buffer: "+ error )
                }
            })
        }else{
            callback("Error: couodnt read the compressed file " + err)
        }
    })
    
    
}

module.exports = lib;