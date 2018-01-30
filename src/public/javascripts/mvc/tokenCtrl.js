



app.controller('tokenCtrl',['$scope','deptTypes','tokenService', function($scope, deptTypes, tokenService){
 $scope.deptTypesList = deptTypes;

 $scope.token = {
    tokennumber:'',
    visitorname:'',
    phoneno:'',
    department:'',
    description:'',
    createdby:''

 }
 var randomGenerator = function(){
  var x = (20 * Math.random()).toString() ;
  var arr = x.split("");
  return arr[x.length-1]+arr[x.length-2]+arr[x.length-3]+arr[x.length-4];
}

 angular.element(document).ready(function () {

  $('select').material_select();
  });

  $scope.generateToken = function(){
    $scope.token.department = $('#department').val();

    console.log($scope.token.department);
    if(!$scope.token.visitorname || !$scope.token.department){
      Materialize.toast("Please fill all the fields", 3000, "red");
      return;
    }

    $scope.token.tokennumber = randomGenerator();

    tokenService.createToken($scope.token).then(function(data){
      Materialize.toast("Successfully created token", 3000, "green");
    },function(err){
      Materialize.toast("Error while creating the token", 3000, 'red');
    });

  }




}])
