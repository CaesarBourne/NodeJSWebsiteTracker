/*
*app is started here
*
*/
var server = require("./lib/server");
var workers =require("./lib/workers");
const cli = require("./lib/cli");
const cluster = require("cluster");
const os =require("os");

var app = {}

app.init = function(){
 
if(cluster.isMaster){
  workers.init();

  setTimeout(() => {
     cli.init();
   }, 2000);
   const numberOfCpus = os.cpus().length;
  console.log(numberOfCpus)

  for(var i =0; i < numberOfCpus; i++){
    cluster.fork();
  }
}else{
  server.init(); 
}
 


  
}
// if(require.main == module){
  app.init();




module.exports = app;