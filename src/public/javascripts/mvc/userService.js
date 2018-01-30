app.factory('userService', ['$http', '$window','authService', function ($http, $window,authService) {


  var user = {  };

  user.getAllUsers = function(){
    return $http.get('/user/list',{headers:{'Authorization':'Bearer '+ authService.getToken()}}).then(function(res){

      return res.data;
    });
  }

  user.getUserDetails = function(){
      return $http.get('/user/'+ authService.currentUserId(), {headers:{'Authorization':'Bearer '+ authService.getToken()}});
  }

  user.getAllUserTypes = function(){
    return $http.get('/userType/list', {headers:{'Authorization':'Bearer '+ authService.getToken()}}).then(function(res){
      return res.data;
    });
  }

  user.register = function(data){

    return $http.post('/register',data);
  }

  user.setUserType = function(data){
    return $http.put('/userType/'+data.userid+'/'+data.usertypeid,{}, {headers:{'Authorization':'Bearer '+authService.getToken()}});
  }

  user.getAllDepartment = function(){
    return $http.get('/departmenttype/list', {headers:{'Authorization':'Bearer '+authService.getToken()}}).then(function(res){
        return res.data;
    });
  }

  user.setDepartmentType = function(){
    return $http.put('/departmenttype/'+data.userid+'/'+data.departmentype.id, {}, {headers:{'Authorization':'Bearer '+authService.getToken()}});
  }

  user.updateUser = function(user){
    return $http.put('/user/'+authService.currentUserId(), user, {headers:{'Authorization':'Bearer '+authService.getToken()}});
  }
  return user;
}]);
