/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "F:\\Projects\\KankaiMunicipality\\src\\public\\javascripts";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
__webpack_require__(2);
__webpack_require__(3);
__webpack_require__(4);
__webpack_require__(5);
__webpack_require__(6);
__webpack_require__(7);
__webpack_require__(8);
__webpack_require__(9);
module.exports = __webpack_require__(10);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


app.factory('authService', ['$http', '$window', function ($http, $window) {

  var auth = {};

  auth.saveToken = function (token) {
    $window.localStorage['kankai'] = token;
  };

  auth.getToken = function () {
    return $window.localStorage['kankai'];
  };

  auth.isLoggedIn = function () {
    var token = auth.getToken();

    if (token) {
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.exp > Date.now() / 1000;
    } else {
      console.log("Not logged In");
      return false;
    }
  };

  auth.currentUser = function () {
    if (auth.isLoggedIn()) {
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.username;
    }
  };

  auth.register = function (user) {
    return $http.post('/register', user).success(function (data) {
      auth.saveToken(data.token);
    });
  };

  auth.logIn = function (user) {
    return $http.post('/login', user);
  };

  auth.logOut = function () {
    $window.localStorage.removeItem('kankai');
  };
  return auth;
}]);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


app.controller('fingerPrintCtrl', ['$scope', 'fingerPrintService', 'userService', function ($scope, fingerPrintService, userService) {

  $scope.userlist = [];
  $scope.userid = '';

  $scope.register = { 'success': '', 'failed': '' };
  //$scope.register.success='';
  //$scope.register.failed='';
  $scope.verify = { 'success': '', 'failed': '' };
  //$scope.verify.success='';
  //$scope.verify.failed='';


  var clear = function clear() {

    $scope.verify.success = false;
    $scope.verify.failed = false;
    $scope.register.success = false;
    $scope.register.failed = false;
  };
  clear();

  $('#userid').change(function () {
    clear();
    $scope.$apply();
  });
  angular.element(document).ready(function () {
    $('.modal').modal();
    $('select').material_select();
  });

  var fetchUsers = function fetchUsers() {
    userService.getAllUsers().then(function (res) {
      $scope.userlist = res.data;
    });
  };
  fetchUsers();

  $scope.register = function () {
    $scope.userid = $("#userid").val();
    $scope.register.success = '';
    $scope.register.failed = '';
    if (!$scope.userid) {
      Materialize.toast('Select the user', 3000, 'red');
      return;
    }
    fingerPrintService.register($scope.userid).then(function (res) {
      Materialize.toast("Finger Print Register", 3000, "green");
      $scope.register.success = true;
    }, function (err) {
      Materialize.toast("Error occurred while registering fingerprint", 3000, "red");
      $scope.register.failed = true;
    });
  };

  $scope.hello = function () {
    alert('hello');
  };

  $scope.verify = function () {
    $scope.verify.success = '';
    $scope.verify.failed = '';
    fingerPrintService.verify().then(function (res) {
      Materialize.toast("Finger Print is of " + res.data.userid, 3000, "green");
      $scope.verify.success = true;
    }, function (err) {
      Materialize.toast("Error occurred while reading fingerprint", 3000, "red");
      $scope.verify.failed = true;
    });
  };
}]);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


app.factory('fingerPrintService', ['$http', function ($http) {

  var obj = {};

  obj.register = function (userid) {
    return $http.post('/registerPrint', { 'userid': userid });
  };

  obj.verify = function () {
    return $http.post('/verifyPrint', {});
  };

  return obj;
}]);

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


app.controller('HomeCtrl', ['$scope', '$http', function ($scope, $http) {

  $scope.currentLocation = '';
  //$scope.currentLocation = "Damak -11 , Jhapa, Nepal";

  // setInterval(function(){
  //   $http.post('/verify').then(function(data){
  //     console.log(data.data.userid);
  //   }, function(err){

  //   })
  // },
  // 3000)

}]);

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


app.factory('HomeSerivce', ['$http', function ($http) {}]);

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


app.controller('LoginCtrl', ['$scope', 'authService', '$state', function ($scope, auth, $state) {

  $scope.login = function () {
    if (!$scope.username && !$scope.password) {
      Materialize.toast("Fill up all the fields", 1500, "red");
      return;
    }

    auth.logIn({ 'username': $scope.username, 'password': $scope.password }).then(function (res) {
      auth.saveToken(res.data.token);
      $state.go('home', {}, { reload: true });
    }, function (res) {
      Materialize.toast("Invalid Credentials", 1500, "red");
    });
  };
}]);

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


app.controller('navCtrl', ['$scope', 'authService', '$state', function ($scope, authService, $state) {

  $scope.isLoggedIn = authService.isLoggedIn;

  $scope.login = function () {
    if (!$scope.username || !$scope.password) {
      console.log("Fill all the fields.");
      return;
    }

    $scope.showHideMenu = function () {
      $('.button-collapse').sideNav('show');

      $('.button-collapse').sideNav('hide');
    };

    var userCred = {
      username: $scope.username,
      password: $scope.password
    };
    authService.logIn(userCred).then(function (res) {
      console.log("Successfully logged in ");
      console.log(res.data.token);
      authService.saveToken(res.data.token);
      $scope.isLoggedIn = authService.isLoggedIn();
      $state.go('home', {}, { reload: true });
      $('#loginModal').modal('hide');
    }, function (err) {
      console.log("Error while logging in ");
      console.error(err);
    });
  };
}]);

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


app.controller('registerUserCtrl', ['$scope', 'userService', 'fileUpload', function ($scope, userService, fileUpload) {

  angular.element(document).ready(function () {
    $('.modal').modal();
    $('select').material_select();
  });

  $scope.imageSrc = "";
  $scope.user = {
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    employeeid: '',
    wardno: '',
    phoneno: '',
    email: '',
    address: '',
    image: ''
  };

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

  $scope.userTypeList = [];
  userService.getAllUsersType().then(function (res) {
    $scope.userTypeList = res.data;
  }).catch(function (err) {
    console.log('Error resolve userType list');
  });

  $scope.register = function () {
    var usertype = $('#usertype').val();
    if (!$scope.user.username || !$scope.user.password || !usertype) {
      Materialize.toast("Username and Password is compulsory!!", 3000, 'red');
      return;
    }
    userService.register($scope.user).then(function (res) {
      console.log(res);
      userService.setUserType({ userid: res.data.id, usertypeid: usertype }).then(function (data) {
        Materialize.toast("User successfully registered", 3000, "green");
        return;
      }).catch(function (err) {
        Materialize.toast("Error while registering the user", 3000, "red");
      });
    }).catch(function (error) {
      Materialize.toast("Error while registering the user", 3000, "red");
    });
  };
}]);

app.directive("fileinput", [function () {
  return {
    scope: {
      fileinput: "=",
      filepreview: "="
    },
    link: function link(scope, element, attributes) {
      element.bind("change", function (changeEvent) {
        scope.fileinput = changeEvent.target.files[0];
        var reader = new FileReader();
        reader.onload = function (loadEvent) {
          scope.$apply(function () {
            scope.filepreview = loadEvent.target.result;
          });
        };
        reader.readAsDataURL(scope.fileinput);
      });
    }
  };
}]);

app.service('fileUpload', ['$http', 'authService', function ($http, authService) {
  this.uploadFileToUrl = function (file, uploadUrl) {
    var fd = new FormData();
    fd.append('file', file);

    return $http.post(uploadUrl, fd, { transformRequest: angular.identity,
      headers: { 'Content-Type': undefined, 'Authorization': 'Bearer ' + authService.getToken() } });
  };
}]);

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


app.controller('tokenCtrl', ['$scope', function ($scope) {}]);

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


app.factory('userService', ['$http', '$window', 'authService', function ($http, $window, authService) {

  var user = {};
  user.getAllUsers = function () {
    return $http.get('/user/list', { headers: { 'Authorization': 'Bearer ' + authService.getToken() } });
  };

  user.getAllUsersType = function () {

    return $http.get('/userType/list', { headers: { 'Authorization': 'Bearer ' + authService.getToken() } });
  };

  user.register = function (data) {

    return $http.post('/register', data);
  };

  user.setUserType = function (data) {
    return $http.put('/userType/' + data.userid + '/' + data.usertypeid, {}, { headers: { 'Authorization': 'Bearer ' + authService.getToken() } });
  };

  return user;
}]);

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYWU3YzUwODc0OWFkMmI3MmNmNTMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2phdmFzY3JpcHRzL212Yy9hdXRoU2VydmljZS5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvamF2YXNjcmlwdHMvbXZjL2ZpbmdlclByaW50Q3RybC5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvamF2YXNjcmlwdHMvbXZjL2ZpbmdlclByaW50U2VydmljZS5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvamF2YXNjcmlwdHMvbXZjL2hvbWVDdHJsLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9qYXZhc2NyaXB0cy9tdmMvaG9tZVNlcnZpY2UuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2phdmFzY3JpcHRzL212Yy9sb2dpbkN0cmwuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2phdmFzY3JpcHRzL212Yy9uYXZDdHJsLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9qYXZhc2NyaXB0cy9tdmMvcmVnaXN0ZXJVc2VyQ3RybC5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvamF2YXNjcmlwdHMvbXZjL3Rva2VuQ3RybC5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvamF2YXNjcmlwdHMvbXZjL3VzZXJTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbImFwcCIsImZhY3RvcnkiLCIkaHR0cCIsIiR3aW5kb3ciLCJhdXRoIiwic2F2ZVRva2VuIiwidG9rZW4iLCJsb2NhbFN0b3JhZ2UiLCJnZXRUb2tlbiIsImlzTG9nZ2VkSW4iLCJwYXlsb2FkIiwiSlNPTiIsInBhcnNlIiwiYXRvYiIsInNwbGl0IiwiZXhwIiwiRGF0ZSIsIm5vdyIsImNvbnNvbGUiLCJsb2ciLCJjdXJyZW50VXNlciIsInVzZXJuYW1lIiwicmVnaXN0ZXIiLCJ1c2VyIiwicG9zdCIsInN1Y2Nlc3MiLCJkYXRhIiwibG9nSW4iLCJsb2dPdXQiLCJyZW1vdmVJdGVtIiwiY29udHJvbGxlciIsIiRzY29wZSIsImZpbmdlclByaW50U2VydmljZSIsInVzZXJTZXJ2aWNlIiwidXNlcmxpc3QiLCJ1c2VyaWQiLCJ2ZXJpZnkiLCJjbGVhciIsImZhaWxlZCIsIiQiLCJjaGFuZ2UiLCIkYXBwbHkiLCJhbmd1bGFyIiwiZWxlbWVudCIsImRvY3VtZW50IiwicmVhZHkiLCJtb2RhbCIsIm1hdGVyaWFsX3NlbGVjdCIsImZldGNoVXNlcnMiLCJnZXRBbGxVc2VycyIsInRoZW4iLCJyZXMiLCJ2YWwiLCJNYXRlcmlhbGl6ZSIsInRvYXN0IiwiZXJyIiwiaGVsbG8iLCJhbGVydCIsIm9iaiIsImN1cnJlbnRMb2NhdGlvbiIsIiRzdGF0ZSIsImxvZ2luIiwicGFzc3dvcmQiLCJnbyIsInJlbG9hZCIsImF1dGhTZXJ2aWNlIiwic2hvd0hpZGVNZW51Iiwic2lkZU5hdiIsInVzZXJDcmVkIiwiZXJyb3IiLCJmaWxlVXBsb2FkIiwiaW1hZ2VTcmMiLCJmaXJzdG5hbWUiLCJsYXN0bmFtZSIsImVtcGxveWVlaWQiLCJ3YXJkbm8iLCJwaG9uZW5vIiwiZW1haWwiLCJhZGRyZXNzIiwiaW1hZ2UiLCJ1cGxvYWRJbWFnZSIsImZpbGUiLCJ1cGxvYWRVcmwiLCJ1cGxvYWRGaWxlVG9VcmwiLCJwYXRoIiwidXNlclR5cGVMaXN0IiwiZ2V0QWxsVXNlcnNUeXBlIiwiY2F0Y2giLCJ1c2VydHlwZSIsInNldFVzZXJUeXBlIiwiaWQiLCJ1c2VydHlwZWlkIiwiZGlyZWN0aXZlIiwic2NvcGUiLCJmaWxlaW5wdXQiLCJmaWxlcHJldmlldyIsImxpbmsiLCJhdHRyaWJ1dGVzIiwiYmluZCIsImNoYW5nZUV2ZW50IiwidGFyZ2V0IiwiZmlsZXMiLCJyZWFkZXIiLCJGaWxlUmVhZGVyIiwib25sb2FkIiwibG9hZEV2ZW50IiwicmVzdWx0IiwicmVhZEFzRGF0YVVSTCIsInNlcnZpY2UiLCJmZCIsIkZvcm1EYXRhIiwiYXBwZW5kIiwidHJhbnNmb3JtUmVxdWVzdCIsImlkZW50aXR5IiwiaGVhZGVycyIsInVuZGVmaW5l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QUFMLEdBQW1CLFlBQVU7QUFDM0IsV0FBTy9DLE1BQU1rSCxHQUFOLENBQVUsWUFBVixFQUF1QixFQUFDRixTQUFRLEVBQUMsaUJBQWdCLFlBQVdqRCxZQUFZekQsUUFBWixFQUE1QixFQUFULEVBQXZCLENBQVA7QUFDRCxHQUZEOztBQUlBZSxPQUFLK0QsZUFBTCxHQUF1QixZQUFVOztBQUUvQixXQUFPcEYsTUFBTWtILEdBQU4sQ0FBVSxnQkFBVixFQUE0QixFQUFDRixTQUFRLEVBQUMsaUJBQWdCLFlBQVdqRCxZQUFZekQsUUFBWixFQUE1QixFQUFULEVBQTVCLENBQVA7QUFDRCxHQUhEOztBQUtBZSxPQUFLRCxRQUFMLEdBQWdCLFVBQVNJLElBQVQsRUFBYzs7QUFFNUIsV0FBT3hCLE1BQU1zQixJQUFOLENBQVcsV0FBWCxFQUF1QkUsSUFBdkIsQ0FBUDtBQUNELEdBSEQ7O0FBS0FILE9BQUtrRSxXQUFMLEdBQW1CLFVBQVMvRCxJQUFULEVBQWM7QUFDL0IsV0FBT3hCLE1BQU1tSCxHQUFOLENBQVUsZUFBYTNGLEtBQUtTLE1BQWxCLEdBQXlCLEdBQXpCLEdBQTZCVCxLQUFLaUUsVUFBNUMsRUFBdUQsRUFBdkQsRUFBMkQsRUFBQ3VCLFNBQVEsRUFBQyxpQkFBZ0IsWUFBVWpELFlBQVl6RCxRQUFaLEVBQTNCLEVBQVQsRUFBM0QsQ0FBUDtBQUNELEdBRkQ7O0FBSUEsU0FBT2UsSUFBUDtBQUNELENBdkIwQixDQUEzQixFIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIkY6XFxcXFByb2plY3RzXFxcXEthbmthaU11bmljaXBhbGl0eVxcXFxzcmNcXFxccHVibGljXFxcXGphdmFzY3JpcHRzXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgYWU3YzUwODc0OWFkMmI3MmNmNTMiLCJhcHAuZmFjdG9yeSgnYXV0aFNlcnZpY2UnLCBbJyRodHRwJywgJyR3aW5kb3cnLCBmdW5jdGlvbiAoJGh0dHAsICR3aW5kb3cpIHtcblxuICB2YXIgYXV0aCA9IHt9O1xuXG4gIGF1dGguc2F2ZVRva2VuID0gZnVuY3Rpb24gKHRva2VuKSB7XG4gICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2VbJ2thbmthaSddPSB0b2tlbjtcbiAgfVxuXG4gIGF1dGguZ2V0VG9rZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICR3aW5kb3cubG9jYWxTdG9yYWdlWydrYW5rYWknXTtcbiAgfVxuXG4gIGF1dGguaXNMb2dnZWRJbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdG9rZW4gPSBhdXRoLmdldFRva2VuKCk7XG5cbiAgICBpZiAodG9rZW4pIHtcbiAgICAgIHZhciBwYXlsb2FkID0gSlNPTi5wYXJzZSgkd2luZG93LmF0b2IodG9rZW4uc3BsaXQoJy4nKVsxXSkpO1xuXG4gICAgICByZXR1cm4gcGF5bG9hZC5leHAgPiBEYXRlLm5vdygpIC8gMTAwMDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coXCJOb3QgbG9nZ2VkIEluXCIpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfTtcblxuICBhdXRoLmN1cnJlbnRVc2VyID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChhdXRoLmlzTG9nZ2VkSW4oKSkge1xuICAgICAgdmFyIHRva2VuID0gYXV0aC5nZXRUb2tlbigpO1xuICAgICAgdmFyIHBheWxvYWQgPSBKU09OLnBhcnNlKCR3aW5kb3cuYXRvYih0b2tlbi5zcGxpdCgnLicpWzFdKSk7XG5cbiAgICAgIHJldHVybiBwYXlsb2FkLnVzZXJuYW1lO1xuICAgIH1cbiAgfTtcblxuICBhdXRoLnJlZ2lzdGVyID0gZnVuY3Rpb24gKHVzZXIpIHtcbiAgICByZXR1cm4gJGh0dHAucG9zdCgnL3JlZ2lzdGVyJywgdXNlcikuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgYXV0aC5zYXZlVG9rZW4oZGF0YS50b2tlbik7XG4gICAgfSk7XG4gIH07XG5cbiAgYXV0aC5sb2dJbiA9IGZ1bmN0aW9uICh1c2VyKSB7XG4gICAgcmV0dXJuICRodHRwLnBvc3QoJy9sb2dpbicsIHVzZXIpO1xuXG4gIH07XG5cbiAgYXV0aC5sb2dPdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgJHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgna2Fua2FpJyk7XG4gIH1cbiAgcmV0dXJuIGF1dGg7XG59XSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wdWJsaWMvamF2YXNjcmlwdHMvbXZjL2F1dGhTZXJ2aWNlLmpzIiwiYXBwLmNvbnRyb2xsZXIoJ2ZpbmdlclByaW50Q3RybCcsIFsnJHNjb3BlJywnZmluZ2VyUHJpbnRTZXJ2aWNlJywndXNlclNlcnZpY2UnLGZ1bmN0aW9uKCRzY29wZSxmaW5nZXJQcmludFNlcnZpY2UsdXNlclNlcnZpY2Upe1xuXG4gICRzY29wZS51c2VybGlzdCAgPSBbXTtcbiAgJHNjb3BlLnVzZXJpZD0nJztcblxuXG4gICRzY29wZS5yZWdpc3RlciA9IHsnc3VjY2Vzcyc6JycsICdmYWlsZWQnOicnfTtcbiAgLy8kc2NvcGUucmVnaXN0ZXIuc3VjY2Vzcz0nJztcbiAgLy8kc2NvcGUucmVnaXN0ZXIuZmFpbGVkPScnO1xuICAkc2NvcGUudmVyaWZ5PSB7J3N1Y2Nlc3MnOicnLCdmYWlsZWQnOicnfTtcbiAgLy8kc2NvcGUudmVyaWZ5LnN1Y2Nlc3M9Jyc7XG4gIC8vJHNjb3BlLnZlcmlmeS5mYWlsZWQ9Jyc7XG5cblxuICB2YXIgY2xlYXIgPSBmdW5jdGlvbigpe1xuXG4gICAgJHNjb3BlLnZlcmlmeS5zdWNjZXNzPWZhbHNlO1xuICAgICRzY29wZS52ZXJpZnkuZmFpbGVkPWZhbHNlO1xuICAgICRzY29wZS5yZWdpc3Rlci5zdWNjZXNzPWZhbHNlO1xuICAkc2NvcGUucmVnaXN0ZXIuZmFpbGVkPWZhbHNlO1xuXG4gIH1cbiAgY2xlYXIoKTtcblxuICAkKCcjdXNlcmlkJykuY2hhbmdlKGZ1bmN0aW9uKCl7XG4gICAgICBjbGVhcigpO1xuICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICB9KTtcbiAgYW5ndWxhci5lbGVtZW50KGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgJCgnLm1vZGFsJykubW9kYWwoKTtcbiAgICAkKCdzZWxlY3QnKS5tYXRlcmlhbF9zZWxlY3QoKTtcbiAgICB9KTtcblxudmFyIGZldGNoVXNlcnMgPSBmdW5jdGlvbigpe3VzZXJTZXJ2aWNlLmdldEFsbFVzZXJzKCkudGhlbihmdW5jdGlvbihyZXMpe1xuICAgICRzY29wZS51c2VybGlzdCA9IHJlcy5kYXRhO1xufSk7XG59XG5mZXRjaFVzZXJzKCk7XG5cblxuJHNjb3BlLnJlZ2lzdGVyID0gZnVuY3Rpb24oKXtcbiAgICRzY29wZS51c2VyaWQgPSAkKFwiI3VzZXJpZFwiKS52YWwoKTtcbiAgJHNjb3BlLnJlZ2lzdGVyLnN1Y2Nlc3M9Jyc7XG4gICRzY29wZS5yZWdpc3Rlci5mYWlsZWQ9Jyc7XG4gIGlmKCEkc2NvcGUudXNlcmlkKVxuICB7XG4gICAgTWF0ZXJpYWxpemUudG9hc3QoJ1NlbGVjdCB0aGUgdXNlcicsIDMwMDAsJ3JlZCcpO1xuICAgIHJldHVybjtcbiAgfVxuICBmaW5nZXJQcmludFNlcnZpY2UucmVnaXN0ZXIoJHNjb3BlLnVzZXJpZCkudGhlbihmdW5jdGlvbihyZXMpe1xuICAgIE1hdGVyaWFsaXplLnRvYXN0KFwiRmluZ2VyIFByaW50IFJlZ2lzdGVyXCIsIDMwMDAsIFwiZ3JlZW5cIik7XG4gICAgJHNjb3BlLnJlZ2lzdGVyLnN1Y2Nlc3MgPSB0cnVlO1xuICB9LCBmdW5jdGlvbihlcnIpe1xuICAgIE1hdGVyaWFsaXplLnRvYXN0KFwiRXJyb3Igb2NjdXJyZWQgd2hpbGUgcmVnaXN0ZXJpbmcgZmluZ2VycHJpbnRcIiwgMzAwMCwgXCJyZWRcIik7XG4gICAgJHNjb3BlLnJlZ2lzdGVyLmZhaWxlZCA9IHRydWU7XG4gIH0pXG59XG5cbiRzY29wZS5oZWxsbyA9IGZ1bmN0aW9uKCl7XG4gIGFsZXJ0KCdoZWxsbycpO1xufVxuXG4kc2NvcGUudmVyaWZ5ID0gZnVuY3Rpb24oKXtcbiAgJHNjb3BlLnZlcmlmeS5zdWNjZXNzPScnO1xuICAkc2NvcGUudmVyaWZ5LmZhaWxlZD0nJztcbiAgZmluZ2VyUHJpbnRTZXJ2aWNlLnZlcmlmeSgpLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgICBNYXRlcmlhbGl6ZS50b2FzdChcIkZpbmdlciBQcmludCBpcyBvZiBcIisgcmVzLmRhdGEudXNlcmlkLCAzMDAwLCBcImdyZWVuXCIpO1xuICAgICRzY29wZS52ZXJpZnkuc3VjY2VzcyA9IHRydWU7XG4gIH0sIGZ1bmN0aW9uKGVycil7XG4gICAgTWF0ZXJpYWxpemUudG9hc3QoXCJFcnJvciBvY2N1cnJlZCB3aGlsZSByZWFkaW5nIGZpbmdlcnByaW50XCIsIDMwMDAsIFwicmVkXCIpO1xuICAgICRzY29wZS52ZXJpZnkuZmFpbGVkID0gdHJ1ZTtcbiAgfSlcbn1cblxuXG59XSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wdWJsaWMvamF2YXNjcmlwdHMvbXZjL2ZpbmdlclByaW50Q3RybC5qcyIsImFwcC5mYWN0b3J5KCdmaW5nZXJQcmludFNlcnZpY2UnLCBbJyRodHRwJywgZnVuY3Rpb24oJGh0dHApe1xuXG4gIHZhciBvYmogPSB7fTtcblxuICBvYmoucmVnaXN0ZXIgPSBmdW5jdGlvbih1c2VyaWQpe1xuICAgIHJldHVybiAkaHR0cC5wb3N0KCcvcmVnaXN0ZXJQcmludCcsIHsndXNlcmlkJzp1c2VyaWR9KTtcbiAgfVxuXG4gIG9iai52ZXJpZnkgPSBmdW5jdGlvbigpe1xuICAgIHJldHVybiAkaHR0cC5wb3N0KCcvdmVyaWZ5UHJpbnQnLHt9KTtcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59XSlcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3B1YmxpYy9qYXZhc2NyaXB0cy9tdmMvZmluZ2VyUHJpbnRTZXJ2aWNlLmpzIiwiXG5cbmFwcC5jb250cm9sbGVyKCdIb21lQ3RybCcsWyckc2NvcGUnLCckaHR0cCcsIGZ1bmN0aW9uKCRzY29wZSwkaHR0cCl7XG5cblxuICAkc2NvcGUuY3VycmVudExvY2F0aW9uID0gJyc7XG4gIC8vJHNjb3BlLmN1cnJlbnRMb2NhdGlvbiA9IFwiRGFtYWsgLTExICwgSmhhcGEsIE5lcGFsXCI7XG5cbi8vIHNldEludGVydmFsKGZ1bmN0aW9uKCl7XG4vLyAgICRodHRwLnBvc3QoJy92ZXJpZnknKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuLy8gICAgIGNvbnNvbGUubG9nKGRhdGEuZGF0YS51c2VyaWQpO1xuLy8gICB9LCBmdW5jdGlvbihlcnIpe1xuXG4vLyAgIH0pXG4vLyB9LFxuLy8gMzAwMClcblxuXG5cblxuXG59XSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wdWJsaWMvamF2YXNjcmlwdHMvbXZjL2hvbWVDdHJsLmpzIiwiYXBwLmZhY3RvcnkoJ0hvbWVTZXJpdmNlJyxbJyRodHRwJyAsZnVuY3Rpb24oJGh0dHApe1xuXG59XSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wdWJsaWMvamF2YXNjcmlwdHMvbXZjL2hvbWVTZXJ2aWNlLmpzIiwiYXBwLmNvbnRyb2xsZXIoJ0xvZ2luQ3RybCcsWyckc2NvcGUnLCdhdXRoU2VydmljZScsJyRzdGF0ZScsIGZ1bmN0aW9uKCRzY29wZSwgYXV0aCwkc3RhdGUpe1xuXG4gICRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uKCl7XG4gICAgaWYoISRzY29wZS51c2VybmFtZSAmJiAhJHNjb3BlLnBhc3N3b3JkKXtcbiAgICAgIE1hdGVyaWFsaXplLnRvYXN0KFwiRmlsbCB1cCBhbGwgdGhlIGZpZWxkc1wiLCAxNTAwICxcInJlZFwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBhdXRoLmxvZ0luKHsndXNlcm5hbWUnOiRzY29wZS51c2VybmFtZSwncGFzc3dvcmQnOiRzY29wZS5wYXNzd29yZCB9KS50aGVuKGZ1bmN0aW9uKHJlcyl7XG4gICAgICBhdXRoLnNhdmVUb2tlbihyZXMuZGF0YS50b2tlbik7XG4gICAgICAkc3RhdGUuZ28oJ2hvbWUnLHt9LHtyZWxvYWQ6dHJ1ZX0pO1xuICB9LGZ1bmN0aW9uKHJlcyl7XG4gICAgTWF0ZXJpYWxpemUudG9hc3QoXCJJbnZhbGlkIENyZWRlbnRpYWxzXCIsIDE1MDAgLFwicmVkXCIpO1xuICB9XG4gICk7XG4gIH1cblxuXG59XSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wdWJsaWMvamF2YXNjcmlwdHMvbXZjL2xvZ2luQ3RybC5qcyIsImFwcC5jb250cm9sbGVyKCduYXZDdHJsJywgWyckc2NvcGUnLCAnYXV0aFNlcnZpY2UnLCckc3RhdGUnLCBmdW5jdGlvbiAoJHNjb3BlLCBhdXRoU2VydmljZSwkc3RhdGUpIHtcblxuICAkc2NvcGUuaXNMb2dnZWRJbiA9IGF1dGhTZXJ2aWNlLmlzTG9nZ2VkSW47XG5cbiAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghJHNjb3BlLnVzZXJuYW1lIHx8ICEkc2NvcGUucGFzc3dvcmQpe1xuICAgICAgIGNvbnNvbGUubG9nKFwiRmlsbCBhbGwgdGhlIGZpZWxkcy5cIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAkc2NvcGUuc2hvd0hpZGVNZW51ID0gKCk9PntcbiAgICAgICQoJy5idXR0b24tY29sbGFwc2UnKS5zaWRlTmF2KCdzaG93Jyk7XG5cbiAgICAgICQoJy5idXR0b24tY29sbGFwc2UnKS5zaWRlTmF2KCdoaWRlJyk7XG4gICAgfVxuXG4gICAgdmFyIHVzZXJDcmVkID0ge1xuICAgICAgdXNlcm5hbWU6ICRzY29wZS51c2VybmFtZSxcbiAgICAgIHBhc3N3b3JkOiAkc2NvcGUucGFzc3dvcmRcbiAgICB9O1xuICAgIGF1dGhTZXJ2aWNlLmxvZ0luKHVzZXJDcmVkKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiU3VjY2Vzc2Z1bGx5IGxvZ2dlZCBpbiBcIik7XG4gICAgICBjb25zb2xlLmxvZyhyZXMuZGF0YS50b2tlbik7XG4gICAgICBhdXRoU2VydmljZS5zYXZlVG9rZW4ocmVzLmRhdGEudG9rZW4pO1xuICAgICAgJHNjb3BlLmlzTG9nZ2VkSW4gPSBhdXRoU2VydmljZS5pc0xvZ2dlZEluKCk7XG4gICAgICAkc3RhdGUuZ28oJ2hvbWUnLHt9LHtyZWxvYWQ6dHJ1ZX0pO1xuICAgICAgJCgnI2xvZ2luTW9kYWwnKS5tb2RhbCgnaGlkZScpO1xuICAgIH0sZnVuY3Rpb24gKGVycikge1xuICAgICAgY29uc29sZS5sb2coXCJFcnJvciB3aGlsZSBsb2dnaW5nIGluIFwiKTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICB9KTtcbiAgfVxuXG5cbn1dKVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vcHVibGljL2phdmFzY3JpcHRzL212Yy9uYXZDdHJsLmpzIiwiYXBwLmNvbnRyb2xsZXIoJ3JlZ2lzdGVyVXNlckN0cmwnLCBbJyRzY29wZScsJ3VzZXJTZXJ2aWNlJywnZmlsZVVwbG9hZCcsZnVuY3Rpb24oJHNjb3BlLCB1c2VyU2VydmljZSxmaWxlVXBsb2FkKXtcblxuICBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAkKCcubW9kYWwnKS5tb2RhbCgpO1xuICAgICQoJ3NlbGVjdCcpLm1hdGVyaWFsX3NlbGVjdCgpO1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLmltYWdlU3JjID0gXCJcIjtcbiAgJHNjb3BlLnVzZXIgPSB7XG4gICAgdXNlcm5hbWU6JycsXG4gICAgcGFzc3dvcmQ6JycsXG4gICAgZmlyc3RuYW1lOicnLFxuICAgIGxhc3RuYW1lOicnLFxuICAgIGVtcGxveWVlaWQ6JycsXG4gICAgd2FyZG5vOicnLFxuICAgIHBob25lbm86JycsXG4gICAgZW1haWw6JycsXG4gICAgYWRkcmVzczonJyxcbiAgICBpbWFnZTonJyxcbiAgfTtcblxuICAkc2NvcGUudXBsb2FkSW1hZ2UgPSBmdW5jdGlvbigpe1xuXG4gICAgdmFyIGZpbGUgPSAkc2NvcGUuZmlsZTtcbiAgICBjb25zb2xlLmxvZyhmaWxlKTtcbiAgICBjb25zb2xlLmxvZygnZmlsZSBpcyAnICsgZmlsZSk7XG4gICAgdmFyIHVwbG9hZFVybCA9IFwiL3VwbG9hZEltYWdlXCI7XG4gICBmaWxlVXBsb2FkLnVwbG9hZEZpbGVUb1VybChmaWxlLCB1cGxvYWRVcmwpLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgICAgJHNjb3BlLnVzZXIuaW1hZ2UgPSByZXMuZGF0YS5wYXRoO1xuICAgIE1hdGVyaWFsaXplLnRvYXN0KFwiSW1hZ2UgVXBsb2FkZWQgU3VjY2Vzc2Z1bGx5IVwiLCAzMDAwLCBcImdyZWVuXCIpO1xuICB9LGZ1bmN0aW9uKCl7XG4gICAgTWF0ZXJpYWxpemUudG9hc3QoXCJFcnJvciB3aGlsZSB1cGxvYWRpbmcgaW1hZ2VcIiwgMzAwMCwgXCJyZWRcIik7XG4gIH0pO1xuIH07XG5cbiRzY29wZS51c2VyVHlwZUxpc3QgPSBbXTtcbnVzZXJTZXJ2aWNlLmdldEFsbFVzZXJzVHlwZSgpLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgJHNjb3BlLnVzZXJUeXBlTGlzdCA9IHJlcy5kYXRhO1xuICB9KS5jYXRjaChmdW5jdGlvbihlcnIpe1xuICAgIGNvbnNvbGUubG9nKCdFcnJvciByZXNvbHZlIHVzZXJUeXBlIGxpc3QnKTtcbiAgfSk7XG5cbiAgJHNjb3BlLnJlZ2lzdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHVzZXJ0eXBlID0gJCgnI3VzZXJ0eXBlJykudmFsKCk7XG4gICAgaWYoISRzY29wZS51c2VyLnVzZXJuYW1lIHx8ICEkc2NvcGUudXNlci5wYXNzd29yZCB8fCAhdXNlcnR5cGUpe1xuICAgICAgTWF0ZXJpYWxpemUudG9hc3QoXCJVc2VybmFtZSBhbmQgUGFzc3dvcmQgaXMgY29tcHVsc29yeSEhXCIsMzAwMCwncmVkJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHVzZXJTZXJ2aWNlLnJlZ2lzdGVyKCRzY29wZS51c2VyKS50aGVuKGZ1bmN0aW9uKHJlcyl7XG4gICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgICB1c2VyU2VydmljZS5zZXRVc2VyVHlwZSh7dXNlcmlkOnJlcy5kYXRhLmlkLHVzZXJ0eXBlaWQ6dXNlcnR5cGV9KS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICBNYXRlcmlhbGl6ZS50b2FzdChcIlVzZXIgc3VjY2Vzc2Z1bGx5IHJlZ2lzdGVyZWRcIiwzMDAwLFwiZ3JlZW5cIik7XG4gICAgICAgIHJldHVybjtcbiAgICAgICB9KS5jYXRjaChmdW5jdGlvbihlcnIpe1xuICAgICAgICBNYXRlcmlhbGl6ZS50b2FzdChcIkVycm9yIHdoaWxlIHJlZ2lzdGVyaW5nIHRoZSB1c2VyXCIsMzAwMCxcInJlZFwiKTtcbiAgICAgICB9KVxuXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyb3Ipe1xuICAgICAgTWF0ZXJpYWxpemUudG9hc3QoXCJFcnJvciB3aGlsZSByZWdpc3RlcmluZyB0aGUgdXNlclwiLDMwMDAsXCJyZWRcIik7XG4gICAgfSlcbiAgfVxuXG5cbn1dKTtcblxuXG5cbmFwcC5kaXJlY3RpdmUoXCJmaWxlaW5wdXRcIiwgW2Z1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHNjb3BlOiB7XG4gICAgICBmaWxlaW5wdXQ6IFwiPVwiLFxuICAgICAgZmlsZXByZXZpZXc6IFwiPVwiXG4gICAgfSxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cmlidXRlcykge1xuICAgICAgZWxlbWVudC5iaW5kKFwiY2hhbmdlXCIsIGZ1bmN0aW9uKGNoYW5nZUV2ZW50KSB7XG4gICAgICAgIHNjb3BlLmZpbGVpbnB1dCA9IGNoYW5nZUV2ZW50LnRhcmdldC5maWxlc1swXTtcbiAgICAgICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICAgIHJlYWRlci5vbmxvYWQgPSBmdW5jdGlvbihsb2FkRXZlbnQpIHtcbiAgICAgICAgICBzY29wZS4kYXBwbHkoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzY29wZS5maWxlcHJldmlldyA9IGxvYWRFdmVudC50YXJnZXQucmVzdWx0O1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKHNjb3BlLmZpbGVpbnB1dCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1dKTtcblxuYXBwLnNlcnZpY2UoJ2ZpbGVVcGxvYWQnLCBbJyRodHRwJywnYXV0aFNlcnZpY2UnLCBmdW5jdGlvbiAoJGh0dHAsYXV0aFNlcnZpY2UpIHtcbiAgdGhpcy51cGxvYWRGaWxlVG9VcmwgPSBmdW5jdGlvbihmaWxlLCB1cGxvYWRVcmwpe1xuICAgICB2YXIgZmQgPSBuZXcgRm9ybURhdGEoKTtcbiAgICAgZmQuYXBwZW5kKCdmaWxlJywgZmlsZSk7XG5cblxuICAgICByZXR1cm4gJGh0dHAucG9zdCh1cGxvYWRVcmwsIGZkLCB7dHJhbnNmb3JtUmVxdWVzdDogYW5ndWxhci5pZGVudGl0eSxcbiAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogdW5kZWZpbmVkLCdBdXRob3JpemF0aW9uJzonQmVhcmVyICcrIGF1dGhTZXJ2aWNlLmdldFRva2VuKCl9fSlcblxuXG4gIH1cbn1dKTtcblxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vcHVibGljL2phdmFzY3JpcHRzL212Yy9yZWdpc3RlclVzZXJDdHJsLmpzIiwiYXBwLmNvbnRyb2xsZXIoJ3Rva2VuQ3RybCcsWyckc2NvcGUnLCBmdW5jdGlvbigkc2NvcGUpe1xuXG59XSlcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3B1YmxpYy9qYXZhc2NyaXB0cy9tdmMvdG9rZW5DdHJsLmpzIiwiYXBwLmZhY3RvcnkoJ3VzZXJTZXJ2aWNlJywgWyckaHR0cCcsICckd2luZG93JywnYXV0aFNlcnZpY2UnLCBmdW5jdGlvbiAoJGh0dHAsICR3aW5kb3csYXV0aFNlcnZpY2UpIHtcblxuXG4gIHZhciB1c2VyID0ge307XG4gIHVzZXIuZ2V0QWxsVXNlcnMgPSBmdW5jdGlvbigpe1xuICAgIHJldHVybiAkaHR0cC5nZXQoJy91c2VyL2xpc3QnLHtoZWFkZXJzOnsnQXV0aG9yaXphdGlvbic6J0JlYXJlciAnKyBhdXRoU2VydmljZS5nZXRUb2tlbigpfX0pO1xuICB9XG5cbiAgdXNlci5nZXRBbGxVc2Vyc1R5cGUgPSBmdW5jdGlvbigpe1xuXG4gICAgcmV0dXJuICRodHRwLmdldCgnL3VzZXJUeXBlL2xpc3QnLCB7aGVhZGVyczp7J0F1dGhvcml6YXRpb24nOidCZWFyZXIgJysgYXV0aFNlcnZpY2UuZ2V0VG9rZW4oKX19KTtcbiAgfVxuXG4gIHVzZXIucmVnaXN0ZXIgPSBmdW5jdGlvbihkYXRhKXtcblxuICAgIHJldHVybiAkaHR0cC5wb3N0KCcvcmVnaXN0ZXInLGRhdGEpO1xuICB9XG5cbiAgdXNlci5zZXRVc2VyVHlwZSA9IGZ1bmN0aW9uKGRhdGEpe1xuICAgIHJldHVybiAkaHR0cC5wdXQoJy91c2VyVHlwZS8nK2RhdGEudXNlcmlkKycvJytkYXRhLnVzZXJ0eXBlaWQse30sIHtoZWFkZXJzOnsnQXV0aG9yaXphdGlvbic6J0JlYXJlciAnK2F1dGhTZXJ2aWNlLmdldFRva2VuKCl9fSk7XG4gIH1cblxuICByZXR1cm4gdXNlcjtcbn1dKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3B1YmxpYy9qYXZhc2NyaXB0cy9tdmMvdXNlclNlcnZpY2UuanMiXSwic291cmNlUm9vdCI6IiJ9