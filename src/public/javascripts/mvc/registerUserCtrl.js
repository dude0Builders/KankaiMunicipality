app.controller('registerUserCtrl', ['$scope','userService','fileUpload','userTypes','deptTypes',function($scope, userService,fileUpload,userTypes, deptTypes){

  angular.element(document).ready(function () {
    $('.modal').modal();
    $('select').material_select();
    });

    $scope.imageSrc = "";
  $scope.user = {
    username:'',
    password:'',
    firstname:'',
    lastname:'',
    employeeid:'',
    wardno:'',
    phoneno:'',
    email:'',
    address:'',
    image:'',
    departmenttype:''
  };

  $scope.uploadImage = function(){

    var file = $scope.file;
    console.log(file);
    console.log('file is ' + file);
    var uploadUrl = "/uploadImage";
   fileUpload.uploadFileToUrl(file, uploadUrl).then(function(res){
     $scope.user.image = res.data.path;
    Materialize.toast("Image Uploaded Successfully!", 3000, "green");
  },function(){
    Materialize.toast("Error while uploading image", 3000, "red");
  });
 };

$scope.userTypeList = userTypes;
$scope.deptTypeList = deptTypes;

  $scope.register = function() {
    var usertype = $('#usertype').val();
    var depttype = $('#department').val();

    $scope.user.departmenttype = depttype;
    if(!$scope.user.username || !$scope.user.password || !usertype){
      Materialize.toast("Username and Password is compulsory!!",3000,'red');
      return;
    }
    userService.register($scope.user).then(function(res){
       console.log(res);
       userService.setUserType({userid:res.data.id,usertypeid:usertype}).then(function(data){
        Materialize.toast("User successfully registered",3000,"green");
        return;
       }).catch(function(err){
        Materialize.toast("Error while registering the user",3000,"red");
       })

    }).catch(function(error){
      Materialize.toast("Error while registering the user",3000,"red");
    })
  }


}]);



app.directive("fileinput", [function() {
  return {
    scope: {
      fileinput: "=",
      filepreview: "="
    },
    link: function(scope, element, attributes) {
      element.bind("change", function(changeEvent) {
        scope.fileinput = changeEvent.target.files[0];
        var reader = new FileReader();
        reader.onload = function(loadEvent) {
          scope.$apply(function() {
            scope.filepreview = loadEvent.target.result;
          });
        }
        reader.readAsDataURL(scope.fileinput);
      });
    }
  }
}]);

app.service('fileUpload', ['$http','authService', function ($http,authService) {
  this.uploadFileToUrl = function(file, uploadUrl){
     var fd = new FormData();
     fd.append('file', file);


     return $http.post(uploadUrl, fd, {transformRequest: angular.identity,
      headers: {'Content-Type': undefined,'Authorization':'Bearer '+ authService.getToken()}})


  }
}]);

