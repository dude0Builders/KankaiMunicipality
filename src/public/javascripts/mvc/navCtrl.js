

app.controller('navCtrl', ['$scope', 'authService', '$state', 'tokenService', 'notificationService', 'userService', 'fileUpload', function ($scope, authService, $state, tokenService, notificationService, userService, fileUpload) {

  notificationService.connect();
  $scope.isLoggedIn = authService.isLoggedIn;

  $(document).ready(function () {


    $('.modal').modal();


    $('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrainWidth: false,
      gutter: 0, // Spacing from edge
      belowOrigin: true, // Displays dropdown below the button
      alignment: 'left', // Displays dropdown with edge aligned to the left
      stopPropagation: false // Stops event propagation
    });
  })

  $scope.login = function () {
    if (!$scope.username || !$scope.password) {
      console.log("Fill all the fields.");
      return;
    }


    $scope.showHideMenu = () => {
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
      $state.go('home', {}, {
        reload: true
      });
      $('#loginModal').modal('hide');
    }, function (err) {
      console.log("Error while logging in ");
      console.error(err);
    });
  }

  $scope.logout = function () {

    authService.logOut();
    $state.go('login');

  }


  tokenService.todayTokens().then(function (data) {
    console.log(data);
    $scope.tokenlist = tokenService.tokenlist;
    //$scope.tokenlist = data;
  });

  notificationService.tokenadded = function (token) {
    console.log(token);
    $scope.tokenlist.push(token);
    $scope.$apply();
  }

  userService.getUserDetails().then(function(res){
    $scope.profilepic = "/images/users/"+res.data.image;
  })

  $scope.callToken = function (tokenid) {
    tokenService.handleToken(tokenid).then(function (res) {

      Materialize.toast("Token Called ", 2000, "green");
      $scope.tokenlist.forEach((element, i) => {
        if (element._id == tokenid) {
          console.log(i);

          $scope.tokenlist[i].handledby = res.data.handledby;

          return;
        };
      });
    }, function (err) {
      Materialize.toast("Error while calling token", 2000, "red");
    })
  }

  $scope.markDone = function (tokenid) {
    tokenService.completeHandling(tokenid).then(function (data) {
      Materialize.toast("Token Marked as Done", 2000, "green");
      $scope.tokenlist.forEach((element, i) => {
        if (element._id == tokenid) {
          $scope.tokenlist.splice(i, 1);
          return;
        };
      });
    }, function (err) {
      Materialize.toast("Error while closing token", 2000, "red");
    })
  }

  $scope.user = {
    firstname: '',
    lastname: '',
    image: '',
    email: '',
    phoneno: '',
    address: '',
    password: ''
  }
  $scope.showprofilemodal = function () {
    userService.getUserDetails().then(function (res) {
      $scope.user = res.data;
      $scope.user.phoneno = res.data.phoneno.$numberDecimal;
      $('#modal1').modal('open');
      Materialize.updateTextFields();
    }, function (err) {
      console.log(err);
    });

  }

  $scope.uploadImage = function () {

    var file = $scope.file;
    console.log(file);
    console.log('file is ' + file);
    var uploadUrl = "/uploadImage";
    fileUpload.uploadFileToUrl(file, uploadUrl).then(function (res) {
      $scope.user.image = res.data.path;
      Materialize.toast("Image Uploaded Successfully!", 3000, "green");
    }, function () {
      Materialize.toast("Error while uploading image", 3000, "red");
    });
  };

  $scope.closeprofilemodal = function () {

  }


  $scope.savechanges = function () {

    userService.updateUser($scope.user).then(function (res) {
      Materialize.toast("User profile updated!", 2000, 'green');
      $('#modal1').modal('close');
    }, function (err) {
      Materialize.toast("Error while updating profile!", 2000, 'red');
    })
  }
  $scope.hasPermission = authService.hasPermission;
}])

