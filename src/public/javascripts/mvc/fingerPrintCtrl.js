app.controller('fingerPrintCtrl', ['$scope','fingerPrintService','userService',function($scope,fingerPrintService,userService){

  $scope.userlist  = [];
  $scope.userid='';


  $scope.register = {'success':'', 'failed':''};
  //$scope.register.success='';
  //$scope.register.failed='';
  $scope.verify= {'success':'','failed':''};
  //$scope.verify.success='';
  //$scope.verify.failed='';


  var clear = function(){

    $scope.verify.success=false;
    $scope.verify.failed=false;
    $scope.register.success=false;
  $scope.register.failed=false;

  }
  clear();

  $('#userid').change(function(){
      clear();
      $scope.$apply();
  });
  angular.element(document).ready(function () {
    $('.modal').modal();
    $('select').material_select();
    });

var fetchUsers = function(){userService.getAllUsers().then(function(res){
    $scope.userlist = res.data;
});
}
fetchUsers();


$scope.register = function(){
   $scope.userid = $("#userid").val();
  $scope.register.success='';
  $scope.register.failed='';
  if(!$scope.userid)
  {
    Materialize.toast('Select the user', 3000,'red');
    return;
  }
  fingerPrintService.register($scope.userid).then(function(res){
    Materialize.toast("Finger Print Register", 3000, "green");
    $scope.register.success = true;
  }, function(err){
    Materialize.toast("Error occurred while registering fingerprint", 3000, "red");
    $scope.register.failed = true;
  })
}

$scope.hello = function(){
  alert('hello');
}

$scope.verify = function(){
  $scope.verify.success='';
  $scope.verify.failed='';
  fingerPrintService.verify().then(function(res){
    Materialize.toast("Finger Print is of "+ res.data.userid, 3000, "green");
    $scope.verify.success = true;
  }, function(err){
    Materialize.toast("Error occurred while reading fingerprint", 3000, "red");
    $scope.verify.failed = true;
  })
}


}]);
