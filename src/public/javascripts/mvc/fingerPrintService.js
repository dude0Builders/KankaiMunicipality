app.factory('fingerPrintService', ['$http', function($http){

  var obj = {};

  obj.register = function(userid){
    return $http.post('/registerPrint', {'userid':userid});
  }

  obj.verify = function(){
    return $http.post('/verifyPrint',{});
  }

  return obj;
}])
