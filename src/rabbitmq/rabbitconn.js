var amqp = require("amqp");

var rabbitconn = function(ipAddress, portNumber){
  var conn = this;
  var ip = ipAddress || "localhost";
  var port = portNumber || 5672;
  this.getIp = function(){
     return ip;
  }
  this.getPort = function(){
    return port;
  }
}

rabbitconn.prototype.createConnection = function(){
  console.log("Connecting to rabbit mq on IP: "+ this.getIp() + " port "+ this.getPort())
  var conn = amqp.createConnection({host: "35.202.214.1", port:this.getPort()})
  conn.on('ready',function(){
    console.log("conected");


  })
  conn.on('error', function(err){
    console.log(err);
  })
}

var conn = new rabbitconn("35.202.214.1", null);
//console.log(conn.getIp());
conn.createConnection();
