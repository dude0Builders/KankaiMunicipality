app.factory('attendanceService', ['$http', function($http){

  var obj = {};

  obj.attend = function(data){
    return $http.post('/attendance/attend',data);
  }

  obj.getAttend = function(userid, type="today"){
      return $http.get(`/attendance/${userid}`);
  }

  obj.getLastAttend = function(days){
    //TODO: Fetch attendance of past specified days.
  }


  return obj;
}])
