app.controller('LoginCtrl',['$scope','authService','$state', function($scope, auth,$state){

  $scope.login = function(){
    if(!$scope.username && !$scope.password){
      Materialize.toast("Fill up all the fields", 1500 ,"red");
      return;
    }

    auth.logIn({'username':$scope.username,'password':$scope.password }).then(function(res){
      auth.saveToken(res.data.token);
      $state.go('home',{},{reload:true});
  },function(res){
    Materialize.toast("Invalid Credentials", 1500 ,"red");
  }
  );
  }


}]);
