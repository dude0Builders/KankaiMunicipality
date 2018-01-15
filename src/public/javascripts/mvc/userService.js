app.factory('userService', ['$http', '$window','authService', function ($http, $window,authService) {


  var user = {};
  user.getAllUsers = function(){
    return $http.get('/user/list',{headers:{'Authorization':'Bearer '+ authService.getToken()}});
  }

  user.getAllUsersType = function(){

    return $http.get('/userType/list', {headers:{'Authorization':'Bearer '+ authService.getToken()}});
  }

  user.register = function(data){

    return $http.post('/register',data);
  }

  user.setUserType = function(data){
    return $http.put('/userType/'+data.userid+'/'+data.usertypeid,{}, {headers:{'Authorization':'Bearer '+authService.getToken()}});
  }

  return user;
}]);
