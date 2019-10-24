/*
*app is started here
*
*/
var server = require("./lib/server");
var workers =require("./lib/workers");
const cli = require("./lib/cli");
const myLib = require("./lib/mycustom-lib");

var app = {}

app.init = function(){
  server.init();

  workers.init();

//  setTimeout(() => {
//     cli.init();
//   }, 2000);
debugger;
dem = 2
console.log("initialized dem")

debugger;
dem++
console.log("incremented dem")

debugger;
dem = dem -1
console.log("subtracted from dem")

debugger;
myLib.init;
console.log("initialized my library")
}

app.init();

module.exports = app;