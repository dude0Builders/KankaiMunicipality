import { server } from 'websocket';
import http from 'http';
import jwt from 'jsonwebtoken';
import MessageType from './messagetype';

class PushServer {



  constructor(){


    this.webSocketPort = 9009;
    this.connection = [];
    this.httpSer = http.createServer(function(request, response){});
    this.webServer = new server({
        httpServer: this.httpSer
    })
    this.receive();
  }

  startPushServer(){
    this.httpSer.listen(this.webSocketPort, function(){
      console.log("PushServer listening for connection ");
    });
  }

  receive() {
    let that = this;
    this.webServer.on('request', function(request){
      if(request){
        var token = request.httpRequest.headers['sec-websocket-protocol'];
        jwt.verify(token, 'SECRET', function(err, verifiedJwt){
          if(err){
            console.log(err);
            request.reject();
            return;
          }
          if(verifiedJwt){
            console.log(verifiedJwt);
            const conn = request.accept(request.requestedProtocols[0],request.origin);
            that.connection.push({wardno:verifiedJwt.wardno, departmenttype:verifiedJwt.departmenttype, connection: conn});
          }
        })
      }
      console.log((new Date()) + ' Connection from origin '
      + request.origin + '.');
    });
  }

  sendMessage(messagemeta, message){
    console.log(messagemeta);
    switch(messagemeta.messageType){
      case MessageType.BROADCAST:
       this.connection.forEach(function(conobject, index){
          if(conobject.departmenttype === messagemeta.departmenttype){
           console.log(`Sending Message to ${conobject.username} `);
           conobject.connection.sendUTF(JSON.stringify({"message":message,messageType: messagemeta.messageType}));
          }
       })
      break;
      case MessageType.TOKENADDED:

        this.connection.forEach(function(conobject, index){
          console.log(`${conobject.wardno} and ${conobject.departmenttype}` );
          console.log(`${messagemeta.wardno} and ${messagemeta.departmenttype}` );

          if(conobject.wardno == messagemeta.wardno && conobject.departmenttype == messagemeta.departmenttype){
          console.log(`Sending message to ${conobject.username}`);
          conobject.connection.sendUTF(JSON.stringify({'message':message,messageType: messagemeta.messageType}));
          }
        })
      break;

      case MessageType.TOKENREMOVED:
      this.connection.forEach(function(conobject, index){
        if(conobject.wardno == messagemeta.wardno && conobject.departmenttype == messagemeta.departmenttype){
          console.log(`Sending message to ${conobject.username}`);
          conobject.connection.sendUTF(JSON.stringify({'message':message,messageType: messagemeta.messageType}));
        }
      })
      break;
      case MessageType.TOKENCALLED:
      this.connection.forEach(function(conobject, index){
        if(conobject.wardno == messagemeta.wardno && conobject.departmenttype == messagemeta.departmenttype){
          console.log(`Sending message to ${conobject.username}`);
          conobject.connection.sendUTF(JSON.stringify({'message':message,messageType: messagemeta.messageType}));
        }
      })
      break;


    }
  }


}





const pushServer = new PushServer
export default pushServer;

