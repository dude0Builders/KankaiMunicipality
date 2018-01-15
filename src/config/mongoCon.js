import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
var projectName = 'KankaiMunicipality';
var mongoCon = function(){
   this.conn = undefined;
  this.createConn = function(hostname, port, callback){
    this.conn = mongoose.connect(`mongodb://${hostname}/${projectName}`,{useMongoClient:true}, function(err){

        if(err){
         console.error("Error while creating mongoose connection.\n"+ err.message );
         return;
        }

      console.log("Mongoose connection created successfully.");

    });
  }

  this.closeConn = function(){
    if(!this.conn){
      console.info("Connection not intialized!")
      return;
    }
    mongoose.connection.close(function(err){
       if(err)
         console.error("Error while closing mongoose connection ");
       console.log("Mongoose connection closed successfully.");
    })
  }
}


var mongoConn = new mongoCon();

module.exports = mongoConn;
