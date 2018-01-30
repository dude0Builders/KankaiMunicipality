import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
var projectName = 'KankaiMunicipality';
var mongoCon = function(){
   this.conn = undefined;
  this.createConn = function(hostname, port,username, password, callback){

    var res =  function(err){

      if(err){
       console.error("Error while creating mongoose connection.\n"+ err.message );
       return;
      }

    console.log("Mongoose connection created successfully.");

  };
    if(!username || !password){
      console.log("Logging in without username and password");
    this.conn = mongoose.connect(`mongodb://${hostname}/${projectName}?authSource=admin`,{}, res)
    } else {
      this.conn = mongoose.connect(`mongodb://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${hostname}:${port}/${projectName}?authSource=KankaiMunicipality`,{useMongoClient:true}, res)
    }



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
