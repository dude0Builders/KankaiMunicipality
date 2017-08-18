var amqp = require("amqp");

var rabbitconn = function(ipAddress, portNumber){
  var conn = this;
  var ip = ipAddress || "localhost";
  var port = portNumber || 4369;
  this.getIp = function(){
     return ip;
  }
  this.getPort = function(){
    return port;
  }
}

rabbitconn.prototype.createConnection = function(){
  console.log("Connecting to rabbit mq on IP: "+ this.getIp() + " port "+ this.getPort())
  amqp.createConnection({hostname: this.getIp, port:this.getPort()})
}

var conn = new rabbitconn("localhost", null);
//console.log(conn.getIp());
conn.createConnection();
