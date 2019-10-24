const readline  = require("readline");
const Events = require("events");
const cliemmiter = new Events();
const os = require("os");
const v8 = require("v8");
const _data = require("./data")

var cli = {};

cli.init= ()=>{
    console.log("\x1b[34m%s\x1b[0m", "bosss your cli is now running " )

    //read one line at a time
    var inputIterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: "%"
    })
    inputIterface.prompt();

    inputIterface.on("line", inputstring=>{
        cli.processInput(inputstring);
        inputIterface.prompt();
    })

    

    inputIterface.on("close", ()=>{
        process.exit(0);
    })

}


cli.processInput = (input = false)=>{
     var allowedInput = ["man", "help", "exit", "stats", "list users", "more user info", "list checks",
        "more check info", "list logs", "more log info"]

     let inputIsValid = false; 
             if(input) {  
                 allowedInput.forEach((arrmem)=>{
              if(input.indexOf(arrmem) > -1 ){
              inputIsValid =true;
              cliemmiter.emit(arrmem, input)
             return true
         }
     })
    }

     if(!inputIsValid){
         console.log("Bros your input is invalid, try again");
     }
}
//creatye handlers or emiiters for each of the command inputs


cliemmiter.on("man", (inputstring)=>{
    cli.response.help(inputstring)
})

cliemmiter.on("help", (inputstring)=>{
    
    cli.response.help(inputstring)
});

cliemmiter.on("exit", ()=>{
    process.exit(0);
})

cliemmiter.on("stats", ()=>{
    cli.response.stats();
})


cliemmiter.on("list users", (stri)=>{
    cli.response.listUsers()
});

cliemmiter.on("more user info", ()=>{
    console.log("more user info is executed");
});

cliemmiter.on("list checks", (string)=>{
  
});

cliemmiter.on("more check info", ()=>{
    console.log("more check info is executed");
});

cliemmiter.on("list logs", ()=>{
    console.log("list logs is executed");
});

cliemmiter.on("more log info", ()=>{
    console.log("more log info is executed");
});

//response functions
cli.response = {};
cli.response.help = function(input){
    var allowedInput ={ 
                        "man" :"show help and allowed comands", 
                        "help": "also known as 'man' ", 
                        "exit": "Close the cli", 
                        "stats": "Get resource utilization, statistics of the operating system", 
                        "list users": "Shows the list of registered users that are not yet deleted i the system", 
                        "more user info --{userId}": "Show details of a specified user",
                        "list checks --up --down": "show a list of all the active checks in the system and their state the --up and --down tags are optional",
                        "more check info --{checkId}": "show details of a specified check",
                        "list logs": "show the list of all log files that can be read (compresses and uncompressed)",
                        "more log info --filename": "Show details of a specified log file"
                    }
                    cli.createHorzontalDashedLines()
                    cli.inputCenterHeader("Help Commands Guide")
                    cli.createHorzontalDashedLines();
                    cli.createVerticalSpace(2)

                    for(key in allowedInput){
                        if(allowedInput.hasOwnProperty(key)){
                            let value = allowedInput[key];
                            let remainingSpace = 50 - key.length;
                            key = "\x1b[34m"+ key+ "\x1b[0m"
                            let space =" ";
                            for(var i = 0; i < remainingSpace; i++){
                                space+= " "
                            }
                             console.log( key+ space+ value);
                             cli.createVerticalSpace(1)
                        }
                    }
                    cli.createVerticalSpace(1)
                    cli.createHorzontalDashedLines();
}


cli.response.stats = ()=>{
    var statistics ={ 
        "Load Average" : os.loadavg().join(" "), 
        "CPU Count": os.cpus().length, 
        "Free Memory": os.freemem() , 
        "Current Malloced memory": v8.getHeapStatistics().malloced_memory, 
        "Peak Malloced memory": v8.getHeapSpaceStatistics().peak_malloced_memory, 
        "Allocated Heap Used (%)": Math.round((v8.getHeapSpaceStatistics.malloced_memory / v8.getHeapSpaceStatistics.total_heap_size) * 100),
        "Available Hep Allocated (%)": Math.round((v8.getHeapSpaceStatistics.total_heap_size / v8.getHeapSpaceStatistics.heap_size_limit) * 100),
        "Uptime": `${os.uptime()} seconds`,
           }
           cli.createHorzontalDashedLines();
           cli.inputCenterHeader("SYSTEM STATISTICS");
           cli.createHorzontalDashedLines();
           cli.createVerticalSpace(2) 

           for(var key in statistics){
            if(statistics.hasOwnProperty(key)){
                let value = statistics[key];
                let remainingSpace = 50 - key.length;
                key = "\x1b[34m"+ key+ "\x1b[0m"
                let space =" ";
                for(var i = 0; i < remainingSpace; i++){
                    space+= " "
                }
                 console.log( key+ space+ value);
                 cli.createVerticalSpace(1)
            }
        }
        cli.createVerticalSpace(1)
        cli.createHorzontalDashedLines();
}



cli.createHorzontalDashedLines = function(){
    let initialLine = "";
    let consoleWidth = process.stdout.columns;
    for(var i = 0; i < consoleWidth; i++){
        initialLine += "-"
    }
    console.log(initialLine)
}

cli.createVerticalSpace = (vlength = 1)=>{
    vlength = typeof(vlength) == "number" && vlength > 0? vlength : 1;
    if(vlength){
        for(var i= 0; i <vlength; i++){
            console.log("");
        }
    }
}

cli.inputCenterHeader = (title)=>{
    title = typeof(title) == "string" && title.length > 0? title : ""
    let screenWidth = process.stdout.columns;
    let spaceBeforeTitle = Math.floor((screenWidth-title.length) / 2);
    let spaceBeforeTitleString = "";
    for(var i= 0; i < spaceBeforeTitle; i++){
        spaceBeforeTitleString  += " " 
    }
    console.log(spaceBeforeTitleString+ title);
}

cli.response.listUsers = ()=>{
    _data.list("users", (err, usersList)=>{
        if(!err && usersList){
            usersList.forEach((user)=>{
                _data.read("users", user, function(err, userData){
                    if(!err && userData){
                        let line = `Username: ${userData.firstName} Lastname: ${userData.lastName}`
                        console.log(line);
                    }
                })
            })
        }
    })
}




module.exports = cli