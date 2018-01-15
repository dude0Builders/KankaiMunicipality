app.controller('navCtrl', ['$scope', 'authService','$state', function ($scope, authService,$state) {

  $scope.isLoggedIn = authService.isLoggedIn;

  $scope.login = function () {
    if (!$scope.username || !$scope.password){
       console.log("Fill all the fields.");
        return;
    }

    $scope.showHideMenu = ()=>{
      $('.button-collapse').sideNav('show');

      $('.button-collapse').sideNav('hide');
    }

    var userCred = {
      username: $scope.username,
      password: $scope.password
    };
    authService.logIn(userCred).then(function (res) {
      console.log("Successfully logged in ");
      console.log(res.data.token);
      authService.saveToken(res.data.token);
      $scope.isLoggedIn = authService.isLoggedIn();
      $state.go('home',{},{reload:true});
      $('#loginModal').modal('hide');
    },function (err) {
      console.log("Error while logging in ");
      console.error(err);
    });
  }


}])
