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
__webpack_require__(10);
__webpack_require__(15);
__webpack_require__(16);
__webpack_require__(17);
__webpack_require__(18);
__webpack_require__(19);
module.exports = __webpack_require__(20);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


app.controller('attendanceCtrl', ['$scope', 'attendanceService', 'fingerPrintService', 'authService', function ($scope, attendService, fingerPrintService, authService) {

  $(document).ready(function () {
    $('.modal').modal();
  });
  $scope.attend = function () {
    fingerPrintService.verify().then(function (res) {

      var data = {};
      data.userid = res.data.userid;
      data.date = new Date().toDateString();

      attendService.attend(data).then(function (res) {
        console.log(res.data);
        $scope.user = res.data;
        Materialize.toast("Attendance done !", 3000, 'green');
        $('#userdetail').modal('open');
        setTimeout(function () {
          $('#userdetail').modal('close');
        }, 5000);
      }, function (err) {
        Materialize.toast("Error occurred !", 3000, 'red');
      });
    }, function (err) {

      if (err.status == 404) {
        Materialize.toast("Finger Print Not Registered !", 3000, 'red');
      } else {
        Materialize.toast("Error Occurred !", 3000, 'red');
      }
    });
  };
}]);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


app.factory('attendanceService', ['$http', function ($http) {

  var obj = {};

  obj.attend = function (data) {
    return $http.post('/attendance/attend', data);
  };

  obj.getAttend = function (userid) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "today";

    return $http.get('/attendance/' + userid);
  };

  obj.getLastAttend = function (days) {
    //TODO: Fetch attendance of past specified days.
  };

  return obj;
}]);

/***/ }),
/* 3 */
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

  auth.currentUserId = function () {
    if (auth.isLoggedIn()) {
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));
      return payload._id;
    }
  };

  auth.wardno = function () {
    if (auth.isLoggedIn()) {
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.wardno;
    }
  };

  auth.hasPermission = function (permission) {
    if (auth.isLoggedIn()) {
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.permissions.includes(permission);
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

  auth.hasPermissionFor = function (statename) {
    switch (statename) {
      case 'registerprint':
      case 'registeruser':
        return auth.hasPermission('registeruser');

      default:
        return true;
    }
  };

  auth.logOut = function () {
    console.log('Logging out user');
    $window.localStorage.removeItem('kankai');
  };
  return auth;
}]);

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


app.controller('fingerPrintCtrl', ['$scope', 'fingerPrintService', 'userService', 'users', function ($scope, fingerPrintService, userService, users) {

  console.log(users);
  $scope.userlist = users;
  $scope.userid = '';

  $scope.register = { 'success': '', 'failed': '' };

  $scope.verify = { 'success': '', 'failed': '' };

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
/* 5 */
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


app.controller('HomeCtrl', ['$scope', '$http', 'notificationService', 'slides', function ($scope, $http, notificationService, slides) {
  notificationService.connect(function (message) {
    message.onmessage(function (message) {
      console.log(message);
    });
  });
  $scope.slideslist = slides;
  $scope.slideAlign = ['left-align', 'center-align', 'right-align'];
  $scope.calledtoken = '';
  $(document).ready(function () {
    $('.carousel.carousel-slider').carousel({
      fullWidth: true
    });
    $('.slider').slider();
  });

  notificationService.tokencalled = function (message) {
    Materialize.toast(message, 3000, "green");
    $('#fixed-item').addClass('wobble animated');
    $scope.calledtoken = message;
    $scope.$apply();

    setTimeout(function () {
      $('#fixed-item').removeClass('wobble animated');
      $scope.calledtoken = '';
      $scope.$apply();
    }, 4000);
  };
}]);

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


app.factory('HomeSerivce', ['$http', 'notificationService', function ($http, notificationService) {}]);

/***/ }),
/* 8 */
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
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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
  });

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
      $state.go('home', {}, {
        reload: true
      });
      $('#loginModal').modal('hide');
    }, function (err) {
      console.log("Error while logging in ");
      console.error(err);
    });
  };

  $scope.logout = function () {

    authService.logOut();
    $state.go('login');
  };

  tokenService.todayTokens().then(function (data) {
    console.log(data);
    $scope.tokenlist = tokenService.tokenlist;
    //$scope.tokenlist = data;
  });

  notificationService.tokenadded = function (token) {
    console.log(token);
    $scope.tokenlist.push(token);
    $scope.$apply();
  };

  userService.getUserDetails().then(function (res) {
    $scope.profilepic = "/images/users/" + res.data.image;
  });

  $scope.callToken = function (tokenid) {
    tokenService.handleToken(tokenid).then(function (res) {

      Materialize.toast("Token Called ", 2000, "green");
      $scope.tokenlist.forEach(function (element, i) {
        if (element._id == tokenid) {
          console.log(i);

          $scope.tokenlist[i].handledby = res.data.handledby;

          return;
        };
      });
    }, function (err) {
      Materialize.toast("Error while calling token", 2000, "red");
    });
  };

  $scope.markDone = function (tokenid) {
    tokenService.completeHandling(tokenid).then(function (data) {
      Materialize.toast("Token Marked as Done", 2000, "green");
      $scope.tokenlist.forEach(function (element, i) {
        if (element._id == tokenid) {
          $scope.tokenlist.splice(i, 1);
          return;
        };
      });
    }, function (err) {
      Materialize.toast("Error while closing token", 2000, "red");
    });
  };

  $scope.user = {
    firstname: '',
    lastname: '',
    image: '',
    email: '',
    phoneno: '',
    address: '',
    password: ''
  };
  $scope.showprofilemodal = function () {
    userService.getUserDetails().then(function (res) {
      $scope.user = res.data;
      $scope.user.phoneno = res.data.phoneno.$numberDecimal;
      $('#modal1').modal('open');
      Materialize.updateTextFields();
    }, function (err) {
      console.log(err);
    });
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

  $scope.closeprofilemodal = function () {};

  $scope.savechanges = function () {

    userService.updateUser($scope.user).then(function (res) {
      Materialize.toast("User profile updated!", 2000, 'green');
      $('#modal1').modal('close');
    }, function (err) {
      Materialize.toast("Error while updating profile!", 2000, 'red');
    });
  };
  $scope.hasPermission = authService.hasPermission;
}]);

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _websocket = __webpack_require__(11);

var _messagetype = __webpack_require__(14);

var _messagetype2 = _interopRequireDefault(_messagetype);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var webSocket = _websocket.client;
var connection = null;
app.factory('notificationService', ['userService', 'authService', function (userService, authService) {

  var obj = {};

  var handleMessage = function handleMessage(message) {

    var data = JSON.parse(message.data);
    console.log(data);
    switch (data.messageType) {
      case _messagetype2.default.BROADCAST:
        //TODO: Notification
        break;
      case _messagetype2.default.TOKENADDED:
        console.log(message);
        if (typeof obj.tokenadded === 'function') {
          obj.tokenadded(data.message);
        }
        break;
      case _messagetype2.default.TOKENREMOVED:
        if (typeof obj.tokenremoved === 'function') {
          obj.tokenremoved(data.message);
        }
        break;
      case _messagetype2.default.TOKENCALLED:
        if (typeof obj.tokencalled === 'function') {
          obj.tokencalled(data.message);
        }
    }
  };

  obj.connect = function (callback) {
    if (connection === null && authService.isLoggedIn()) {
      connection = new WebSocket('ws://127.0.0.1:9009', authService.getToken());

      connection.onopen = function () {
        console.log("Connection Open");
      };

      connection.onmessage = function (message) {

        handleMessage(message);
      };
    }
  };

  obj.send = function (message) {

    connect.send(message);
  };

  obj.tokenadded;
  obj.tokenremoved;
  obj.uploaded;
  obj.tokencalled;

  return obj;
}]);

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var _global = (function() { return this; })();
var NativeWebSocket = _global.WebSocket || _global.MozWebSocket;
var websocket_version = __webpack_require__(12);


/**
 * Expose a W3C WebSocket class with just one or two arguments.
 */
function W3CWebSocket(uri, protocols) {
	var native_instance;

	if (protocols) {
		native_instance = new NativeWebSocket(uri, protocols);
	}
	else {
		native_instance = new NativeWebSocket(uri);
	}

	/**
	 * 'native_instance' is an instance of nativeWebSocket (the browser's WebSocket
	 * class). Since it is an Object it will be returned as it is when creating an
	 * instance of W3CWebSocket via 'new W3CWebSocket()'.
	 *
	 * ECMAScript 5: http://bclary.com/2004/11/07/#a-13.2.2
	 */
	return native_instance;
}
if (NativeWebSocket) {
	['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'].forEach(function(prop) {
		Object.defineProperty(W3CWebSocket, prop, {
			get: function() { return NativeWebSocket[prop]; }
		});
	});
}

/**
 * Module exports.
 */
module.exports = {
    'w3cwebsocket' : NativeWebSocket ? W3CWebSocket : null,
    'version'      : websocket_version
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(13).version;


/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = {"_from":"websocket","_id":"websocket@1.0.25","_inBundle":false,"_integrity":"sha512-M58njvi6ZxVb5k7kpnHh2BvNKuBWiwIYvsToErBzWhvBZYwlEiLcyLrG41T1jRcrY9ettqPYEqduLI7ul54CVQ==","_location":"/websocket","_phantomChildren":{},"_requested":{"type":"tag","registry":true,"raw":"websocket","name":"websocket","escapedName":"websocket","rawSpec":"","saveSpec":null,"fetchSpec":"latest"},"_requiredBy":["#USER","/"],"_resolved":"https://registry.npmjs.org/websocket/-/websocket-1.0.25.tgz","_shasum":"998ec790f0a3eacb8b08b50a4350026692a11958","_spec":"websocket","_where":"F:\\Projects\\KankaiMunicipality\\src","author":{"name":"Brian McKelvey","email":"brian@worlize.com","url":"https://www.worlize.com/"},"browser":"lib/browser.js","bugs":{"url":"https://github.com/theturtle32/WebSocket-Node/issues"},"bundleDependencies":false,"config":{"verbose":false},"contributors":[{"name":"Iñaki Baz Castillo","email":"ibc@aliax.net","url":"http://dev.sipdoc.net"}],"dependencies":{"debug":"^2.2.0","nan":"^2.3.3","typedarray-to-buffer":"^3.1.2","yaeti":"^0.0.6"},"deprecated":false,"description":"Websocket Client & Server Library implementing the WebSocket protocol as specified in RFC 6455.","devDependencies":{"buffer-equal":"^1.0.0","faucet":"^0.0.1","gulp":"git+https://github.com/gulpjs/gulp.git#4.0","gulp-jshint":"^2.0.4","jshint":"^2.0.0","jshint-stylish":"^2.2.1","tape":"^4.0.1"},"directories":{"lib":"./lib"},"engines":{"node":">=0.10.0"},"homepage":"https://github.com/theturtle32/WebSocket-Node","keywords":["websocket","websockets","socket","networking","comet","push","RFC-6455","realtime","server","client"],"license":"Apache-2.0","main":"index","name":"websocket","repository":{"type":"git","url":"git+https://github.com/theturtle32/WebSocket-Node.git"},"scripts":{"gulp":"gulp","install":"(node-gyp rebuild 2> builderror.log) || (exit 0)","test":"faucet test/unit"},"version":"1.0.25"}

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var MessageType = {
  BROADCAST: 'broadcast',
  TOKENADDED: 'tokenadded',
  TOKENREMOVED: 'tokenremoved',
  TOKENCALLED: 'tokencalled'
};

exports.default = MessageType;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


app.controller('registerUserCtrl', ['$scope', 'userService', 'fileUpload', 'userTypes', 'deptTypes', function ($scope, userService, fileUpload, userTypes, deptTypes) {

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
    image: '',
    departmenttype: ''
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

  $scope.userTypeList = userTypes;
  $scope.deptTypeList = deptTypes;

  $scope.register = function () {
    var usertype = $('#usertype').val();
    var depttype = $('#department').val();

    $scope.user.departmenttype = depttype;
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
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


app.controller('sliderCtrl', ['$scope', 'sliderService', 'slides', 'fileUpload', function ($scope, sliderService, slides, fileUpload) {

  $scope.slideslist = slides;

  $(document).ready(function () {
    $('.modal').modal();
  });

  $scope.update = function (slide) {
    sliderService.update(slide).then(function (res) {
      Materialize.toast(res.data.message, 2000, 'green');
    }, function (err) {
      Materialize.toast(err.data.message, 2000, 'red');
    });
  };

  $scope.create = function (slide) {
    sliderService.create(slide).then(function (res) {
      $scope.slideslist.push(slide);
      $scope.$apply();
      Materialize.toast(res.data.message, 2000, 'green');
    }, function (err) {
      Materialize.toast(err.data.message, 2000, 'red');
    });
  };

  $scope.remove = function (id) {
    sliderService.delete(id).then(function (res) {
      $scope.slideslist.forEach(function (slide) {
        if (slide._id === id) {
          $scope.slideslist.pop(slide);
        }
      });
      Materialize.toast(res.data.message, 2000, 'green');
    }, function (err) {
      Materialize.toast(err.data.message, 2000, 'red');
    });
  };

  $scope.modal = {};
  $scope.showmodal = function (slide) {
    $scope.modal.slide = slide;
    $('#slidermodal').modal('open');
  };
  $scope.closemodal = function () {
    $('#slidermodal').modal('close');
  };

  $scope.savechanges = function (slide) {
    sliderService.update(slide).then(function (res) {
      Materialize.toast(res.data.message, 2000, 'green');
      $('#slidermodal').modal('close');
    }, function (err) {
      Materialize.toast(err.data.message, 2000, 'red');
    });
  };
  $scope.createnew = function () {
    $scope.modal.slide = {};
    $scope.modal.slide.new = true;
    $('#slidermodal').modal('open');
  };

  $scope.uploadImage = function () {

    var file = $scope.file;
    console.log(file);
    console.log('file is ' + file);
    var uploadUrl = "slide/uploadImage";
    fileUpload.uploadFileToUrl(file, uploadUrl).then(function (res) {
      $scope.modal.slide.image = res.data.path;
      Materialize.toast("Image Uploaded Successfully!", 3000, "green");
    }, function (err) {
      console.log(err);
      Materialize.toast("Error while uploading image", 3000, "red");
    });
  };
}]);

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


app.factory('sliderService', ['$http', 'authService', function ($http, authService) {
  var obj = {};

  obj.getAll = function () {
    return $http.get('/slide/all', { headers: { 'Authorization': 'Bearer ' + authService.getToken() } });
  };

  obj.get = function (id) {
    return $http.get('/slide/' + id, { headers: { 'Authorization': 'Bearer ' + authService.getToken() } });
  };

  obj.update = function (slide) {
    console.log(slide);
    return $http.put('/slide/' + slide._id, slide, { headers: { 'Authorization': 'Bearer ' + authService.getToken() } });
  };

  obj.create = function (slide) {
    return $http.post('/slide/create', slide, { headers: { 'Authorization': 'Bearer ' + authService.getToken() } });
  };

  obj.delete = function (id) {
    return $http.delete('/slide/' + id, { headers: { 'Authorization': 'Bearer ' + authService.getToken() } });
  };

  obj.upload = function (image) {
    return $http.post('/slide/uploadImage', image, { headers: { 'Authorization': 'Bearer ' + authService.getToken() } });
  };
  return obj;
}]);

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


app.controller('tokenCtrl', ['$scope', 'deptTypes', 'tokenService', function ($scope, deptTypes, tokenService) {
  $scope.deptTypesList = deptTypes;

  $scope.token = {
    tokennumber: '',
    visitorname: '',
    phoneno: '',
    department: '',
    description: '',
    createdby: ''

  };
  var randomGenerator = function randomGenerator() {
    var x = (20 * Math.random()).toString();
    var arr = x.split("");
    return arr[x.length - 1] + arr[x.length - 2] + arr[x.length - 3] + arr[x.length - 4];
  };

  angular.element(document).ready(function () {

    $('select').material_select();
  });

  $scope.generateToken = function () {
    $scope.token.department = $('#department').val();

    console.log($scope.token.department);
    if (!$scope.token.visitorname || !$scope.token.department) {
      Materialize.toast("Please fill all the fields", 3000, "red");
      return;
    }

    $scope.token.tokennumber = randomGenerator();

    tokenService.createToken($scope.token).then(function (data) {
      Materialize.toast("Successfully created token", 3000, "green");
    }, function (err) {
      Materialize.toast("Error while creating the token", 3000, 'red');
    });
  };
}]);

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


app.factory('tokenService', ['$http', 'authService', function ($http, authService) {

  var obj = {
    tokenlist: []
  };
  obj.fetchTodayToken = function () {
    var wardno = authService.wardno();
    return $http.get('/token/today/' + wardno, {
      headers: {
        'Authorization': 'Bearer ' + authService.getToken()
      }
    });
  };

  obj.todayTokens = function () {
    return $http.get('/token/today/' + authService.wardno(), {
      headers: {
        'Authorization': 'Bearer ' + authService.getToken()
      }
    }).then(function (res) {
      obj.tokenlist = res.data;
      return res.data;
    });
  };

  obj.handleToken = function (tokenid) {
    return $http.put('/token/handle/' + tokenid + '/' + authService.currentUserId(), {}, {
      headers: {
        'Authorization': 'Bearer ' + authService.getToken()
      }
    });
  };

  obj.completeHandling = function (tokenid) {
    return $http.put('/token/handled/' + tokenid + '/' + authService.currentUserId(), {}, {
      headers: {
        'Authorization': 'Bearer ' + authService.getToken()
      }
    });
  };

  obj.createToken = function (token) {
    console.log(authService.wardno());
    token.createdby = authService.currentUserId();
    token.wardno = authService.wardno();
    return $http.post('/token/create', token, {
      headers: {
        'Authorization': 'Bearer ' + authService.getToken()
      }
    });
  };

  return obj;
}]);

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


app.factory('userService', ['$http', '$window', 'authService', function ($http, $window, authService) {

  var user = {};

  user.getAllUsers = function () {
    return $http.get('/user/list', { headers: { 'Authorization': 'Bearer ' + authService.getToken() } }).then(function (res) {

      return res.data;
    });
  };

  user.getUserDetails = function () {
    return $http.get('/user/' + authService.currentUserId(), { headers: { 'Authorization': 'Bearer ' + authService.getToken() } });
  };

  user.getAllUserTypes = function () {
    return $http.get('/userType/list', { headers: { 'Authorization': 'Bearer ' + authService.getToken() } }).then(function (res) {
      return res.data;
    });
  };

  user.register = function (data) {

    return $http.post('/register', data);
  };

  user.setUserType = function (data) {
    return $http.put('/userType/' + data.userid + '/' + data.usertypeid, {}, { headers: { 'Authorization': 'Bearer ' + authService.getToken() } });
  };

  user.getAllDepartment = function () {
    return $http.get('/departmenttype/list', { headers: { 'Authorization': 'Bearer ' + authService.getToken() } }).then(function (res) {
      return res.data;
    });
  };

  user.setDepartmentType = function () {
    return $http.put('/departmenttype/' + data.userid + '/' + data.departmentype.id, {}, { headers: { 'Authorization': 'Bearer ' + authService.getToken() } });
  };

  user.updateUser = function (user) {
    return $http.put('/user/' + authService.currentUserId(), user, { headers: { 'Authorization': 'Bearer ' + authService.getToken() } });
  };
  return user;
}]);

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNDQ2MzQ0MmJlOWYxN2Q1MjI2ODIiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2phdmFzY3JpcHRzL212Yy9hdHRlbmRhbmNlQ3RybC5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvamF2YXNjcmlwdHMvbXZjL2F0dGVuZGFuY2VTZXJ2aWNlLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9qYXZhc2NyaXB0cy9tdmMvYXV0aFNlcnZpY2UuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2phdmFzY3JpcHRzL212Yy9maW5nZXJQcmludEN0cmwuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2phdmFzY3JpcHRzL212Yy9maW5nZXJQcmludFNlcnZpY2UuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2phdmFzY3JpcHRzL212Yy9ob21lQ3RybC5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvamF2YXNjcmlwdHMvbXZjL2hvbWVTZXJ2aWNlLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9qYXZhc2NyaXB0cy9tdmMvbG9naW5DdHJsLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9qYXZhc2NyaXB0cy9tdmMvbmF2Q3RybC5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvamF2YXNjcmlwdHMvbXZjL3B1c2hOb3RpZmljYXRpb24uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3dlYnNvY2tldC9saWIvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvd2Vic29ja2V0L2xpYi92ZXJzaW9uLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy93ZWJzb2NrZXQvcGFja2FnZS5qc29uIiwid2VicGFjazovLy8uL25vdGlmaWNhdGlvbi9tZXNzYWdldHlwZS5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvamF2YXNjcmlwdHMvbXZjL3JlZ2lzdGVyVXNlckN0cmwuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2phdmFzY3JpcHRzL212Yy9zbGlkZXJDdHJsLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9qYXZhc2NyaXB0cy9tdmMvc2xpZGVyU2VydmljZS5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvamF2YXNjcmlwdHMvbXZjL3Rva2VuQ3RybC5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvamF2YXNjcmlwdHMvbXZjL3Rva2VuU2VydmljZS5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvamF2YXNjcmlwdHMvbXZjL3VzZXJTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbImFwcCIsImNvbnRyb2xsZXIiLCIkc2NvcGUiLCJhdHRlbmRTZXJ2aWNlIiwiZmluZ2VyUHJpbnRTZXJ2aWNlIiwiYXV0aFNlcnZpY2UiLCIkIiwiZG9jdW1lbnQiLCJyZWFkeSIsIm1vZGFsIiwiYXR0ZW5kIiwidmVyaWZ5IiwidGhlbiIsInJlcyIsImRhdGEiLCJ1c2VyaWQiLCJkYXRlIiwiRGF0ZSIsInRvRGF0ZVN0cmluZyIsImNvbnNvbGUiLCJsb2ciLCJ1c2VyIiwiTWF0ZXJpYWxpemUiLCJ0b2FzdCIsInNldFRpbWVvdXQiLCJlcnIiLCJzdGF0dXMiLCJmYWN0b3J5IiwiJGh0dHAiLCJvYmoiLCJwb3N0IiwiZ2V0QXR0ZW5kIiwidHlwZSIsImdldCIsImdldExhc3RBdHRlbmQiLCJkYXlzIiwiJHdpbmRvdyIsImF1dGgiLCJzYXZlVG9rZW4iLCJ0b2tlbiIsImxvY2FsU3RvcmFnZSIsImdldFRva2VuIiwiaXNMb2dnZWRJbiIsInBheWxvYWQiLCJKU09OIiwicGFyc2UiLCJhdG9iIiwic3BsaXQiLCJleHAiLCJub3ciLCJjdXJyZW50VXNlciIsInVzZXJuYW1lIiwiY3VycmVudFVzZXJJZCIsIl9pZCIsIndhcmRubyIsImhhc1Blcm1pc3Npb24iLCJwZXJtaXNzaW9uIiwicGVybWlzc2lvbnMiLCJpbmNsdWRlcyIsInJlZ2lzdGVyIiwic3VjY2VzcyIsImxvZ0luIiwiaGFzUGVybWlzc2lvbkZvciIsInN0YXRlbmFtZSIsImxvZ091dCIsInJlbW92ZUl0ZW0iLCJ1c2VyU2VydmljZSIsInVzZXJzIiwidXNlcmxpc3QiLCJjbGVhciIsImZhaWxlZCIsImNoYW5nZSIsIiRhcHBseSIsImFuZ3VsYXIiLCJlbGVtZW50IiwibWF0ZXJpYWxfc2VsZWN0IiwidmFsIiwibm90aWZpY2F0aW9uU2VydmljZSIsInNsaWRlcyIsImNvbm5lY3QiLCJtZXNzYWdlIiwib25tZXNzYWdlIiwic2xpZGVzbGlzdCIsInNsaWRlQWxpZ24iLCJjYWxsZWR0b2tlbiIsImNhcm91c2VsIiwiZnVsbFdpZHRoIiwic2xpZGVyIiwidG9rZW5jYWxsZWQiLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwiJHN0YXRlIiwibG9naW4iLCJwYXNzd29yZCIsImdvIiwicmVsb2FkIiwidG9rZW5TZXJ2aWNlIiwiZmlsZVVwbG9hZCIsImRyb3Bkb3duIiwiaW5EdXJhdGlvbiIsIm91dER1cmF0aW9uIiwiY29uc3RyYWluV2lkdGgiLCJndXR0ZXIiLCJiZWxvd09yaWdpbiIsImFsaWdubWVudCIsInN0b3BQcm9wYWdhdGlvbiIsInNob3dIaWRlTWVudSIsInNpZGVOYXYiLCJ1c2VyQ3JlZCIsImVycm9yIiwibG9nb3V0IiwidG9kYXlUb2tlbnMiLCJ0b2tlbmxpc3QiLCJ0b2tlbmFkZGVkIiwicHVzaCIsImdldFVzZXJEZXRhaWxzIiwicHJvZmlsZXBpYyIsImltYWdlIiwiY2FsbFRva2VuIiwidG9rZW5pZCIsImhhbmRsZVRva2VuIiwiZm9yRWFjaCIsImkiLCJoYW5kbGVkYnkiLCJtYXJrRG9uZSIsImNvbXBsZXRlSGFuZGxpbmciLCJzcGxpY2UiLCJmaXJzdG5hbWUiLCJsYXN0bmFtZSIsImVtYWlsIiwicGhvbmVubyIsImFkZHJlc3MiLCJzaG93cHJvZmlsZW1vZGFsIiwiJG51bWJlckRlY2ltYWwiLCJ1cGRhdGVUZXh0RmllbGRzIiwidXBsb2FkSW1hZ2UiLCJmaWxlIiwidXBsb2FkVXJsIiwidXBsb2FkRmlsZVRvVXJsIiwicGF0aCIsImNsb3NlcHJvZmlsZW1vZGFsIiwic2F2ZWNoYW5nZXMiLCJ1cGRhdGVVc2VyIiwid2ViU29ja2V0IiwiY29ubmVjdGlvbiIsImhhbmRsZU1lc3NhZ2UiLCJtZXNzYWdlVHlwZSIsIkJST0FEQ0FTVCIsIlRPS0VOQURERUQiLCJUT0tFTlJFTU9WRUQiLCJ0b2tlbnJlbW92ZWQiLCJUT0tFTkNBTExFRCIsImNhbGxiYWNrIiwiV2ViU29ja2V0Iiwib25vcGVuIiwic2VuZCIsInVwbG9hZGVkIiwiTWVzc2FnZVR5cGUiLCJ1c2VyVHlwZXMiLCJkZXB0VHlwZXMiLCJpbWFnZVNyYyIsImVtcGxveWVlaWQiLCJkZXBhcnRtZW50dHlwZSIsInVzZXJUeXBlTGlzdCIsImRlcHRUeXBlTGlzdCIsInVzZXJ0eXBlIiwiZGVwdHR5cGUiLCJzZXRVc2VyVHlwZSIsImlkIiwidXNlcnR5cGVpZCIsImNhdGNoIiwiZGlyZWN0aXZlIiwic2NvcGUiLCJmaWxlaW5wdXQiLCJmaWxlcHJldmlldyIsImxpbmsiLCJhdHRyaWJ1dGVzIiwiYmluZCIsImNoYW5nZUV2ZW50IiwidGFyZ2V0IiwiZmlsZXMiLCJyZWFkZXIiLCJGaWxlUmVhZGVyIiwib25sb2FkIiwibG9hZEV2ZW50IiwicmVzdWx0IiwicmVhZEFzRGF0YVVSTCIsInNlcnZpY2UiLCJmZCIsIkZvcm1EYXRhIiwiYXBwZW5kIiwidHJhbnNmb3JtUmVxdWVzdCIsImlkZW50aXR5IiwiaGVhZGVycyIsInVuZGVmaW5lZCIsInNsaWRlclNlcnZpY2UiLCJ1cGRhdGUiLCJzbGlkZSIsImNyZWF0ZSIsInJlbW92ZSIsImRlbGV0ZSIsInBvcCIsInNob3dtb2RhbCIsImNsb3NlbW9kYWwiLCJjcmVhdGVuZXciLCJuZXciLCJnZXRBbGwiLCJwdXQiLCJ1cGxvYWQiLCJkZXB0VHlwZXNMaXN0IiwidG9rZW5udW1iZXIiLCJ2aXNpdG9ybmFtZSIsImRlcGFydG1lbnQiLCJkZXNjcmlwdGlvbiIsImNyZWF0ZWRieSIsInJhbmRvbUdlbmVyYXRvciIsIngiLCJNYXRoIiwicmFuZG9tIiwidG9TdHJpbmciLCJhcnIiLCJsZW5ndGgiLCJnZW5lcmF0ZVRva2VuIiwiY3JlYXRlVG9rZW4iLCJmZXRjaFRvZGF5VG9rZW4iLCJnZXRBbGxVc2VycyIsImdldEFsbFVzZXJUeXBlcyIsImdldEFsbERlcGFydG1lbnQiLCJzZXREZXBhcnRtZW50VHlwZSIsImRlcGFydG1lbnR5cGUiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3REFBLElBQUlDLFVBQUosQ0FBZSxnQkFBZixFQUFpQyxDQUFDLFFBQUQsRUFBVyxtQkFBWCxFQUFnQyxvQkFBaEMsRUFBcUQsYUFBckQsRUFBb0UsVUFBU0MsTUFBVCxFQUFpQkMsYUFBakIsRUFBZ0NDLGtCQUFoQyxFQUFvREMsV0FBcEQsRUFBZ0U7O0FBRW5LQyxJQUFFQyxRQUFGLEVBQVlDLEtBQVosQ0FBa0IsWUFBVTtBQUMxQkYsTUFBRSxRQUFGLEVBQVlHLEtBQVo7QUFDRCxHQUZEO0FBR0ZQLFNBQU9RLE1BQVAsR0FBZ0IsWUFBVTtBQUN4Qk4sdUJBQW1CTyxNQUFuQixHQUE0QkMsSUFBNUIsQ0FBaUMsVUFBU0MsR0FBVCxFQUFhOztBQUU1QyxVQUFJQyxPQUFPLEVBQVg7QUFHQUEsV0FBS0MsTUFBTCxHQUFjRixJQUFJQyxJQUFKLENBQVNDLE1BQXZCO0FBQ0FELFdBQUtFLElBQUwsR0FBWSxJ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TW1MLEdBQU4sQ0FBVSxXQUFTMU0sWUFBWStDLGFBQVosRUFBbkIsRUFBZ0QvQixJQUFoRCxFQUFzRCxFQUFDNEssU0FBUSxFQUFDLGlCQUFnQixZQUFVNUwsWUFBWW9DLFFBQVosRUFBM0IsRUFBVCxFQUF0RCxDQUFQO0FBQ0QsR0FGRDtBQUdBLFNBQU9wQixJQUFQO0FBQ0QsQ0E3QzBCLENBQTNCLEUiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiRjpcXFxcUHJvamVjdHNcXFxcS2Fua2FpTXVuaWNpcGFsaXR5XFxcXHNyY1xcXFxwdWJsaWNcXFxcamF2YXNjcmlwdHNcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA0NDYzNDQyYmU5ZjE3ZDUyMjY4MiIsImFwcC5jb250cm9sbGVyKCdhdHRlbmRhbmNlQ3RybCcsIFsnJHNjb3BlJywgJ2F0dGVuZGFuY2VTZXJ2aWNlJywgJ2ZpbmdlclByaW50U2VydmljZScsJ2F1dGhTZXJ2aWNlJywgZnVuY3Rpb24oJHNjb3BlLCBhdHRlbmRTZXJ2aWNlLCBmaW5nZXJQcmludFNlcnZpY2UgLGF1dGhTZXJ2aWNlKXtcblxuICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICQoJy5tb2RhbCcpLm1vZGFsKCk7XG4gIH0pXG4kc2NvcGUuYXR0ZW5kID0gZnVuY3Rpb24oKXtcbiAgZmluZ2VyUHJpbnRTZXJ2aWNlLnZlcmlmeSgpLnRoZW4oZnVuY3Rpb24ocmVzKXtcblxuICAgIHZhciBkYXRhID0ge1xuXG4gICAgfVxuICAgIGRhdGEudXNlcmlkID0gcmVzLmRhdGEudXNlcmlkO1xuICAgIGRhdGEuZGF0ZSA9IG5ldyBEYXRlKCkudG9EYXRlU3RyaW5nKCk7XG5cbiAgICBhdHRlbmRTZXJ2aWNlLmF0dGVuZChkYXRhKS50aGVuKGZ1bmN0aW9uKHJlcyl7XG4gICAgICBjb25zb2xlLmxvZyhyZXMuZGF0YSk7XG4gICAgICAkc2NvcGUudXNlciA9IHJlcy5kYXRhO1xuICAgICAgTWF0ZXJpYWxpemUudG9hc3QoXCJBdHRlbmRhbmNlIGRvbmUgIVwiLCAzMDAwLCAnZ3JlZW4nKTtcbiAgICAgICQoJyN1c2VyZGV0YWlsJykubW9kYWwoJ29wZW4nKTtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnI3VzZXJkZXRhaWwnKS5tb2RhbCgnY2xvc2UnKTtcbiAgICAgIH0sXG4gICAgICA1MDAwKVxuICAgIH0sIGZ1bmN0aW9uKGVycil7XG4gICAgICAgTWF0ZXJpYWxpemUudG9hc3QoXCJFcnJvciBvY2N1cnJlZCAhXCIsIDMwMDAsICdyZWQnKTtcbiAgICB9KVxuXG5cbiAgfSwgZnVuY3Rpb24oZXJyKXtcblxuICAgIGlmKGVyci5zdGF0dXM9PTQwNCl7XG4gICAgICBNYXRlcmlhbGl6ZS50b2FzdChcIkZpbmdlciBQcmludCBOb3QgUmVnaXN0ZXJlZCAhXCIsIDMwMDAsICdyZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgTWF0ZXJpYWxpemUudG9hc3QoXCJFcnJvciBPY2N1cnJlZCAhXCIsIDMwMDAsICdyZWQnKTtcbiAgICB9XG4gIH0pXG5cbn1cbn1dKVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vcHVibGljL2phdmFzY3JpcHRzL212Yy9hdHRlbmRhbmNlQ3RybC5qcyIsImFwcC5mYWN0b3J5KCdhdHRlbmRhbmNlU2VydmljZScsIFsnJGh0dHAnLCBmdW5jdGlvbigkaHR0cCl7XG5cbiAgdmFyIG9iaiA9IHt9O1xuXG4gIG9iai5hdHRlbmQgPSBmdW5jdGlvbihkYXRhKXtcbiAgICByZXR1cm4gJGh0dHAucG9zdCgnL2F0dGVuZGFuY2UvYXR0ZW5kJyxkYXRhKTtcbiAgfVxuXG4gIG9iai5nZXRBdHRlbmQgPSBmdW5jdGlvbih1c2VyaWQsIHR5cGU9XCJ0b2RheVwiKXtcbiAgICAgIHJldHVybiAkaHR0cC5nZXQoYC9hdHRlbmRhbmNlLyR7dXNlcmlkfWApO1xuICB9XG5cbiAgb2JqLmdldExhc3RBdHRlbmQgPSBmdW5jdGlvbihkYXlzKXtcbiAgICAvL1RPRE86IEZldGNoIGF0dGVuZGFuY2Ugb2YgcGFzdCBzcGVjaWZpZWQgZGF5cy5cbiAgfVxuXG5cbiAgcmV0dXJuIG9iajtcbn1dKVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vcHVibGljL2phdmFzY3JpcHRzL212Yy9hdHRlbmRhbmNlU2VydmljZS5qcyIsImFwcC5mYWN0b3J5KCdhdXRoU2VydmljZScsIFsnJGh0dHAnLCAnJHdpbmRvdycsIGZ1bmN0aW9uICgkaHR0cCwgJHdpbmRvdykge1xuXG4gIHZhciBhdXRoID0ge307XG5cbiAgYXV0aC5zYXZlVG9rZW4gPSBmdW5jdGlvbiAodG9rZW4pIHtcbiAgICAkd2luZG93LmxvY2FsU3RvcmFnZVsna2Fua2FpJ109IHRva2VuO1xuICB9XG5cbiAgYXV0aC5nZXRUb2tlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJHdpbmRvdy5sb2NhbFN0b3JhZ2VbJ2thbmthaSddO1xuICB9XG5cbiAgYXV0aC5pc0xvZ2dlZEluID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB0b2tlbiA9IGF1dGguZ2V0VG9rZW4oKTtcblxuICAgIGlmICh0b2tlbikge1xuICAgICAgdmFyIHBheWxvYWQgPSBKU09OLnBhcnNlKCR3aW5kb3cuYXRvYih0b2tlbi5zcGxpdCgnLicpWzFdKSk7XG5cbiAgICAgIHJldHVybiBwYXlsb2FkLmV4cCA+IERhdGUubm93KCkgLyAxMDAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZyhcIk5vdCBsb2dnZWQgSW5cIik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9O1xuXG4gIGF1dGguY3VycmVudFVzZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGF1dGguaXNMb2dnZWRJbigpKSB7XG4gICAgICB2YXIgdG9rZW4gPSBhdXRoLmdldFRva2VuKCk7XG4gICAgICB2YXIgcGF5bG9hZCA9IEpTT04ucGFyc2UoJHdpbmRvdy5hdG9iKHRva2VuLnNwbGl0KCcuJylbMV0pKTtcblxuICAgICAgcmV0dXJuIHBheWxvYWQudXNlcm5hbWU7XG4gICAgfVxuICB9O1xuXG4gIGF1dGguY3VycmVudFVzZXJJZCA9IGZ1bmN0aW9uKCl7XG4gICAgaWYgKGF1dGguaXNMb2dnZWRJbigpKSB7XG4gICAgICB2YXIgdG9rZW4gPSBhdXRoLmdldFRva2VuKCk7XG4gICAgICB2YXIgcGF5bG9hZCA9IEpTT04ucGFyc2UoJHdpbmRvdy5hdG9iKHRva2VuLnNwbGl0KCcuJylbMV0pKTtcbiAgICAgIHJldHVybiBwYXlsb2FkLl9pZDtcbiAgICB9XG4gIH1cblxuICBhdXRoLndhcmRubyA9IGZ1bmN0aW9uKCl7XG4gICAgaWYgKGF1dGguaXNMb2dnZWRJbigpKSB7XG4gICAgICB2YXIgdG9rZW4gPSBhdXRoLmdldFRva2VuKCk7XG4gICAgICB2YXIgcGF5bG9hZCA9IEpTT04ucGFyc2UoJHdpbmRvdy5hdG9iKHRva2VuLnNwbGl0KCcuJylbMV0pKTtcblxuICAgICAgcmV0dXJuIHBheWxvYWQud2FyZG5vO1xuICAgIH1cbiAgfVxuXG4gIGF1dGguaGFzUGVybWlzc2lvbiA9IChwZXJtaXNzaW9uKSA9PiB7XG4gICAgaWYgKGF1dGguaXNMb2dnZWRJbigpKSB7XG4gICAgICB2YXIgdG9rZW4gPSBhdXRoLmdldFRva2VuKCk7XG4gICAgICB2YXIgcGF5bG9hZCA9IEpTT04ucGFyc2UoJHdpbmRvdy5hdG9iKHRva2VuLnNwbGl0KCcuJylbMV0pKTtcblxuICAgICAgcmV0dXJuIHBheWxvYWQucGVybWlzc2lvbnMuaW5jbHVkZXMocGVybWlzc2lvbik7XG4gICAgfVxuICB9XG4gIGF1dGgucmVnaXN0ZXIgPSBmdW5jdGlvbiAodXNlcikge1xuICAgIHJldHVybiAkaHR0cC5wb3N0KCcvcmVnaXN0ZXInLCB1c2VyKS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICBhdXRoLnNhdmVUb2tlbihkYXRhLnRva2VuKTtcbiAgICB9KTtcbiAgfTtcblxuICBhdXRoLmxvZ0luID0gZnVuY3Rpb24gKHVzZXIpIHtcbiAgICByZXR1cm4gJGh0dHAucG9zdCgnL2xvZ2luJywgdXNlcik7XG5cbiAgfTtcblxuICBhdXRoLmhhc1Blcm1pc3Npb25Gb3IgPSBzdGF0ZW5hbWUgPT4ge1xuICAgIHN3aXRjaChzdGF0ZW5hbWUpe1xuICAgICAgY2FzZSAncmVnaXN0ZXJwcmludCc6XG4gICAgICBjYXNlICdyZWdpc3RlcnVzZXInOlxuICAgICAgcmV0dXJuIGF1dGguaGFzUGVybWlzc2lvbigncmVnaXN0ZXJ1c2VyJyk7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBhdXRoLmxvZ091dCA9IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zb2xlLmxvZygnTG9nZ2luZyBvdXQgdXNlcicpO1xuICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2thbmthaScpO1xuICB9XG4gIHJldHVybiBhdXRoO1xufV0pO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vcHVibGljL2phdmFzY3JpcHRzL212Yy9hdXRoU2VydmljZS5qcyIsImFwcC5jb250cm9sbGVyKCdmaW5nZXJQcmludEN0cmwnLCBbJyRzY29wZScsJ2ZpbmdlclByaW50U2VydmljZScsJ3VzZXJTZXJ2aWNlJywndXNlcnMnLGZ1bmN0aW9uKCRzY29wZSxmaW5nZXJQcmludFNlcnZpY2UsdXNlclNlcnZpY2UsIHVzZXJzKXtcblxuXG4gIGNvbnNvbGUubG9nKHVzZXJzKTtcbiAgJHNjb3BlLnVzZXJsaXN0ICA9IHVzZXJzO1xuICAkc2NvcGUudXNlcmlkPScnO1xuXG5cbiAgJHNjb3BlLnJlZ2lzdGVyID0geydzdWNjZXNzJzonJywgJ2ZhaWxlZCc6Jyd9O1xuXG4gICRzY29wZS52ZXJpZnk9IHsnc3VjY2Vzcyc6JycsJ2ZhaWxlZCc6Jyd9O1xuXG5cblxuICB2YXIgY2xlYXIgPSBmdW5jdGlvbigpe1xuXG4gICAgJHNjb3BlLnZlcmlmeS5zdWNjZXNzPWZhbHNlO1xuICAgICRzY29wZS52ZXJpZnkuZmFpbGVkPWZhbHNlO1xuICAgICRzY29wZS5yZWdpc3Rlci5zdWNjZXNzPWZhbHNlO1xuICAgICRzY29wZS5yZWdpc3Rlci5mYWlsZWQ9ZmFsc2U7XG5cbiAgfVxuICBjbGVhcigpO1xuXG4gICQoJyN1c2VyaWQnKS5jaGFuZ2UoZnVuY3Rpb24oKXtcbiAgICAgIGNsZWFyKCk7XG4gICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gIH0pO1xuXG4gIGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICQoJy5tb2RhbCcpLm1vZGFsKCk7XG4gICAgJCgnc2VsZWN0JykubWF0ZXJpYWxfc2VsZWN0KCk7XG4gICAgfSk7XG5cblxuXG5cbiRzY29wZS5yZWdpc3RlciA9IGZ1bmN0aW9uKCl7XG4gICAkc2NvcGUudXNlcmlkID0gJChcIiN1c2VyaWRcIikudmFsKCk7XG4gICRzY29wZS5yZWdpc3Rlci5zdWNjZXNzPScnO1xuICAkc2NvcGUucmVnaXN0ZXIuZmFpbGVkPScnO1xuICBpZighJHNjb3BlLnVzZXJpZClcbiAge1xuICAgIE1hdGVyaWFsaXplLnRvYXN0KCdTZWxlY3QgdGhlIHVzZXInLCAzMDAwLCdyZWQnKTtcbiAgICByZXR1cm47XG4gIH1cbiAgZmluZ2VyUHJpbnRTZXJ2aWNlLnJlZ2lzdGVyKCRzY29wZS51c2VyaWQpLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgICBNYXRlcmlhbGl6ZS50b2FzdChcIkZpbmdlciBQcmludCBSZWdpc3RlclwiLCAzMDAwLCBcImdyZWVuXCIpO1xuICAgICRzY29wZS5yZWdpc3Rlci5zdWNjZXNzID0gdHJ1ZTtcbiAgfSwgZnVuY3Rpb24oZXJyKXtcbiAgICBNYXRlcmlhbGl6ZS50b2FzdChcIkVycm9yIG9jY3VycmVkIHdoaWxlIHJlZ2lzdGVyaW5nIGZpbmdlcnByaW50XCIsIDMwMDAsIFwicmVkXCIpO1xuICAgICRzY29wZS5yZWdpc3Rlci5mYWlsZWQgPSB0cnVlO1xuICB9KVxufVxuXG5cblxuJHNjb3BlLnZlcmlmeSA9IGZ1bmN0aW9uKCl7XG4gICRzY29wZS52ZXJpZnkuc3VjY2Vzcz0nJztcbiAgJHNjb3BlLnZlcmlmeS5mYWlsZWQ9Jyc7XG4gIGZpbmdlclByaW50U2VydmljZS52ZXJpZnkoKS50aGVuKGZ1bmN0aW9uKHJlcyl7XG4gICAgTWF0ZXJpYWxpemUudG9hc3QoXCJGaW5nZXIgUHJpbnQgaXMgb2YgXCIrIHJlcy5kYXRhLnVzZXJpZCwgMzAwMCwgXCJncmVlblwiKTtcbiAgICAkc2NvcGUudmVyaWZ5LnN1Y2Nlc3MgPSB0cnVlO1xuICB9LCBmdW5jdGlvbihlcnIpe1xuICAgIE1hdGVyaWFsaXplLnRvYXN0KFwiRXJyb3Igb2NjdXJyZWQgd2hpbGUgcmVhZGluZyBmaW5nZXJwcmludFwiLCAzMDAwLCBcInJlZFwiKTtcbiAgICAkc2NvcGUudmVyaWZ5LmZhaWxlZCA9IHRydWU7XG4gIH0pXG59XG5cblxufV0pO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vcHVibGljL2phdmFzY3JpcHRzL212Yy9maW5nZXJQcmludEN0cmwuanMiLCJhcHAuZmFjdG9yeSgnZmluZ2VyUHJpbnRTZXJ2aWNlJywgWyckaHR0cCcsIGZ1bmN0aW9uKCRodHRwKXtcblxuICB2YXIgb2JqID0ge307XG5cbiAgb2JqLnJlZ2lzdGVyID0gZnVuY3Rpb24odXNlcmlkKXtcbiAgICByZXR1cm4gJGh0dHAucG9zdCgnL3JlZ2lzdGVyUHJpbnQnLCB7J3VzZXJpZCc6dXNlcmlkfSk7XG4gIH1cblxuICBvYmoudmVyaWZ5ID0gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gJGh0dHAucG9zdCgnL3ZlcmlmeVByaW50Jyx7fSk7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufV0pXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wdWJsaWMvamF2YXNjcmlwdHMvbXZjL2ZpbmdlclByaW50U2VydmljZS5qcyIsImFwcC5jb250cm9sbGVyKCdIb21lQ3RybCcsIFsnJHNjb3BlJywgJyRodHRwJywgJ25vdGlmaWNhdGlvblNlcnZpY2UnLCAnc2xpZGVzJywgZnVuY3Rpb24gKCRzY29wZSwgJGh0dHAsIG5vdGlmaWNhdGlvblNlcnZpY2UsIHNsaWRlcykge1xuICBub3RpZmljYXRpb25TZXJ2aWNlLmNvbm5lY3QoZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICBtZXNzYWdlLm9ubWVzc2FnZShmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgY29uc29sZS5sb2cobWVzc2FnZSk7XG4gICAgfSlcbiAgfSk7XG4gICRzY29wZS5zbGlkZXNsaXN0ID0gc2xpZGVzO1xuICAkc2NvcGUuc2xpZGVBbGlnbiA9IFsnbGVmdC1hbGlnbicsICdjZW50ZXItYWxpZ24nLCAncmlnaHQtYWxpZ24nXTtcbiAgJHNjb3BlLmNhbGxlZHRva2VuID0gJyc7XG4gICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAkKCcuY2Fyb3VzZWwuY2Fyb3VzZWwtc2xpZGVyJykuY2Fyb3VzZWwoe1xuICAgICAgZnVsbFdpZHRoOiB0cnVlXG4gICAgfSk7XG4gICAgJCgnLnNsaWRlcicpLnNsaWRlcigpO1xuICB9KTtcblxuICBub3RpZmljYXRpb25TZXJ2aWNlLnRva2VuY2FsbGVkID0gZnVuY3Rpb24gKG1lc3NhZ2UpIHtcbiAgICBNYXRlcmlhbGl6ZS50b2FzdChtZXNzYWdlLCAzMDAwLCBcImdyZWVuXCIpO1xuICAgICQoJyNmaXhlZC1pdGVtJykuYWRkQ2xhc3MoJ3dvYmJsZSBhbmltYXRlZCcpO1xuICAgICRzY29wZS5jYWxsZWR0b2tlbiA9IG1lc3NhZ2U7XG4gICAgJHNjb3BlLiRhcHBseSgpO1xuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAkKCcjZml4ZWQtaXRlbScpLnJlbW92ZUNsYXNzKCd3b2JibGUgYW5pbWF0ZWQnKTtcbiAgICAgICRzY29wZS5jYWxsZWR0b2tlbiA9ICcnO1xuICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgIH0sIDQwMDApO1xuICB9XG5cbn1dKTtcblxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vcHVibGljL2phdmFzY3JpcHRzL212Yy9ob21lQ3RybC5qcyIsImFwcC5mYWN0b3J5KCdIb21lU2VyaXZjZScsWyckaHR0cCcsJ25vdGlmaWNhdGlvblNlcnZpY2UnICxmdW5jdGlvbigkaHR0cCwgbm90aWZpY2F0aW9uU2VydmljZSl7XG5cbn1dKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3B1YmxpYy9qYXZhc2NyaXB0cy9tdmMvaG9tZVNlcnZpY2UuanMiLCJhcHAuY29udHJvbGxlcignTG9naW5DdHJsJyxbJyRzY29wZScsJ2F1dGhTZXJ2aWNlJywnJHN0YXRlJywgZnVuY3Rpb24oJHNjb3BlLCBhdXRoLCRzdGF0ZSl7XG5cbiAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24oKXtcbiAgICBpZighJHNjb3BlLnVzZXJuYW1lICYmICEkc2NvcGUucGFzc3dvcmQpe1xuICAgICAgTWF0ZXJpYWxpemUudG9hc3QoXCJGaWxsIHVwIGFsbCB0aGUgZmllbGRzXCIsIDE1MDAgLFwicmVkXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGF1dGgubG9nSW4oeyd1c2VybmFtZSc6JHNjb3BlLnVzZXJuYW1lLCdwYXNzd29yZCc6JHNjb3BlLnBhc3N3b3JkIH0pLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgICAgIGF1dGguc2F2ZVRva2VuKHJlcy5kYXRhLnRva2VuKTtcbiAgICAgICRzdGF0ZS5nbygnaG9tZScse30se3JlbG9hZDp0cnVlfSk7XG4gIH0sZnVuY3Rpb24ocmVzKXtcbiAgICBNYXRlcmlhbGl6ZS50b2FzdChcIkludmFsaWQgQ3JlZGVudGlhbHNcIiwgMTUwMCAsXCJyZWRcIik7XG4gIH1cbiAgKTtcbiAgfVxuXG5cbn1dKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3B1YmxpYy9qYXZhc2NyaXB0cy9tdmMvbG9naW5DdHJsLmpzIiwiXG5cbmFwcC5jb250cm9sbGVyKCduYXZDdHJsJywgWyckc2NvcGUnLCAnYXV0aFNlcnZpY2UnLCAnJHN0YXRlJywgJ3Rva2VuU2VydmljZScsICdub3RpZmljYXRpb25TZXJ2aWNlJywgJ3VzZXJTZXJ2aWNlJywgJ2ZpbGVVcGxvYWQnLCBmdW5jdGlvbiAoJHNjb3BlLCBhdXRoU2VydmljZSwgJHN0YXRlLCB0b2tlblNlcnZpY2UsIG5vdGlmaWNhdGlvblNlcnZpY2UsIHVzZXJTZXJ2aWNlLCBmaWxlVXBsb2FkKSB7XG5cbiAgbm90aWZpY2F0aW9uU2VydmljZS5jb25uZWN0KCk7XG4gICRzY29wZS5pc0xvZ2dlZEluID0gYXV0aFNlcnZpY2UuaXNMb2dnZWRJbjtcblxuICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG5cblxuICAgICQoJy5tb2RhbCcpLm1vZGFsKCk7XG5cblxuICAgICQoJy5kcm9wZG93bi1idXR0b24nKS5kcm9wZG93bih7XG4gICAgICBpbkR1cmF0aW9uOiAzMDAsXG4gICAgICBvdXREdXJhdGlvbjogMjI1LFxuICAgICAgY29uc3RyYWluV2lkdGg6IGZhbHNlLFxuICAgICAgZ3V0dGVyOiAwLCAvLyBTcGFjaW5nIGZyb20gZWRnZVxuICAgICAgYmVsb3dPcmlnaW46IHRydWUsIC8vIERpc3BsYXlzIGRyb3Bkb3duIGJlbG93IHRoZSBidXR0b25cbiAgICAgIGFsaWdubWVudDogJ2xlZnQnLCAvLyBEaXNwbGF5cyBkcm9wZG93biB3aXRoIGVkZ2UgYWxpZ25lZCB0byB0aGUgbGVmdFxuICAgICAgc3RvcFByb3BhZ2F0aW9uOiBmYWxzZSAvLyBTdG9wcyBldmVudCBwcm9wYWdhdGlvblxuICAgIH0pO1xuICB9KVxuXG4gICRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoISRzY29wZS51c2VybmFtZSB8fCAhJHNjb3BlLnBhc3N3b3JkKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkZpbGwgYWxsIHRoZSBmaWVsZHMuXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuXG4gICAgJHNjb3BlLnNob3dIaWRlTWVudSA9ICgpID0+IHtcbiAgICAgICQoJy5idXR0b24tY29sbGFwc2UnKS5zaWRlTmF2KCdzaG93Jyk7XG5cbiAgICAgICQoJy5idXR0b24tY29sbGFwc2UnKS5zaWRlTmF2KCdoaWRlJyk7XG4gICAgfVxuXG4gICAgdmFyIHVzZXJDcmVkID0ge1xuICAgICAgdXNlcm5hbWU6ICRzY29wZS51c2VybmFtZSxcbiAgICAgIHBhc3N3b3JkOiAkc2NvcGUucGFzc3dvcmRcbiAgICB9O1xuXG4gICAgYXV0aFNlcnZpY2UubG9nSW4odXNlckNyZWQpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgY29uc29sZS5sb2coXCJTdWNjZXNzZnVsbHkgbG9nZ2VkIGluIFwiKTtcbiAgICAgIGNvbnNvbGUubG9nKHJlcy5kYXRhLnRva2VuKTtcbiAgICAgIGF1dGhTZXJ2aWNlLnNhdmVUb2tlbihyZXMuZGF0YS50b2tlbik7XG4gICAgICAkc2NvcGUuaXNMb2dnZWRJbiA9IGF1dGhTZXJ2aWNlLmlzTG9nZ2VkSW4oKTtcbiAgICAgICRzdGF0ZS5nbygnaG9tZScsIHt9LCB7XG4gICAgICAgIHJlbG9hZDogdHJ1ZVxuICAgICAgfSk7XG4gICAgICAkKCcjbG9naW5Nb2RhbCcpLm1vZGFsKCdoaWRlJyk7XG4gICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgY29uc29sZS5sb2coXCJFcnJvciB3aGlsZSBsb2dnaW5nIGluIFwiKTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICB9KTtcbiAgfVxuXG4gICRzY29wZS5sb2dvdXQgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICBhdXRoU2VydmljZS5sb2dPdXQoKTtcbiAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XG5cbiAgfVxuXG5cbiAgdG9rZW5TZXJ2aWNlLnRvZGF5VG9rZW5zKCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICRzY29wZS50b2tlbmxpc3QgPSB0b2tlblNlcnZpY2UudG9rZW5saXN0O1xuICAgIC8vJHNjb3BlLnRva2VubGlzdCA9IGRhdGE7XG4gIH0pO1xuXG4gIG5vdGlmaWNhdGlvblNlcnZpY2UudG9rZW5hZGRlZCA9IGZ1bmN0aW9uICh0b2tlbikge1xuICAgIGNvbnNvbGUubG9nKHRva2VuKTtcbiAgICAkc2NvcGUudG9rZW5saXN0LnB1c2godG9rZW4pO1xuICAgICRzY29wZS4kYXBwbHkoKTtcbiAgfVxuXG4gIHVzZXJTZXJ2aWNlLmdldFVzZXJEZXRhaWxzKCkudGhlbihmdW5jdGlvbihyZXMpe1xuICAgICRzY29wZS5wcm9maWxlcGljID0gXCIvaW1hZ2VzL3VzZXJzL1wiK3Jlcy5kYXRhLmltYWdlO1xuICB9KVxuXG4gICRzY29wZS5jYWxsVG9rZW4gPSBmdW5jdGlvbiAodG9rZW5pZCkge1xuICAgIHRva2VuU2VydmljZS5oYW5kbGVUb2tlbih0b2tlbmlkKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcblxuICAgICAgTWF0ZXJpYWxpemUudG9hc3QoXCJUb2tlbiBDYWxsZWQgXCIsIDIwMDAsIFwiZ3JlZW5cIik7XG4gICAgICAkc2NvcGUudG9rZW5saXN0LmZvckVhY2goKGVsZW1lbnQsIGkpID0+IHtcbiAgICAgICAgaWYgKGVsZW1lbnQuX2lkID09IHRva2VuaWQpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhpKTtcblxuICAgICAgICAgICRzY29wZS50b2tlbmxpc3RbaV0uaGFuZGxlZGJ5ID0gcmVzLmRhdGEuaGFuZGxlZGJ5O1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgTWF0ZXJpYWxpemUudG9hc3QoXCJFcnJvciB3aGlsZSBjYWxsaW5nIHRva2VuXCIsIDIwMDAsIFwicmVkXCIpO1xuICAgIH0pXG4gIH1cblxuICAkc2NvcGUubWFya0RvbmUgPSBmdW5jdGlvbiAodG9rZW5pZCkge1xuICAgIHRva2VuU2VydmljZS5jb21wbGV0ZUhhbmRsaW5nKHRva2VuaWQpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgIE1hdGVyaWFsaXplLnRvYXN0KFwiVG9rZW4gTWFya2VkIGFzIERvbmVcIiwgMjAwMCwgXCJncmVlblwiKTtcbiAgICAgICRzY29wZS50b2tlbmxpc3QuZm9yRWFjaCgoZWxlbWVudCwgaSkgPT4ge1xuICAgICAgICBpZiAoZWxlbWVudC5faWQgPT0gdG9rZW5pZCkge1xuICAgICAgICAgICRzY29wZS50b2tlbmxpc3Quc3BsaWNlKGksIDEpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIE1hdGVyaWFsaXplLnRvYXN0KFwiRXJyb3Igd2hpbGUgY2xvc2luZyB0b2tlblwiLCAyMDAwLCBcInJlZFwiKTtcbiAgICB9KVxuICB9XG5cbiAgJHNjb3BlLnVzZXIgPSB7XG4gICAgZmlyc3RuYW1lOiAnJyxcbiAgICBsYXN0bmFtZTogJycsXG4gICAgaW1hZ2U6ICcnLFxuICAgIGVtYWlsOiAnJyxcbiAgICBwaG9uZW5vOiAnJyxcbiAgICBhZGRyZXNzOiAnJyxcbiAgICBwYXNzd29yZDogJydcbiAgfVxuICAkc2NvcGUuc2hvd3Byb2ZpbGVtb2RhbCA9IGZ1bmN0aW9uICgpIHtcbiAgICB1c2VyU2VydmljZS5nZXRVc2VyRGV0YWlscygpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgJHNjb3BlLnVzZXIgPSByZXMuZGF0YTtcbiAgICAgICRzY29wZS51c2VyLnBob25lbm8gPSByZXMuZGF0YS5waG9uZW5vLiRudW1iZXJEZWNpbWFsO1xuICAgICAgJCgnI21vZGFsMScpLm1vZGFsKCdvcGVuJyk7XG4gICAgICBNYXRlcmlhbGl6ZS51cGRhdGVUZXh0RmllbGRzKCk7XG4gICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICB9KTtcblxuICB9XG5cbiAgJHNjb3BlLnVwbG9hZEltYWdlID0gZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIGZpbGUgPSAkc2NvcGUuZmlsZTtcbiAgICBjb25zb2xlLmxvZyhmaWxlKTtcbiAgICBjb25zb2xlLmxvZygnZmlsZSBpcyAnICsgZmlsZSk7XG4gICAgdmFyIHVwbG9hZFVybCA9IFwiL3VwbG9hZEltYWdlXCI7XG4gICAgZmlsZVVwbG9hZC51cGxvYWRGaWxlVG9VcmwoZmlsZSwgdXBsb2FkVXJsKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICRzY29wZS51c2VyLmltYWdlID0gcmVzLmRhdGEucGF0aDtcbiAgICAgIE1hdGVyaWFsaXplLnRvYXN0KFwiSW1hZ2UgVXBsb2FkZWQgU3VjY2Vzc2Z1bGx5IVwiLCAzMDAwLCBcImdyZWVuXCIpO1xuICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgIE1hdGVyaWFsaXplLnRvYXN0KFwiRXJyb3Igd2hpbGUgdXBsb2FkaW5nIGltYWdlXCIsIDMwMDAsIFwicmVkXCIpO1xuICAgIH0pO1xuICB9O1xuXG4gICRzY29wZS5jbG9zZXByb2ZpbGVtb2RhbCA9IGZ1bmN0aW9uICgpIHtcblxuICB9XG5cblxuICAkc2NvcGUuc2F2ZWNoYW5nZXMgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICB1c2VyU2VydmljZS51cGRhdGVVc2VyKCRzY29wZS51c2VyKS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgIE1hdGVyaWFsaXplLnRvYXN0KFwiVXNlciBwcm9maWxlIHVwZGF0ZWQhXCIsIDIwMDAsICdncmVlbicpO1xuICAgICAgJCgnI21vZGFsMScpLm1vZGFsKCdjbG9zZScpO1xuICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIE1hdGVyaWFsaXplLnRvYXN0KFwiRXJyb3Igd2hpbGUgdXBkYXRpbmcgcHJvZmlsZSFcIiwgMjAwMCwgJ3JlZCcpO1xuICAgIH0pXG4gIH1cbiAgJHNjb3BlLmhhc1Blcm1pc3Npb24gPSBhdXRoU2VydmljZS5oYXNQZXJtaXNzaW9uO1xufV0pXG5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3B1YmxpYy9qYXZhc2NyaXB0cy9tdmMvbmF2Q3RybC5qcyIsImltcG9ydCB7IGNsaWVudCB9IGZyb20gJ3dlYnNvY2tldCc7XG5pbXBvcnQgIE1lc3NhZ2VUeXBlICBmcm9tICcuLi8uLi8uLi9ub3RpZmljYXRpb24vbWVzc2FnZXR5cGUnO1xuXG5cbmNvbnN0IHdlYlNvY2tldCA9IGNsaWVudDtcbnZhciBjb25uZWN0aW9uID0gbnVsbDtcbmFwcC5mYWN0b3J5KCdub3RpZmljYXRpb25TZXJ2aWNlJyxbJ3VzZXJTZXJ2aWNlJywnYXV0aFNlcnZpY2UnLCBmdW5jdGlvbih1c2VyU2VydmljZSwgYXV0aFNlcnZpY2Upe1xuXG4gdmFyIG9iaiA9IHsgfTtcblxuIHZhciBoYW5kbGVNZXNzYWdlID0gZnVuY3Rpb24obWVzc2FnZSl7XG5cbiAgdmFyIGRhdGEgPSBKU09OLnBhcnNlKG1lc3NhZ2UuZGF0YSk7XG4gIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgc3dpdGNoKGRhdGEubWVzc2FnZVR5cGUpe1xuICAgICBjYXNlIE1lc3NhZ2VUeXBlLkJST0FEQ0FTVDpcbiAgICAgLy9UT0RPOiBOb3RpZmljYXRpb25cbiAgICAgYnJlYWs7XG4gICAgIGNhc2UgTWVzc2FnZVR5cGUuVE9LRU5BRERFRDpcbiAgICAgY29uc29sZS5sb2cobWVzc2FnZSk7XG4gICAgIGlmKHR5cGVvZiBvYmoudG9rZW5hZGRlZCA9PT0gJ2Z1bmN0aW9uJyl7XG4gICAgIG9iai50b2tlbmFkZGVkKGRhdGEubWVzc2FnZSk7XG4gICAgIH1cbiAgICAgYnJlYWs7XG4gICAgIGNhc2UgTWVzc2FnZVR5cGUuVE9LRU5SRU1PVkVEOlxuICAgICBpZih0eXBlb2Ygb2JqLnRva2VucmVtb3ZlZCA9PT0gJ2Z1bmN0aW9uJyl7XG4gICAgICBvYmoudG9rZW5yZW1vdmVkKGRhdGEubWVzc2FnZSk7XG4gICAgIH1cbiAgICAgYnJlYWs7XG4gICAgIGNhc2UgTWVzc2FnZVR5cGUuVE9LRU5DQUxMRUQ6XG4gICAgIGlmKHR5cGVvZiBvYmoudG9rZW5jYWxsZWQgPT09ICdmdW5jdGlvbicpe1xuICAgICAgIG9iai50b2tlbmNhbGxlZChkYXRhLm1lc3NhZ2UpO1xuICAgICB9XG4gICB9XG4gfVxuXG4gIG9iai5jb25uZWN0ID0gZnVuY3Rpb24oY2FsbGJhY2spe1xuICAgICAgaWYgKGNvbm5lY3Rpb24gPT09IG51bGwgJiYgYXV0aFNlcnZpY2UuaXNMb2dnZWRJbigpKSB7XG4gICAgICAgIGNvbm5lY3Rpb24gPSBuZXcgV2ViU29ja2V0KCd3czovLzEyNy4wLjAuMTo5MDA5JywgYXV0aFNlcnZpY2UuZ2V0VG9rZW4oKSk7XG5cbiAgICAgICAgY29ubmVjdGlvbi5vbm9wZW4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkNvbm5lY3Rpb24gT3BlblwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbm5lY3Rpb24ub25tZXNzYWdlID0gZnVuY3Rpb24obWVzc2FnZSl7XG5cbiAgICAgICAgICAgIGhhbmRsZU1lc3NhZ2UobWVzc2FnZSk7XG4gICAgICAgIH1cblxuICAgICAgfVxuICAgIH1cblxuIG9iai5zZW5kID0gZnVuY3Rpb24obWVzc2FnZSl7XG5cbiAgIGNvbm5lY3Quc2VuZChtZXNzYWdlKTtcbiB9XG5cbiBvYmoudG9rZW5hZGRlZCA7XG4gb2JqLnRva2VucmVtb3ZlZCA7XG4gb2JqLnVwbG9hZGVkO1xuIG9iai50b2tlbmNhbGxlZDtcblxuICByZXR1cm4gb2JqO1xuXG5cbn1dKVxuXG5cblxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vcHVibGljL2phdmFzY3JpcHRzL212Yy9wdXNoTm90aWZpY2F0aW9uLmpzIiwidmFyIF9nbG9iYWwgPSAoZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSgpO1xudmFyIE5hdGl2ZVdlYlNvY2tldCA9IF9nbG9iYWwuV2ViU29ja2V0IHx8IF9nbG9iYWwuTW96V2ViU29ja2V0O1xudmFyIHdlYnNvY2tldF92ZXJzaW9uID0gcmVxdWlyZSgnLi92ZXJzaW9uJyk7XG5cblxuLyoqXG4gKiBFeHBvc2UgYSBXM0MgV2ViU29ja2V0IGNsYXNzIHdpdGgganVzdCBvbmUgb3IgdHdvIGFyZ3VtZW50cy5cbiAqL1xuZnVuY3Rpb24gVzNDV2ViU29ja2V0KHVyaSwgcHJvdG9jb2xzKSB7XG5cdHZhciBuYXRpdmVfaW5zdGFuY2U7XG5cblx0aWYgKHByb3RvY29scykge1xuXHRcdG5hdGl2ZV9pbnN0YW5jZSA9IG5ldyBOYXRpdmVXZWJTb2NrZXQodXJpLCBwcm90b2NvbHMpO1xuXHR9XG5cdGVsc2Uge1xuXHRcdG5hdGl2ZV9pbnN0YW5jZSA9IG5ldyBOYXRpdmVXZWJTb2NrZXQodXJpKTtcblx0fVxuXG5cdC8qKlxuXHQgKiAnbmF0aXZlX2luc3RhbmNlJyBpcyBhbiBpbnN0YW5jZSBvZiBuYXRpdmVXZWJTb2NrZXQgKHRoZSBicm93c2VyJ3MgV2ViU29ja2V0XG5cdCAqIGNsYXNzKS4gU2luY2UgaXQgaXMgYW4gT2JqZWN0IGl0IHdpbGwgYmUgcmV0dXJuZWQgYXMgaXQgaXMgd2hlbiBjcmVhdGluZyBhblxuXHQgKiBpbnN0YW5jZSBvZiBXM0NXZWJTb2NrZXQgdmlhICduZXcgVzNDV2ViU29ja2V0KCknLlxuXHQgKlxuXHQgKiBFQ01BU2NyaXB0IDU6IGh0dHA6Ly9iY2xhcnkuY29tLzIwMDQvMTEvMDcvI2EtMTMuMi4yXG5cdCAqL1xuXHRyZXR1cm4gbmF0aXZlX2luc3RhbmNlO1xufVxuaWYgKE5hdGl2ZVdlYlNvY2tldCkge1xuXHRbJ0NPTk5FQ1RJTkcnLCAnT1BFTicsICdDTE9TSU5HJywgJ0NMT1NFRCddLmZvckVhY2goZnVuY3Rpb24ocHJvcCkge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShXM0NXZWJTb2NrZXQsIHByb3AsIHtcblx0XHRcdGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBOYXRpdmVXZWJTb2NrZXRbcHJvcF07IH1cblx0XHR9KTtcblx0fSk7XG59XG5cbi8qKlxuICogTW9kdWxlIGV4cG9ydHMuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgICd3M2N3ZWJzb2NrZXQnIDogTmF0aXZlV2ViU29ja2V0ID8gVzNDV2ViU29ja2V0IDogbnVsbCxcbiAgICAndmVyc2lvbicgICAgICA6IHdlYnNvY2tldF92ZXJzaW9uXG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvd2Vic29ja2V0L2xpYi9icm93c2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uL3BhY2thZ2UuanNvbicpLnZlcnNpb247XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy93ZWJzb2NrZXQvbGliL3ZlcnNpb24uanNcbi8vIG1vZHVsZSBpZCA9IDEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0ge1wiX2Zyb21cIjpcIndlYnNvY2tldFwiLFwiX2lkXCI6XCJ3ZWJzb2NrZXRAMS4wLjI1XCIsXCJfaW5CdW5kbGVcIjpmYWxzZSxcIl9pbnRlZ3JpdHlcIjpcInNoYTUxMi1NNThuanZpNlp4VmI1azdrcG5IaDJCdk5LdUJXaXdJWXZzVG9FckJ6V2h2QlpZd2xFaUxjeUxyRzQxVDFqUmNyWTlldHRxUFlFcWR1TEk3dWw1NENWUT09XCIsXCJfbG9jYXRpb25cIjpcIi93ZWJzb2NrZXRcIixcIl9waGFudG9tQ2hpbGRyZW5cIjp7fSxcIl9yZXF1ZXN0ZWRcIjp7XCJ0eXBlXCI6XCJ0YWdcIixcInJlZ2lzdHJ5XCI6dHJ1ZSxcInJhd1wiOlwid2Vic29ja2V0XCIsXCJuYW1lXCI6XCJ3ZWJzb2NrZXRcIixcImVzY2FwZWROYW1lXCI6XCJ3ZWJzb2NrZXRcIixcInJhd1NwZWNcIjpcIlwiLFwic2F2ZVNwZWNcIjpudWxsLFwiZmV0Y2hTcGVjXCI6XCJsYXRlc3RcIn0sXCJfcmVxdWlyZWRCeVwiOltcIiNVU0VSXCIsXCIvXCJdLFwiX3Jlc29sdmVkXCI6XCJodHRwczovL3JlZ2lzdHJ5Lm5wbWpzLm9yZy93ZWJzb2NrZXQvLS93ZWJzb2NrZXQtMS4wLjI1LnRnelwiLFwiX3NoYXN1bVwiOlwiOTk4ZWM3OTBmMGEzZWFjYjhiMDhiNTBhNDM1MDAyNjY5MmExMTk1OFwiLFwiX3NwZWNcIjpcIndlYnNvY2tldFwiLFwiX3doZXJlXCI6XCJGOlxcXFxQcm9qZWN0c1xcXFxLYW5rYWlNdW5pY2lwYWxpdHlcXFxcc3JjXCIsXCJhdXRob3JcIjp7XCJuYW1lXCI6XCJCcmlhbiBNY0tlbHZleVwiLFwiZW1haWxcIjpcImJyaWFuQHdvcmxpemUuY29tXCIsXCJ1cmxcIjpcImh0dHBzOi8vd3d3LndvcmxpemUuY29tL1wifSxcImJyb3dzZXJcIjpcImxpYi9icm93c2VyLmpzXCIsXCJidWdzXCI6e1widXJsXCI6XCJodHRwczovL2dpdGh1Yi5jb20vdGhldHVydGxlMzIvV2ViU29ja2V0LU5vZGUvaXNzdWVzXCJ9LFwiYnVuZGxlRGVwZW5kZW5jaWVzXCI6ZmFsc2UsXCJjb25maWdcIjp7XCJ2ZXJib3NlXCI6ZmFsc2V9LFwiY29udHJpYnV0b3JzXCI6W3tcIm5hbWVcIjpcIknDsWFraSBCYXogQ2FzdGlsbG9cIixcImVtYWlsXCI6XCJpYmNAYWxpYXgubmV0XCIsXCJ1cmxcIjpcImh0dHA6Ly9kZXYuc2lwZG9jLm5ldFwifV0sXCJkZXBlbmRlbmNpZXNcIjp7XCJkZWJ1Z1wiOlwiXjIuMi4wXCIsXCJuYW5cIjpcIl4yLjMuM1wiLFwidHlwZWRhcnJheS10by1idWZmZXJcIjpcIl4zLjEuMlwiLFwieWFldGlcIjpcIl4wLjAuNlwifSxcImRlcHJlY2F0ZWRcIjpmYWxzZSxcImRlc2NyaXB0aW9uXCI6XCJXZWJzb2NrZXQgQ2xpZW50ICYgU2VydmVyIExpYnJhcnkgaW1wbGVtZW50aW5nIHRoZSBXZWJTb2NrZXQgcHJvdG9jb2wgYXMgc3BlY2lmaWVkIGluIFJGQyA2NDU1LlwiLFwiZGV2RGVwZW5kZW5jaWVzXCI6e1wiYnVmZmVyLWVxdWFsXCI6XCJeMS4wLjBcIixcImZhdWNldFwiOlwiXjAuMC4xXCIsXCJndWxwXCI6XCJnaXQraHR0cHM6Ly9naXRodWIuY29tL2d1bHBqcy9ndWxwLmdpdCM0LjBcIixcImd1bHAtanNoaW50XCI6XCJeMi4wLjRcIixcImpzaGludFwiOlwiXjIuMC4wXCIsXCJqc2hpbnQtc3R5bGlzaFwiOlwiXjIuMi4xXCIsXCJ0YXBlXCI6XCJeNC4wLjFcIn0sXCJkaXJlY3Rvcmllc1wiOntcImxpYlwiOlwiLi9saWJcIn0sXCJlbmdpbmVzXCI6e1wibm9kZVwiOlwiPj0wLjEwLjBcIn0sXCJob21lcGFnZVwiOlwiaHR0cHM6Ly9naXRodWIuY29tL3RoZXR1cnRsZTMyL1dlYlNvY2tldC1Ob2RlXCIsXCJrZXl3b3Jkc1wiOltcIndlYnNvY2tldFwiLFwid2Vic29ja2V0c1wiLFwic29ja2V0XCIsXCJuZXR3b3JraW5nXCIsXCJjb21ldFwiLFwicHVzaFwiLFwiUkZDLTY0NTVcIixcInJlYWx0aW1lXCIsXCJzZXJ2ZXJcIixcImNsaWVudFwiXSxcImxpY2Vuc2VcIjpcIkFwYWNoZS0yLjBcIixcIm1haW5cIjpcImluZGV4XCIsXCJuYW1lXCI6XCJ3ZWJzb2NrZXRcIixcInJlcG9zaXRvcnlcIjp7XCJ0eXBlXCI6XCJnaXRcIixcInVybFwiOlwiZ2l0K2h0dHBzOi8vZ2l0aHViLmNvbS90aGV0dXJ0bGUzMi9XZWJTb2NrZXQtTm9kZS5naXRcIn0sXCJzY3JpcHRzXCI6e1wiZ3VscFwiOlwiZ3VscFwiLFwiaW5zdGFsbFwiOlwiKG5vZGUtZ3lwIHJlYnVpbGQgMj4gYnVpbGRlcnJvci5sb2cpIHx8IChleGl0IDApXCIsXCJ0ZXN0XCI6XCJmYXVjZXQgdGVzdC91bml0XCJ9LFwidmVyc2lvblwiOlwiMS4wLjI1XCJ9XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvd2Vic29ja2V0L3BhY2thZ2UuanNvblxuLy8gbW9kdWxlIGlkID0gMTNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY29uc3QgTWVzc2FnZVR5cGUgPSB7XG4gIEJST0FEQ0FTVDogJ2Jyb2FkY2FzdCcsXG4gIFRPS0VOQURERUQ6ICd0b2tlbmFkZGVkJyxcbiAgVE9LRU5SRU1PVkVEOiAndG9rZW5yZW1vdmVkJyxcbiAgVE9LRU5DQUxMRUQ6ICd0b2tlbmNhbGxlZCdcbn1cblxuZXhwb3J0IGRlZmF1bHQgTWVzc2FnZVR5cGU7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9ub3RpZmljYXRpb24vbWVzc2FnZXR5cGUuanMiLCJhcHAuY29udHJvbGxlcigncmVnaXN0ZXJVc2VyQ3RybCcsIFsnJHNjb3BlJywndXNlclNlcnZpY2UnLCdmaWxlVXBsb2FkJywndXNlclR5cGVzJywnZGVwdFR5cGVzJyxmdW5jdGlvbigkc2NvcGUsIHVzZXJTZXJ2aWNlLGZpbGVVcGxvYWQsdXNlclR5cGVzLCBkZXB0VHlwZXMpe1xuXG4gIGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICQoJy5tb2RhbCcpLm1vZGFsKCk7XG4gICAgJCgnc2VsZWN0JykubWF0ZXJpYWxfc2VsZWN0KCk7XG4gICAgfSk7XG5cbiAgICAkc2NvcGUuaW1hZ2VTcmMgPSBcIlwiO1xuICAkc2NvcGUudXNlciA9IHtcbiAgICB1c2VybmFtZTonJyxcbiAgICBwYXNzd29yZDonJyxcbiAgICBmaXJzdG5hbWU6JycsXG4gICAgbGFzdG5hbWU6JycsXG4gICAgZW1wbG95ZWVpZDonJyxcbiAgICB3YXJkbm86JycsXG4gICAgcGhvbmVubzonJyxcbiAgICBlbWFpbDonJyxcbiAgICBhZGRyZXNzOicnLFxuICAgIGltYWdlOicnLFxuICAgIGRlcGFydG1lbnR0eXBlOicnXG4gIH07XG5cbiAgJHNjb3BlLnVwbG9hZEltYWdlID0gZnVuY3Rpb24oKXtcblxuICAgIHZhciBmaWxlID0gJHNjb3BlLmZpbGU7XG4gICAgY29uc29sZS5sb2coZmlsZSk7XG4gICAgY29uc29sZS5sb2coJ2ZpbGUgaXMgJyArIGZpbGUpO1xuICAgIHZhciB1cGxvYWRVcmwgPSBcIi91cGxvYWRJbWFnZVwiO1xuICAgZmlsZVVwbG9hZC51cGxvYWRGaWxlVG9VcmwoZmlsZSwgdXBsb2FkVXJsKS50aGVuKGZ1bmN0aW9uKHJlcyl7XG4gICAgICRzY29wZS51c2VyLmltYWdlID0gcmVzLmRhdGEucGF0aDtcbiAgICBNYXRlcmlhbGl6ZS50b2FzdChcIkltYWdlIFVwbG9hZGVkIFN1Y2Nlc3NmdWxseSFcIiwgMzAwMCwgXCJncmVlblwiKTtcbiAgfSxmdW5jdGlvbigpe1xuICAgIE1hdGVyaWFsaXplLnRvYXN0KFwiRXJyb3Igd2hpbGUgdXBsb2FkaW5nIGltYWdlXCIsIDMwMDAsIFwicmVkXCIpO1xuICB9KTtcbiB9O1xuXG4kc2NvcGUudXNlclR5cGVMaXN0ID0gdXNlclR5cGVzO1xuJHNjb3BlLmRlcHRUeXBlTGlzdCA9IGRlcHRUeXBlcztcblxuICAkc2NvcGUucmVnaXN0ZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdXNlcnR5cGUgPSAkKCcjdXNlcnR5cGUnKS52YWwoKTtcbiAgICB2YXIgZGVwdHR5cGUgPSAkKCcjZGVwYXJ0bWVudCcpLnZhbCgpO1xuXG4gICAgJHNjb3BlLnVzZXIuZGVwYXJ0bWVudHR5cGUgPSBkZXB0dHlwZTtcbiAgICBpZighJHNjb3BlLnVzZXIudXNlcm5hbWUgfHwgISRzY29wZS51c2VyLnBhc3N3b3JkIHx8ICF1c2VydHlwZSl7XG4gICAgICBNYXRlcmlhbGl6ZS50b2FzdChcIlVzZXJuYW1lIGFuZCBQYXNzd29yZCBpcyBjb21wdWxzb3J5ISFcIiwzMDAwLCdyZWQnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdXNlclNlcnZpY2UucmVnaXN0ZXIoJHNjb3BlLnVzZXIpLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgIHVzZXJTZXJ2aWNlLnNldFVzZXJUeXBlKHt1c2VyaWQ6cmVzLmRhdGEuaWQsdXNlcnR5cGVpZDp1c2VydHlwZX0pLnRoZW4oZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgIE1hdGVyaWFsaXplLnRvYXN0KFwiVXNlciBzdWNjZXNzZnVsbHkgcmVnaXN0ZXJlZFwiLDMwMDAsXCJncmVlblwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycil7XG4gICAgICAgIE1hdGVyaWFsaXplLnRvYXN0KFwiRXJyb3Igd2hpbGUgcmVnaXN0ZXJpbmcgdGhlIHVzZXJcIiwzMDAwLFwicmVkXCIpO1xuICAgICAgIH0pXG5cbiAgICB9KS5jYXRjaChmdW5jdGlvbihlcnJvcil7XG4gICAgICBNYXRlcmlhbGl6ZS50b2FzdChcIkVycm9yIHdoaWxlIHJlZ2lzdGVyaW5nIHRoZSB1c2VyXCIsMzAwMCxcInJlZFwiKTtcbiAgICB9KVxuICB9XG5cblxufV0pO1xuXG5cblxuYXBwLmRpcmVjdGl2ZShcImZpbGVpbnB1dFwiLCBbZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgc2NvcGU6IHtcbiAgICAgIGZpbGVpbnB1dDogXCI9XCIsXG4gICAgICBmaWxlcHJldmlldzogXCI9XCJcbiAgICB9LFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRyaWJ1dGVzKSB7XG4gICAgICBlbGVtZW50LmJpbmQoXCJjaGFuZ2VcIiwgZnVuY3Rpb24oY2hhbmdlRXZlbnQpIHtcbiAgICAgICAgc2NvcGUuZmlsZWlucHV0ID0gY2hhbmdlRXZlbnQudGFyZ2V0LmZpbGVzWzBdO1xuICAgICAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKGxvYWRFdmVudCkge1xuICAgICAgICAgIHNjb3BlLiRhcHBseShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNjb3BlLmZpbGVwcmV2aWV3ID0gbG9hZEV2ZW50LnRhcmdldC5yZXN1bHQ7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoc2NvcGUuZmlsZWlucHV0KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufV0pO1xuXG5hcHAuc2VydmljZSgnZmlsZVVwbG9hZCcsIFsnJGh0dHAnLCdhdXRoU2VydmljZScsIGZ1bmN0aW9uICgkaHR0cCxhdXRoU2VydmljZSkge1xuICB0aGlzLnVwbG9hZEZpbGVUb1VybCA9IGZ1bmN0aW9uKGZpbGUsIHVwbG9hZFVybCl7XG4gICAgIHZhciBmZCA9IG5ldyBGb3JtRGF0YSgpO1xuICAgICBmZC5hcHBlbmQoJ2ZpbGUnLCBmaWxlKTtcblxuXG4gICAgIHJldHVybiAkaHR0cC5wb3N0KHVwbG9hZFVybCwgZmQsIHt0cmFuc2Zvcm1SZXF1ZXN0OiBhbmd1bGFyLmlkZW50aXR5LFxuICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiB1bmRlZmluZWQsJ0F1dGhvcml6YXRpb24nOidCZWFyZXIgJysgYXV0aFNlcnZpY2UuZ2V0VG9rZW4oKX19KVxuXG5cbiAgfVxufV0pO1xuXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wdWJsaWMvamF2YXNjcmlwdHMvbXZjL3JlZ2lzdGVyVXNlckN0cmwuanMiLCJhcHAuY29udHJvbGxlcignc2xpZGVyQ3RybCcsIFsnJHNjb3BlJywnc2xpZGVyU2VydmljZScsJ3NsaWRlcycsJ2ZpbGVVcGxvYWQnLCBmdW5jdGlvbigkc2NvcGUsIHNsaWRlclNlcnZpY2UsIHNsaWRlcywgZmlsZVVwbG9hZCl7XG5cbiAgJHNjb3BlLnNsaWRlc2xpc3QgPSBzbGlkZXM7XG5cblxuICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgJCgnLm1vZGFsJykubW9kYWwoKTtcbiAgfSlcblxuICAkc2NvcGUudXBkYXRlID0gZnVuY3Rpb24oc2xpZGUpe1xuICAgIHNsaWRlclNlcnZpY2UudXBkYXRlKHNsaWRlKS50aGVuKGZ1bmN0aW9uKHJlcyl7XG4gICAgICBNYXRlcmlhbGl6ZS50b2FzdChyZXMuZGF0YS5tZXNzYWdlLCAyMDAwLCAnZ3JlZW4nKVxuICAgIH0sIGZ1bmN0aW9uKGVycil7XG4gICAgICBNYXRlcmlhbGl6ZS50b2FzdChlcnIuZGF0YS5tZXNzYWdlLCAyMDAwLCAncmVkJyk7XG4gICAgfSlcbiAgfVxuXG4gICRzY29wZS5jcmVhdGUgPSBmdW5jdGlvbihzbGlkZSl7XG4gICAgc2xpZGVyU2VydmljZS5jcmVhdGUoc2xpZGUpLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgICAgICRzY29wZS5zbGlkZXNsaXN0LnB1c2goc2xpZGUpO1xuICAgICAgJHNjb3BlLiRhcHBseSgpO1xuICAgICAgTWF0ZXJpYWxpemUudG9hc3QocmVzLmRhdGEubWVzc2FnZSwgMjAwMCwgJ2dyZWVuJylcbiAgICB9LCBmdW5jdGlvbihlcnIpe1xuICAgICAgTWF0ZXJpYWxpemUudG9hc3QoZXJyLmRhdGEubWVzc2FnZSwgMjAwMCwgJ3JlZCcpO1xuICAgIH0pXG4gIH1cblxuICAkc2NvcGUucmVtb3ZlID0gZnVuY3Rpb24oaWQpe1xuICAgIHNsaWRlclNlcnZpY2UuZGVsZXRlKGlkKS50aGVuKGZ1bmN0aW9uKHJlcyl7XG4gICAgICAkc2NvcGUuc2xpZGVzbGlzdC5mb3JFYWNoKHNsaWRlPT57XG4gICAgICAgIGlmKHNsaWRlLl9pZCA9PT0gaWQpe1xuICAgICAgICAgICRzY29wZS5zbGlkZXNsaXN0LnBvcChzbGlkZSk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBNYXRlcmlhbGl6ZS50b2FzdChyZXMuZGF0YS5tZXNzYWdlLCAyMDAwLCAnZ3JlZW4nKVxuICAgIH0sIGZ1bmN0aW9uKGVycil7XG4gICAgICBNYXRlcmlhbGl6ZS50b2FzdChlcnIuZGF0YS5tZXNzYWdlLCAyMDAwLCAncmVkJyk7XG4gICAgfSlcbiAgfVxuXG4gICRzY29wZS5tb2RhbCA9IHt9O1xuICAkc2NvcGUuc2hvd21vZGFsID0gZnVuY3Rpb24oc2xpZGUpe1xuICAgICRzY29wZS5tb2RhbC5zbGlkZSA9IHNsaWRlO1xuICAgICQoJyNzbGlkZXJtb2RhbCcpLm1vZGFsKCdvcGVuJyk7XG4gIH1cbiAgJHNjb3BlLmNsb3NlbW9kYWwgPSBmdW5jdGlvbigpe1xuICAgICQoJyNzbGlkZXJtb2RhbCcpLm1vZGFsKCdjbG9zZScpO1xuICB9XG5cbiAgJHNjb3BlLnNhdmVjaGFuZ2VzID0gZnVuY3Rpb24oc2xpZGUpe1xuICAgIHNsaWRlclNlcnZpY2UudXBkYXRlKHNsaWRlKS50aGVuKGZ1bmN0aW9uKHJlcyl7XG4gICAgICBNYXRlcmlhbGl6ZS50b2FzdChyZXMuZGF0YS5tZXNzYWdlLCAyMDAwLCAnZ3JlZW4nKVxuICAgICAgJCgnI3NsaWRlcm1vZGFsJykubW9kYWwoJ2Nsb3NlJyk7XG4gICAgfSwgZnVuY3Rpb24oZXJyKXtcbiAgICAgIE1hdGVyaWFsaXplLnRvYXN0KGVyci5kYXRhLm1lc3NhZ2UsIDIwMDAsICdyZWQnKTtcbiAgICB9KVxuICB9XG4gICRzY29wZS5jcmVhdGVuZXcgPSBmdW5jdGlvbigpe1xuICAgICRzY29wZS5tb2RhbC5zbGlkZSA9IHt9O1xuICAgICRzY29wZS5tb2RhbC5zbGlkZS5uZXcgPSB0cnVlO1xuICAgICQoJyNzbGlkZXJtb2RhbCcpLm1vZGFsKCdvcGVuJyk7XG4gIH1cblxuICAkc2NvcGUudXBsb2FkSW1hZ2UgPSBmdW5jdGlvbigpe1xuXG4gICAgdmFyIGZpbGUgPSAkc2NvcGUuZmlsZTtcbiAgICBjb25zb2xlLmxvZyhmaWxlKTtcbiAgICBjb25zb2xlLmxvZygnZmlsZSBpcyAnICsgZmlsZSk7XG4gICAgdmFyIHVwbG9hZFVybCA9IFwic2xpZGUvdXBsb2FkSW1hZ2VcIjtcbiAgIGZpbGVVcGxvYWQudXBsb2FkRmlsZVRvVXJsKGZpbGUsIHVwbG9hZFVybCkudGhlbihmdW5jdGlvbihyZXMpe1xuICAgICAkc2NvcGUubW9kYWwuc2xpZGUuaW1hZ2UgPSByZXMuZGF0YS5wYXRoO1xuICAgIE1hdGVyaWFsaXplLnRvYXN0KFwiSW1hZ2UgVXBsb2FkZWQgU3VjY2Vzc2Z1bGx5IVwiLCAzMDAwLCBcImdyZWVuXCIpO1xuICB9LGZ1bmN0aW9uKGVycil7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgICBNYXRlcmlhbGl6ZS50b2FzdChcIkVycm9yIHdoaWxlIHVwbG9hZGluZyBpbWFnZVwiLCAzMDAwLCBcInJlZFwiKTtcbiAgfSk7XG4gfTtcbn1dKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3B1YmxpYy9qYXZhc2NyaXB0cy9tdmMvc2xpZGVyQ3RybC5qcyIsImFwcC5mYWN0b3J5KCdzbGlkZXJTZXJ2aWNlJyxbJyRodHRwJywnYXV0aFNlcnZpY2UnLCBmdW5jdGlvbigkaHR0cCwgYXV0aFNlcnZpY2Upe1xuICBjb25zdCBvYmogPSB7fTtcblxuICBvYmouZ2V0QWxsID0gZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiAkaHR0cC5nZXQoJy9zbGlkZS9hbGwnLHtoZWFkZXJzOnsnQXV0aG9yaXphdGlvbic6ICdCZWFyZXIgJysgYXV0aFNlcnZpY2UuZ2V0VG9rZW4oKX19KVxuICB9XG5cbiAgb2JqLmdldCA9IGZ1bmN0aW9uKGlkKXtcbiAgICByZXR1cm4gJGh0dHAuZ2V0KCcvc2xpZGUvJysgaWQsIHtoZWFkZXJzOnsnQXV0aG9yaXphdGlvbic6ICdCZWFyZXIgJysgYXV0aFNlcnZpY2UuZ2V0VG9rZW4oKX19KVxuICB9XG5cbiAgb2JqLnVwZGF0ZSA9IGZ1bmN0aW9uKHNsaWRlKXtcbiAgICBjb25zb2xlLmxvZyhzbGlkZSk7XG4gICAgcmV0dXJuICRodHRwLnB1dCgnL3NsaWRlLycrIHNsaWRlLl9pZCwgc2xpZGUsIHtoZWFkZXJzOnsnQXV0aG9yaXphdGlvbic6ICdCZWFyZXIgJysgYXV0aFNlcnZpY2UuZ2V0VG9rZW4oKX19KVxuICB9XG5cbiAgb2JqLmNyZWF0ZSA9IGZ1bmN0aW9uKHNsaWRlKXtcbiAgICByZXR1cm4gJGh0dHAucG9zdCgnL3NsaWRlL2NyZWF0ZScsIHNsaWRlLCB7aGVhZGVyczp7J0F1dGhvcml6YXRpb24nOiAnQmVhcmVyICcrIGF1dGhTZXJ2aWNlLmdldFRva2VuKCl9fSlcbiAgfVxuXG4gIG9iai5kZWxldGUgPSBmdW5jdGlvbihpZCl7XG4gICAgcmV0dXJuICRodHRwLmRlbGV0ZSgnL3NsaWRlLycrIGlkLCB7aGVhZGVyczp7J0F1dGhvcml6YXRpb24nOiAnQmVhcmVyICcrIGF1dGhTZXJ2aWNlLmdldFRva2VuKCl9fSlcbiAgfVxuXG4gIG9iai51cGxvYWQgPSBmdW5jdGlvbihpbWFnZSl7XG4gICAgcmV0dXJuICRodHRwLnBvc3QoJy9zbGlkZS91cGxvYWRJbWFnZScsIGltYWdlLCB7aGVhZGVyczp7J0F1dGhvcml6YXRpb24nOiAnQmVhcmVyICcrIGF1dGhTZXJ2aWNlLmdldFRva2VuKCl9fSlcbiAgfVxuICByZXR1cm4gb2JqO1xufV0pXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wdWJsaWMvamF2YXNjcmlwdHMvbXZjL3NsaWRlclNlcnZpY2UuanMiLCJcblxuXG5cbmFwcC5jb250cm9sbGVyKCd0b2tlbkN0cmwnLFsnJHNjb3BlJywnZGVwdFR5cGVzJywndG9rZW5TZXJ2aWNlJywgZnVuY3Rpb24oJHNjb3BlLCBkZXB0VHlwZXMsIHRva2VuU2VydmljZSl7XG4gJHNjb3BlLmRlcHRUeXBlc0xpc3QgPSBkZXB0VHlwZXM7XG5cbiAkc2NvcGUudG9rZW4gPSB7XG4gICAgdG9rZW5udW1iZXI6JycsXG4gICAgdmlzaXRvcm5hbWU6JycsXG4gICAgcGhvbmVubzonJyxcbiAgICBkZXBhcnRtZW50OicnLFxuICAgIGRlc2NyaXB0aW9uOicnLFxuICAgIGNyZWF0ZWRieTonJ1xuXG4gfVxuIHZhciByYW5kb21HZW5lcmF0b3IgPSBmdW5jdGlvbigpe1xuICB2YXIgeCA9ICgyMCAqIE1hdGgucmFuZG9tKCkpLnRvU3RyaW5nKCkgO1xuICB2YXIgYXJyID0geC5zcGxpdChcIlwiKTtcbiAgcmV0dXJuIGFyclt4Lmxlbmd0aC0xXSthcnJbeC5sZW5ndGgtMl0rYXJyW3gubGVuZ3RoLTNdK2Fyclt4Lmxlbmd0aC00XTtcbn1cblxuIGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuXG4gICQoJ3NlbGVjdCcpLm1hdGVyaWFsX3NlbGVjdCgpO1xuICB9KTtcblxuICAkc2NvcGUuZ2VuZXJhdGVUb2tlbiA9IGZ1bmN0aW9uKCl7XG4gICAgJHNjb3BlLnRva2VuLmRlcGFydG1lbnQgPSAkKCcjZGVwYXJ0bWVudCcpLnZhbCgpO1xuXG4gICAgY29uc29sZS5sb2coJHNjb3BlLnRva2VuLmRlcGFydG1lbnQpO1xuICAgIGlmKCEkc2NvcGUudG9rZW4udmlzaXRvcm5hbWUgfHwgISRzY29wZS50b2tlbi5kZXBhcnRtZW50KXtcbiAgICAgIE1hdGVyaWFsaXplLnRvYXN0KFwiUGxlYXNlIGZpbGwgYWxsIHRoZSBmaWVsZHNcIiwgMzAwMCwgXCJyZWRcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgJHNjb3BlLnRva2VuLnRva2VubnVtYmVyID0gcmFuZG9tR2VuZXJhdG9yKCk7XG5cbiAgICB0b2tlblNlcnZpY2UuY3JlYXRlVG9rZW4oJHNjb3BlLnRva2VuKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgTWF0ZXJpYWxpemUudG9hc3QoXCJTdWNjZXNzZnVsbHkgY3JlYXRlZCB0b2tlblwiLCAzMDAwLCBcImdyZWVuXCIpO1xuICAgIH0sZnVuY3Rpb24oZXJyKXtcbiAgICAgIE1hdGVyaWFsaXplLnRvYXN0KFwiRXJyb3Igd2hpbGUgY3JlYXRpbmcgdGhlIHRva2VuXCIsIDMwMDAsICdyZWQnKTtcbiAgICB9KTtcblxuICB9XG5cblxuXG5cbn1dKVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vcHVibGljL2phdmFzY3JpcHRzL212Yy90b2tlbkN0cmwuanMiLCJhcHAuZmFjdG9yeSgndG9rZW5TZXJ2aWNlJywgWyckaHR0cCcsICdhdXRoU2VydmljZScsIGZ1bmN0aW9uICgkaHR0cCwgYXV0aFNlcnZpY2UpIHtcblxuICB2YXIgb2JqID0ge1xuICAgIHRva2VubGlzdDogW11cbiAgfVxuICBvYmouZmV0Y2hUb2RheVRva2VuID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB3YXJkbm8gPSBhdXRoU2VydmljZS53YXJkbm8oKTtcbiAgICByZXR1cm4gJGh0dHAuZ2V0KCcvdG9rZW4vdG9kYXkvJyArIHdhcmRubywge1xuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQXV0aG9yaXphdGlvbic6ICdCZWFyZXIgJyArIGF1dGhTZXJ2aWNlLmdldFRva2VuKClcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG9iai50b2RheVRva2VucyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJGh0dHAuZ2V0KCcvdG9rZW4vdG9kYXkvJyArIGF1dGhTZXJ2aWNlLndhcmRubygpLCB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICdBdXRob3JpemF0aW9uJzogJ0JlYXJlciAnICsgYXV0aFNlcnZpY2UuZ2V0VG9rZW4oKVxuICAgICAgfVxuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgb2JqLnRva2VubGlzdCA9IHJlcy5kYXRhO1xuICAgICAgcmV0dXJuIHJlcy5kYXRhXG4gICAgfSk7XG4gIH1cblxuICBvYmouaGFuZGxlVG9rZW4gPSBmdW5jdGlvbiAodG9rZW5pZCkge1xuICAgIHJldHVybiAkaHR0cC5wdXQoJy90b2tlbi9oYW5kbGUvJyArIHRva2VuaWQgKyAnLycgKyBhdXRoU2VydmljZS5jdXJyZW50VXNlcklkKCksIHt9LCB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICdBdXRob3JpemF0aW9uJzogJ0JlYXJlciAnICsgYXV0aFNlcnZpY2UuZ2V0VG9rZW4oKVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgb2JqLmNvbXBsZXRlSGFuZGxpbmcgPSBmdW5jdGlvbiAodG9rZW5pZCkge1xuICAgIHJldHVybiAkaHR0cC5wdXQoJy90b2tlbi9oYW5kbGVkLycgKyB0b2tlbmlkICsgJy8nICsgYXV0aFNlcnZpY2UuY3VycmVudFVzZXJJZCgpLCB7fSwge1xuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQXV0aG9yaXphdGlvbic6ICdCZWFyZXIgJyArIGF1dGhTZXJ2aWNlLmdldFRva2VuKClcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG9iai5jcmVhdGVUb2tlbiA9IGZ1bmN0aW9uICh0b2tlbikge1xuICAgIGNvbnNvbGUubG9nKGF1dGhTZXJ2aWNlLndhcmRubygpKTtcbiAgICB0b2tlbi5jcmVhdGVkYnkgPSBhdXRoU2VydmljZS5jdXJyZW50VXNlcklkKCk7XG4gICAgdG9rZW4ud2FyZG5vID0gYXV0aFNlcnZpY2Uud2FyZG5vKCk7XG4gICAgcmV0dXJuICRodHRwLnBvc3QoJy90b2tlbi9jcmVhdGUnLCB0b2tlbiwge1xuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQXV0aG9yaXphdGlvbic6ICdCZWFyZXIgJyArIGF1dGhTZXJ2aWNlLmdldFRva2VuKClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgcmV0dXJuIG9iajtcbn1dKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3B1YmxpYy9qYXZhc2NyaXB0cy9tdmMvdG9rZW5TZXJ2aWNlLmpzIiwiYXBwLmZhY3RvcnkoJ3VzZXJTZXJ2aWNlJywgWyckaHR0cCcsICckd2luZG93JywnYXV0aFNlcnZpY2UnLCBmdW5jdGlvbiAoJGh0dHAsICR3aW5kb3csYXV0aFNlcnZpY2UpIHtcblxuXG4gIHZhciB1c2VyID0geyAgfTtcblxuICB1c2VyLmdldEFsbFVzZXJzID0gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gJGh0dHAuZ2V0KCcvdXNlci9saXN0Jyx7aGVhZGVyczp7J0F1dGhvcml6YXRpb24nOidCZWFyZXIgJysgYXV0aFNlcnZpY2UuZ2V0VG9rZW4oKX19KS50aGVuKGZ1bmN0aW9uKHJlcyl7XG5cbiAgICAgIHJldHVybiByZXMuZGF0YTtcbiAgICB9KTtcbiAgfVxuXG4gIHVzZXIuZ2V0VXNlckRldGFpbHMgPSBmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuICRodHRwLmdldCgnL3VzZXIvJysgYXV0aFNlcnZpY2UuY3VycmVudFVzZXJJZCgpLCB7aGVhZGVyczp7J0F1dGhvcml6YXRpb24nOidCZWFyZXIgJysgYXV0aFNlcnZpY2UuZ2V0VG9rZW4oKX19KTtcbiAgfVxuXG4gIHVzZXIuZ2V0QWxsVXNlclR5cGVzID0gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gJGh0dHAuZ2V0KCcvdXNlclR5cGUvbGlzdCcsIHtoZWFkZXJzOnsnQXV0aG9yaXphdGlvbic6J0JlYXJlciAnKyBhdXRoU2VydmljZS5nZXRUb2tlbigpfX0pLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgICAgIHJldHVybiByZXMuZGF0YTtcbiAgICB9KTtcbiAgfVxuXG4gIHVzZXIucmVnaXN0ZXIgPSBmdW5jdGlvbihkYXRhKXtcblxuICAgIHJldHVybiAkaHR0cC5wb3N0KCcvcmVnaXN0ZXInLGRhdGEpO1xuICB9XG5cbiAgdXNlci5zZXRVc2VyVHlwZSA9IGZ1bmN0aW9uKGRhdGEpe1xuICAgIHJldHVybiAkaHR0cC5wdXQoJy91c2VyVHlwZS8nK2RhdGEudXNlcmlkKycvJytkYXRhLnVzZXJ0eXBlaWQse30sIHtoZWFkZXJzOnsnQXV0aG9yaXphdGlvbic6J0JlYXJlciAnK2F1dGhTZXJ2aWNlLmdldFRva2VuKCl9fSk7XG4gIH1cblxuICB1c2VyLmdldEFsbERlcGFydG1lbnQgPSBmdW5jdGlvbigpe1xuICAgIHJldHVybiAkaHR0cC5nZXQoJy9kZXBhcnRtZW50dHlwZS9saXN0Jywge2hlYWRlcnM6eydBdXRob3JpemF0aW9uJzonQmVhcmVyICcrYXV0aFNlcnZpY2UuZ2V0VG9rZW4oKX19KS50aGVuKGZ1bmN0aW9uKHJlcyl7XG4gICAgICAgIHJldHVybiByZXMuZGF0YTtcbiAgICB9KTtcbiAgfVxuXG4gIHVzZXIuc2V0RGVwYXJ0bWVudFR5cGUgPSBmdW5jdGlvbigpe1xuICAgIHJldHVybiAkaHR0cC5wdXQoJy9kZXBhcnRtZW50dHlwZS8nK2RhdGEudXNlcmlkKycvJytkYXRhLmRlcGFydG1lbnR5cGUuaWQsIHt9LCB7aGVhZGVyczp7J0F1dGhvcml6YXRpb24nOidCZWFyZXIgJythdXRoU2VydmljZS5nZXRUb2tlbigpfX0pO1xuICB9XG5cbiAgdXNlci51cGRhdGVVc2VyID0gZnVuY3Rpb24odXNlcil7XG4gICAgcmV0dXJuICRodHRwLnB1dCgnL3VzZXIvJythdXRoU2VydmljZS5jdXJyZW50VXNlcklkKCksIHVzZXIsIHtoZWFkZXJzOnsnQXV0aG9yaXphdGlvbic6J0JlYXJlciAnK2F1dGhTZXJ2aWNlLmdldFRva2VuKCl9fSk7XG4gIH1cbiAgcmV0dXJuIHVzZXI7XG59XSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wdWJsaWMvamF2YXNjcmlwdHMvbXZjL3VzZXJTZXJ2aWNlLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==