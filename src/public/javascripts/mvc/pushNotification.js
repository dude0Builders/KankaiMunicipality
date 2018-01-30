import { client } from 'websocket';
import  MessageType  from '../../../notification/messagetype';


const webSocket = client;
var connection = null;
app.factory('notificationService',['userService','authService', function(userService, authService){

 var obj = { };

 var handleMessage = function(message){

  var data = JSON.parse(message.data);
  console.log(data);
   switch(data.messageType){
     case MessageType.BROADCAST:
     //TODO: Notification
     break;
     case MessageType.TOKENADDED:
     console.log(message);
     if(typeof obj.tokenadded === 'function'){
     obj.tokenadded(data.message);
     }
     break;
     case MessageType.TOKENREMOVED:
     if(typeof obj.tokenremoved === 'function'){
      obj.tokenremoved(data.message);
     }
     break;
     case MessageType.TOKENCALLED:
     if(typeof obj.tokencalled === 'function'){
       obj.tokencalled(data.message);
     }
   }
 }

  obj.connect = function(callback){
      if (connection === null && authService.isLoggedIn()) {
        connection = new WebSocket('ws://127.0.0.1:9009', authService.getToken());

        connection.onopen = function() {
          console.log("Connection Open");
        }

        connection.onmessage = function(message){

            handleMessage(message);
        }

      }
    }

 obj.send = function(message){

   connect.send(message);
 }

 obj.tokenadded ;
 obj.tokenremoved ;
 obj.uploaded;
 obj.tokencalled;

  return obj;


}])



