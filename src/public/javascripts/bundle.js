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
    $('.carousel.carousel-slider').carousel({ fullWidth: true });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgODU0ODM4MDA5N2NhM2U1ZWZhODUiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2phdmFzY3JpcHRzL212Yy9hdHRlbmRhbmNlQ3RybC5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvamF2YXNjcmlwdHMvbXZjL2F0dGVuZGFuY2VTZXJ2aWNlLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9qYXZhc2NyaXB0cy9tdmMvYXV0aFNlcnZpY2UuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2phdmFzY3JpcHRzL212Yy9maW5nZXJQcmludEN0cmwuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2phdmFzY3JpcHRzL212Yy9maW5nZXJQcmludFNlcnZpY2UuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2phdmFzY3JpcHRzL212Yy9ob21lQ3RybC5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvamF2YXNjcmlwdHMvbXZjL2hvbWVTZXJ2aWNlLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9qYXZhc2NyaXB0cy9tdmMvbG9naW5DdHJsLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9qYXZhc2NyaXB0cy9tdmMvbmF2Q3RybC5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvamF2YXNjcmlwdHMvbXZjL3B1c2hOb3RpZmljYXRpb24uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3dlYnNvY2tldC9saWIvYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvd2Vic29ja2V0L2xpYi92ZXJzaW9uLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy93ZWJzb2NrZXQvcGFja2FnZS5qc29uIiwid2VicGFjazovLy8uL25vdGlmaWNhdGlvbi9tZXNzYWdldHlwZS5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvamF2YXNjcmlwdHMvbXZjL3JlZ2lzdGVyVXNlckN0cmwuanMiLCJ3ZWJwYWNrOi8vLy4vcHVibGljL2phdmFzY3JpcHRzL212Yy9zbGlkZXJDdHJsLmpzIiwid2VicGFjazovLy8uL3B1YmxpYy9qYXZhc2NyaXB0cy9tdmMvc2xpZGVyU2VydmljZS5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvamF2YXNjcmlwdHMvbXZjL3Rva2VuQ3RybC5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvamF2YXNjcmlwdHMvbXZjL3Rva2VuU2VydmljZS5qcyIsIndlYnBhY2s6Ly8vLi9wdWJsaWMvamF2YXNjcmlwdHMvbXZjL3VzZXJTZXJ2aWNlLmpzIl0sIm5hbWVzIjpbImFwcCIsImNvbnRyb2xsZXIiLCIkc2NvcGUiLCJhdHRlbmRTZXJ2aWNlIiwiZmluZ2VyUHJpbnRTZXJ2aWNlIiwiYXV0aFNlcnZpY2UiLCIkIiwiZG9jdW1lbnQiLCJyZWFkeSIsIm1vZGFsIiwiYXR0ZW5kIiwidmVyaWZ5IiwidGhlbiIsInJlcyIsImRhdGEiLCJ1c2VyaWQiLCJkYXRlIiwiRGF0ZSIsInRvRGF0ZVN0cmluZyIsImNvbnNvbGUiLCJsb2ciLCJ1c2VyIiwiTWF0ZXJpYWxpemUiLCJ0b2FzdCIsInNldFRpbWVvdXQiLCJlcnIiLCJzdGF0dXMiLCJmYWN0b3J5IiwiJGh0dHAiLCJvYmoiLCJwb3N0IiwiZ2V0QXR0ZW5kIiwidHlwZSIsImdldCIsIiR3aW5kb3ciLCJhdXRoIiwic2F2ZVRva2VuIiwidG9rZW4iLCJsb2NhbFN0b3JhZ2UiLCJnZXRUb2tlbiIsImlzTG9nZ2VkSW4iLCJwYXlsb2FkIiwiSlNPTiIsInBhcnNlIiwiYXRvYiIsInNwbGl0IiwiZXhwIiwibm93IiwiY3VycmVudFVzZXIiLCJ1c2VybmFtZSIsImN1cnJlbnRVc2VySWQiLCJfaWQiLCJ3YXJkbm8iLCJoYXNQZXJtaXNzaW9uIiwicGVybWlzc2lvbiIsInBlcm1pc3Npb25zIiwiaW5jbHVkZXMiLCJyZWdpc3RlciIsInN1Y2Nlc3MiLCJsb2dJbiIsImhhc1Blcm1pc3Npb25Gb3IiLCJzdGF0ZW5hbWUiLCJsb2dPdXQiLCJyZW1vdmVJdGVtIiwidXNlclNlcnZpY2UiLCJ1c2VycyIsInVzZXJsaXN0IiwiY2xlYXIiLCJmYWlsZWQiLCJjaGFuZ2UiLCIkYXBwbHkiLCJhbmd1bGFyIiwiZWxlbWVudCIsIm1hdGVyaWFsX3NlbGVjdCIsInZhbCIsIm5vdGlmaWNhdGlvblNlcnZpY2UiLCJzbGlkZXMiLCJjb25uZWN0IiwibWVzc2FnZSIsIm9ubWVzc2FnZSIsInNsaWRlc2xpc3QiLCJzbGlkZUFsaWduIiwiY2FsbGVkdG9rZW4iLCJjYXJvdXNlbCIsImZ1bGxXaWR0aCIsInNsaWRlciIsInRva2VuY2FsbGVkIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsIiRzdGF0ZSIsImxvZ2luIiwicGFzc3dvcmQiLCJnbyIsInJlbG9hZCIsInRva2VuU2VydmljZSIsImZpbGVVcGxvYWQiLCJkcm9wZG93biIsImluRHVyYXRpb24iLCJvdXREdXJhdGlvbiIsImNvbnN0cmFpbldpZHRoIiwiZ3V0dGVyIiwiYmVsb3dPcmlnaW4iLCJhbGlnbm1lbnQiLCJzdG9wUHJvcGFnYXRpb24iLCJzaG93SGlkZU1lbnUiLCJzaWRlTmF2IiwidXNlckNyZWQiLCJlcnJvciIsImxvZ291dCIsInRvZGF5VG9rZW5zIiwidG9rZW5saXN0IiwidG9rZW5hZGRlZCIsInB1c2giLCJnZXRVc2VyRGV0YWlscyIsInByb2ZpbGVwaWMiLCJpbWFnZSIsImNhbGxUb2tlbiIsInRva2VuaWQiLCJoYW5kbGVUb2tlbiIsImZvckVhY2giLCJpIiwiaGFuZGxlZGJ5IiwibWFya0RvbmUiLCJjb21wbGV0ZUhhbmRsaW5nIiwic3BsaWNlIiwiZmlyc3RuYW1lIiwibGFzdG5hbWUiLCJlbWFpbCIsInBob25lbm8iLCJhZGRyZXNzIiwic2hvd3Byb2ZpbGVtb2RhbCIsIiRudW1iZXJEZWNpbWFsIiwidXBkYXRlVGV4dEZpZWxkcyIsInVwbG9hZEltYWdlIiwiZmlsZSIsInVwbG9hZFVybCIsInVwbG9hZEZpbGVUb1VybCIsInBhdGgiLCJjbG9zZXByb2ZpbGVtb2RhbCIsInNhdmVjaGFuZ2VzIiwidXBkYXRlVXNlciIsIndlYlNvY2tldCIsImNvbm5lY3Rpb24iLCJoYW5kbGVNZXNzYWdlIiwibWVzc2FnZVR5cGUiLCJCUk9BRENBU1QiLCJUT0tFTkFEREVEIiwiVE9LRU5SRU1PVkVEIiwidG9rZW5yZW1vdmVkIiwiVE9LRU5DQUxMRUQiLCJjYWxsYmFjayIsIldlYlNvY2tldCIsIm9ub3BlbiIsInNlbmQiLCJ1cGxvYWRlZCIsIk1lc3NhZ2VUeXBlIiwidXNlclR5cGVzIiwiZGVwdFR5cGVzIiwiaW1hZ2VTcmMiLCJlbXBsb3llZWlkIiwiZGVwYXJ0bWVudHR5cGUiLCJ1c2VyVHlwZUxpc3QiLCJkZXB0VHlwZUxpc3QiLCJ1c2VydHlwZSIsImRlcHR0eXBlIiwic2V0VXNlclR5cGUiLCJpZCIsInVzZXJ0eXBlaWQiLCJjYXRjaCIsImRpcmVjdGl2ZSIsInNjb3BlIiwiZmlsZWlucHV0IiwiZmlsZXByZXZpZXciLCJsaW5rIiwiYXR0cmlidXRlcyIsImJpbmQiLCJjaGFuZ2VFdmVudCIsInRhcmdldCIsImZpbGVzIiwicmVhZGVyIiwiRmlsZVJlYWRlciIsIm9ubG9hZCIsImxvYWRFdmVudCIsInJlc3VsdCIsInJlYWRBc0RhdGFVUkwiLCJzZXJ2aWNlIiwiZmQiLCJGb3JtRGF0YSIsImFwcGVuZCIsInRyYW5zZm9ybVJlcXVlc3QiLCJpZGVudGl0eSIsImhlYWRlcnMiLCJ1bmRlZmluZWQiLCJzbGlkZXJTZXJ2aWNlIiwidXBkYXRlIiwic2xpZGUiLCJjcmVhdGUiLCJyZW1vdmUiLCJkZWxldGUiLCJwb3AiLCJzaG93bW9kYWwiLCJjbG9zZW1vZGFsIiwiY3JlYXRlbmV3IiwibmV3IiwiZ2V0QWxsIiwicHV0IiwidXBsb2FkIiwiZGVwdFR5cGVzTGlzdCIsInRva2VubnVtYmVyIiwidmlzaXRvcm5hbWUiLCJkZXBhcnRtZW50IiwiZGVzY3JpcHRpb24iLCJjcmVhdGVkYnkiLCJyYW5kb21HZW5lcmF0b3IiLCJ4IiwiTWF0aCIsInJhbmRvbSIsInRvU3RyaW5nIiwiYXJyIiwibGVuZ3RoIiwiZ2VuZXJhdGVUb2tlbiIsImNyZWF0ZVRva2VuIiwiZmV0Y2hUb2RheVRva2VuIiwiZ2V0QWxsVXNlcnMiLCJnZXRBbGxVc2VyVHlwZXMiLCJnZXRBbGxEZXBhcnRtZW50Iiwic2V0RGVwYXJ0bWVudFR5cGUiLCJkZXBhcnRtZW50eXBlIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN0RBQSxJQUFJQyxVQUFKLENBQWUsZ0JBQWYsRUFBaUMsQ0FBQyxRQUFELEVBQVcsbUJBQVgsRUFBZ0Msb0JBQWhDLEVBQXFELGFBQXJELEVBQW9FLFVBQVNDLE1BQVQsRUFBaUJDLGFBQWpCLEVBQWdDQyxrQkFBaEMsRUFBb0RDLFdBQXBELEVBQWdFOztBQUVuS0MsSUFBRUMsUUFBRixFQUFZQyxLQUFaLENBQWtCLFlBQVU7QUFDMUJGLE1BQUUsUUFBRixFQUFZRyxLQUFaO0FBQ0QsR0FGRDtBQUdGUCxTQUFPUSxNQUFQLEdBQWdCLFlBQVU7QUFDeEJOLHVCQUFtQk8sTUFBbkIsR0FBNEJDLElBQTVCLENBQWlDLFVBQVNDLEdBQVQsRUFBYTs7QUFFNUMsVUFBSUMsT0FBTyxFQUFYO0FBR0FBLFdBQUtDLE1BQUwsR0FBY0YsSUFBSUMsSUFBSixDQUFTQyxNQUF2QjtBQUNBRCxXQUFLRSxJQUFMLEdBQVksSUFBSUMsSUFBSixHQUFXQyxZQUFYLEVBQVo7O0FBRUFmLG9CQUFjTyxNQUFkLENBQXFCSSxJQUFyQixFQUEyQkYsSUFBM0IsQ0FBZ0MsVUFBU0MsR0FBVCxFQUFhO0FBQzNDTSxnQkFBUUMsR0FBUixDQUFZUCxJQUFJQyxJQUFoQjtBQUNBWixlQUFPbUIsSUFBUCxHQUFjUixJQUFJQyxJQUFsQjtBQUNBUSxvQkFBWUMsS0FBWixDQUFrQixtQkFBbEIsRUFBdUMsSUFBdkMsRUFBNkMsT0FBN0M7QUFDQWpCLFVBQUUsYUFBRixFQUFpQkcsS0FBakIsQ0FBdUIsTUFBdkI7QUFDQWUsbUJBQVcsWUFBVTtBQUNuQmxCLFlBQUUsYUFBRixFQUFpQkcsS0FBakIsQ0FBdUIsT0FBdkI7QUFDRCxTQUZELEVBR0EsSUFIQTtBQUlELE9BVEQsRUFTRyxVQUFTZ0IsR0FBVCxFQUFhO0FBQ2JILG9CQUFZQyxLQUFaLENBQWtCLGtCQUFsQixFQUFzQyxJQUF0QyxFQUE0QyxLQUE1QztBQUNGLE9BWEQ7QUFjRCxLQXRCRCxFQXNCRyxVQUFTRSxHQUFULEVBQWE7O0FBRWQsVUFBR0EsSUFBSUMsTUFBSixJQUFZLEdBQWYsRUFBbUI7QUFDakJKLG9CQUFZQyxLQUFaLENBQWtCLCtCQUFsQixFQUFtRCxJQUFuRCxFQUF5RCxLQUF6RDtBQUNELE9BRkQsTUFFTztBQUNMRCxvQkFBWUMsS0FBWixDQUFrQixrQkFBbEIsRUFBc0MsSUFBdEMsRUFBNEMsS0FBNUM7QUFDRDtBQUNGLEtBN0JEO0FBK0JELEdBaENEO0FBaUNDLENBdENnQyxDQUFqQyxFOzs7Ozs7Ozs7QUNBQXZCLElBQUkyQixPQUFKLENBQVksbUJBQVosRUFBaUMsQ0FBQyxPQUFELEVBQVUsVUFBU0MsS0FBVCxFQUFlOztBQUV4RCxNQUFJQyxNQUFNLEVBQVY7O0FBRUFBLE1BQUluQixNQUFKLEdBQWEsVUFBU0ksSUFBVCxFQUFjO0FBQ3pCLFdBQU9jLE1BQU1FLElBQU4sQ0FBVyxvQkFBWCxFQUFnQ2hCLElBQWhDLENBQVA7QUFDRCxHQUZEOztBQUlBZSxNQUFJRSxTQUFKLEdBQWdCLFVBQVNoQixNQUFULEVBQThCO0FBQUEsUUFBYmlCLElBQWEsdUVBQVIsT0FBUTs7QUFDMUMsV0FBT0osTUFBTUssR0FBTixrQkFBeUJsQixNQUF6QixDQUFQO0FBQ0gsR0FGRDs7QUFLQSxTQUFPYyxHQUFQO0FBQ0QsQ0FkZ0MsQ0FBakMsRTs7Ozs7Ozs7O0FDQUE3QixJQUFJMkIsT0FBSixDQUFZLGFBQVosRUFBMkIsQ0FBQyxPQUFELEVBQVUsU0FBVixFQUFxQixVQUFVQyxLQUFWLEVBQWlCTSxPQUFqQixFQUEwQjs7QUFFeEUsTUFBSUMsT0FBTyxFQUFYOztBQUVBQSxPQUFLQyxTQUFMLEdBQWlCLFVBQVVDLEtBQVYsRUFBaUI7QUFDaENILFlBQVFJLFlBQVIsQ0FBcUIsUUFBckIsSUFBZ0NELEtBQWhDO0FBQ0QsR0FGRDs7QUFJQUYsT0FBS0ksUUFBTCxHQUFnQixZQUFZO0FBQzFCLFdBQU9MLFFBQVFJLFlBQVIsQ0FBcUIsUUFBckIsQ0FBUDtBQUNELEdBRkQ7O0FBSUFILE9BQUtLLFVBQUwsR0FBa0IsWUFBWTtBQUM1QixRQUFJSCxRQUFRRixLQUFLSSxRQUFMLEVBQVo7O0FBRUEsUUFBSUYsS0FBSixFQUFXO0FBQ1QsVUFBSUksVUFBVUMsS0FBS0MsS0FBTCxDQUFXVCxRQUFRVSxJQUFSLENBQWFQLE1BQU1RLEtBQU4sQ0FBWSxHQUFaLEVBQWlCLENBQWpCLENBQWIsQ0FBWCxDQUFkOztBQUVBLGFBQU9KLFFBQVFLLEdBQVIsR0FBYzdCLEtBQUs4QixHQUFMLEtBQWEsSUFBbEM7QUFDRCxLQUpELE1BSU87QUFDTDVCLGNBQVFDLEdBQVIsQ0FBWSxlQUFaO0FBQ0EsYUFBTyxLQUFQO0FBQ0Q7QUFDRixHQVhEOztBQWFBZSxPQUFLYSxXQUFMLEdBQW1CLFlBQVk7QUFDN0IsUUFBSWIsS0FBS0ssVUFBTCxFQUFKLEVBQXVCO0FBQ3JCLFVBQUlILFFBQVFGLEtBQUtJLFFBQUwsRUFBWjtBQUNBLFVBQUlFLFVBQVVDLEtBQUtDLEtBQUwsQ0FBV1QsUUFBUVUsSUFBUixDQUFhUCxNQUFNUSxLQUFOLENBQVksR0FBWixFQUFpQixDQUFqQixDQUFiLENBQVgsQ0FBZDs7QUFFQSxhQUFPSixRQUFRUSxRQUFmO0FBQ0Q7QUFDRixHQVBEOztBQVNBZCxPQUFLZSxhQUFMLEdBQXFCLFlBQVU7QUFDN0IsUUFBSWYsS0FBS0ssVUFBTCxFQUFKLEVBQXVCO0FBQ3JCLFVBQUlILFFBQVFGLEtBQUtJLFFBQUwsRUFBWjtBQUNBLFVBQUlFLFVBQVVDLEtBQUtDLEtBQUwsQ0FBV1QsUUFBUVUsSUFBUixDQUFhUCxNQUFNUSxLQUFOLENBQVksR0FBWixFQUFpQixDQUFqQixDQUFiLENBQVgsQ0FBZDtBQUNBLGFBQU9KLFFBQVFVLEdBQWY7QUFDRDtBQUNGLEdBTkQ7O0FBUUFoQixPQUFLaUIsTUFBTCxHQUFjLFlBQVU7QUFDdEIsUUFBSWpCLEtBQUtLLFVBQUwsRUFBSixFQUF1QjtBQUNyQixVQUFJSCxRQUFRRixLQUFLSSxRQUFMLEVBQVo7QUFDQSxVQUFJRSxVQUFVQyxLQUFLQyxLQUFMLENBQVdULFFBQVFVLElBQVIsQ0FBYVAsTUFBTVEsS0FBTixDQUFZLEdBQVosRUFBaUIsQ0FBakIsQ0FBYixDQUFYLENBQWQ7O0FBRUEsYUFBT0osUUFBUVcsTUFBZjtBQUNEO0FBQ0YsR0FQRDs7QUFTQWpCLE9BQUtrQixhQUFMLEdBQXFCLFVBQUNDLFVBQUQsRUFBZ0I7QUFDbkMsUUFBSW5CLEtBQUtLLFVBQUwsRUFBSixFQUF1QjtBQUNyQixVQUFJSCxRQUFRRixLQUFLSSxRQUFMLEVBQVo7QUFDQSxVQUFJRSxVQUFVQyxLQUFLQyxLQUFMLENBQVdULFFBQVFVLElBQVIsQ0FBYVAsTUFBTVEsS0FBTixDQUFZLEdBQVosRUFBaUIsQ0FBakIsQ0FBYixDQUFYLENBQWQ7O0FBRUEsYUFBT0osUUFBUWMsV0FBUixDQUFvQkMsUUFBcEIsQ0FBNkJGLFVBQTdCLENBQVA7QUFDRDtBQUNGLEdBUEQ7QUFRQW5CLE9BQUtzQixRQUFMLEdBQWdCLFVBQVVwQyxJQUFWLEVBQWdCO0FBQzlCLFdBQU9PLE1BQU1FLElBQU4sQ0FBVyxXQUFYLEVBQXdCVCxJQUF4QixFQUE4QnFDLE9BQTlCLENBQXNDLFVBQVU1QyxJQUFWLEVBQWdCO0FBQzNEcUIsV0FBS0MsU0FBTCxDQUFldEIsS0FBS3VCLEtBQXBCO0FBQ0QsS0FGTSxDQUFQO0FBR0QsR0FKRDs7QUFNQUYsT0FBS3dCLEtBQUwsR0FBYSxVQUFVdEMsSUFBVixFQUFnQjtBQUMzQixXQUFPTyxNQUFNRSxJQUFOLENBQVcsUUFBWCxFQUFxQlQsSUFBckIsQ0FBUDtBQUVELEdBSEQ7O0FBS0FjLE9BQUt5QixnQkFBTCxHQUF3QixxQkFBYTtBQUNuQyxZQUFPQyxTQUFQO0FBQ0UsV0FBSyxlQUFMO0FBQ0EsV0FBSyxjQUFMO0FBQ0EsZUFBTzFCLEtBQUtrQixhQUFMLENBQW1CLGNBQW5CLENBQVA7O0FBRUE7QUFDQSxlQUFPLElBQVA7QUFORjtBQVFELEdBVEQ7O0FBV0FsQixPQUFLMkIsTUFBTCxHQUFjLFlBQVk7QUFDeEIzQyxZQUFRQyxHQUFSLENBQVksa0JBQVo7QUFDQWMsWUFBUUksWUFBUixDQUFxQnlCLFVBQXJCLENBQWdDLFFBQWhDO0FBQ0QsR0FIRDtBQUlBLFNBQU81QixJQUFQO0FBQ0QsQ0F0RjBCLENBQTNCLEU7Ozs7Ozs7OztBQ0FBbkMsSUFBSUMsVUFBSixDQUFlLGlCQUFmLEVBQWtDLENBQUMsUUFBRCxFQUFVLG9CQUFWLEVBQStCLGFBQS9CLEVBQTZDLE9BQTdDLEVBQXFELFVBQVNDLE1BQVQsRUFBZ0JFLGtCQUFoQixFQUFtQzRELFdBQW5DLEVBQWdEQyxLQUFoRCxFQUFzRDs7QUFHM0k5QyxVQUFRQyxHQUFSLENBQVk2QyxLQUFaO0FBQ0EvRCxTQUFPZ0UsUUFBUCxHQUFtQkQsS0FBbkI7QUFDQS9ELFNBQU9hLE1BQVAsR0FBYyxFQUFkOztBQUdBYixTQUFPdUQsUUFBUCxHQUFrQixFQUFDLFdBQVUsRUFBWCxFQUFlLFVBQVMsRUFBeEIsRUFBbEI7O0FBRUF2RCxTQUFPUyxNQUFQLEdBQWUsRUFBQyxXQUFVLEVBQVgsRUFBYyxVQUFTLEVBQXZCLEVBQWY7O0FBSUEsTUFBSXdELFFBQVEsU0FBUkEsS0FBUSxHQUFVOztBQUVwQmpFLFdBQU9TLE1BQVAsQ0FBYytDLE9BQWQsR0FBc0IsS0FBdEI7QUFDQXhELFdBQU9TLE1BQVAsQ0FBY3lELE1BQWQsR0FBcUIsS0FBckI7QUFDQWxFLFdBQU91RCxRQUFQLENBQWdCQyxPQUFoQixHQUF3QixLQUF4QjtBQUNBeEQsV0FBT3VELFFBQVAsQ0FBZ0JXLE1BQWhCLEdBQXVCLEtBQXZCO0FBRUQsR0FQRDtBQVFBRDs7QUFFQTdELElBQUUsU0FBRixFQUFhK0QsTUFBYixDQUFvQixZQUFVO0FBQzFCRjtBQUNBakUsV0FBT29FLE1BQVA7QUFDSCxHQUhEOztBQUtBQyxVQUFRQyxPQUFSLENBQWdCakUsUUFBaEIsRUFBMEJDLEtBQTFCLENBQWdDLFlBQVk7QUFDMUNGLE1BQUUsUUFBRixFQUFZRyxLQUFaO0FBQ0FILE1BQUUsUUFBRixFQUFZbUUsZUFBWjtBQUNDLEdBSEg7O0FBUUZ2RSxTQUFPdUQsUUFBUCxHQUFrQixZQUFVO0FBQ3pCdkQsV0FBT2EsTUFBUCxHQUFnQlQsRUFBRSxTQUFGLEVBQWFvRSxHQUFiLEVBQWhCO0FBQ0R4RSxXQUFPdUQsUUFBUCxDQUFnQkMsT0FBaEIsR0FBd0IsRUFBeEI7QUFDQXhELFdBQU91RCxRQUFQLENBQWdCVyxNQUFoQixHQUF1QixFQUF2QjtBQUNBLFFBQUcsQ0FBQ2xFLE9BQU9hLE1BQVgsRUFDQTtBQUNFTyxrQkFBWUMsS0FBWixDQUFrQixpQkFBbEIsRUFBcUMsSUFBckMsRUFBMEMsS0FBMUM7QUFDQTtBQUNEO0FBQ0RuQix1QkFBbUJxRCxRQUFuQixDQUE0QnZELE9BQU9hLE1BQW5DLEVBQTJDSCxJQUEzQyxDQUFnRCxVQUFTQyxHQUFULEVBQWE7QUFDM0RTLGtCQUFZQyxLQUFaLENBQWtCLHVCQUFsQixFQUEyQyxJQUEzQyxFQUFpRCxPQUFqRDtBQUNBckIsYUFBT3VELFFBQVAsQ0FBZ0JDLE9BQWhCLEdBQTBCLElBQTFCO0FBQ0QsS0FIRCxFQUdHLFVBQVNqQyxHQUFULEVBQWE7QUFDZEgsa0JBQVlDLEtBQVosQ0FBa0IsOENBQWxCLEVBQWtFLElBQWxFLEVBQXdFLEtBQXhFO0FBQ0FyQixhQUFPdUQsUUFBUCxDQUFnQlcsTUFBaEIsR0FBeUIsSUFBekI7QUFDRCxLQU5EO0FBT0QsR0FoQkQ7O0FBb0JBbEUsU0FBT1MsTUFBUCxHQUFnQixZQUFVO0FBQ3hCVCxXQUFPUyxNQUFQLENBQWMrQyxPQUFkLEdBQXNCLEVBQXRCO0FBQ0F4RCxXQUFPUyxNQUFQLENBQWN5RCxNQUFkLEdBQXFCLEVBQXJCO0FBQ0FoRSx1QkFBbUJPLE1BQW5CLEdBQTRCQyxJQUE1QixDQUFpQyxVQUFTQyxHQUFULEVBQWE7QUFDNUNTLGtCQUFZQyxLQUFaLENBQWtCLHdCQUF1QlYsSUFBSUMsSUFBSixDQUFTQyxNQUFsRCxFQUEwRCxJQUExRCxFQUFnRSxPQUFoRTtBQUNBYixhQUFPUyxNQUFQLENBQWMrQyxPQUFkLEdBQXdCLElBQXhCO0FBQ0QsS0FIRCxFQUdHLFVBQVNqQyxHQUFULEVBQWE7QUFDZEgsa0JBQVlDLEtBQVosQ0FBa0IsMENBQWxCLEVBQThELElBQTlELEVBQW9FLEtBQXBFO0FBQ0FyQixhQUFPUyxNQUFQLENBQWN5RCxNQUFkLEdBQXVCLElBQXZCO0FBQ0QsS0FORDtBQU9ELEdBVkQ7QUFhQyxDQXRFaUMsQ0FBbEMsRTs7Ozs7Ozs7O0FDQUFwRSxJQUFJMkIsT0FBSixDQUFZLG9CQUFaLEVBQWtDLENBQUMsT0FBRCxFQUFVLFVBQVNDLEtBQVQsRUFBZTs7QUFFekQsTUFBSUMsTUFBTSxFQUFWOztBQUVBQSxNQUFJNEIsUUFBSixHQUFlLFVBQVMxQyxNQUFULEVBQWdCO0FBQzdCLFdBQU9hLE1BQU1FLElBQU4sQ0FBVyxnQkFBWCxFQUE2QixFQUFDLFVBQVNmLE1BQVYsRUFBN0IsQ0FBUDtBQUNELEdBRkQ7O0FBSUFjLE1BQUlsQixNQUFKLEdBQWEsWUFBVTtBQUNyQixXQUFPaUIsTUFBTUUsSUFBTixDQUFXLGNBQVgsRUFBMEIsRUFBMUIsQ0FBUDtBQUNELEdBRkQ7O0FBSUEsU0FBT0QsR0FBUDtBQUNELENBYmlDLENBQWxDLEU7Ozs7Ozs7OztBQ0lBN0IsSUFBSUMsVUFBSixDQUFlLFVBQWYsRUFBMEIsQ0FBQyxRQUFELEVBQVUsT0FBVixFQUFrQixxQkFBbEIsRUFBd0MsUUFBeEMsRUFBa0QsVUFBU0MsTUFBVCxFQUFnQjBCLEtBQWhCLEVBQXNCK0MsbUJBQXRCLEVBQTBDQyxNQUExQyxFQUFpRDtBQUM1SEQsc0JBQW9CRSxPQUFwQixDQUE0QixVQUFTQyxPQUFULEVBQWlCO0FBQzVDQSxZQUFRQyxTQUFSLENBQWtCLFVBQVNELE9BQVQsRUFBaUI7QUFDakMzRCxjQUFRQyxHQUFSLENBQVkwRCxPQUFaO0FBQ0QsS0FGRDtBQUdBLEdBSkQ7QUFLQTVFLFNBQU84RSxVQUFQLEdBQW9CSixNQUFwQjtBQUNBMUUsU0FBTytFLFVBQVAsR0FBb0IsQ0FBQyxZQUFELEVBQWMsY0FBZCxFQUE2QixhQUE3QixDQUFwQjtBQUNBL0UsU0FBT2dGLFdBQVAsR0FBcUIsRUFBckI7QUFDQTVFLElBQUVDLFFBQUYsRUFBWUMsS0FBWixDQUFrQixZQUFVO0FBQzNCRixNQUFFLDJCQUFGLEVBQStCNkUsUUFBL0IsQ0FBd0MsRUFBQ0MsV0FBVyxJQUFaLEVBQXhDO0FBQ0E5RSxNQUFFLFNBQUYsRUFBYStFLE1BQWI7QUFDRCxHQUhBOztBQUtEVixzQkFBb0JXLFdBQXBCLEdBQWtDLFVBQVNSLE9BQVQsRUFBaUI7QUFDakR4RCxnQkFBWUMsS0FBWixDQUFrQnVELE9BQWxCLEVBQTBCLElBQTFCLEVBQStCLE9BQS9CO0FBQ0F4RSxNQUFFLGFBQUYsRUFBaUJpRixRQUFqQixDQUEwQixpQkFBMUI7QUFDQXJGLFdBQU9nRixXQUFQLEdBQW1CSixPQUFuQjtBQUNBNUUsV0FBT29FLE1BQVA7O0FBRUE5QyxlQUFXLFlBQVU7QUFDbkJsQixRQUFFLGFBQUYsRUFBaUJrRixXQUFqQixDQUE2QixpQkFBN0I7QUFDQXRGLGFBQU9nRixXQUFQLEdBQW1CLEVBQW5CO0FBQ0FoRixhQUFPb0UsTUFBUDtBQUNELEtBSkQsRUFJRSxJQUpGO0FBS0QsR0FYRDtBQWFDLENBM0J5QixDQUExQixFOzs7Ozs7Ozs7QUNKQXRFLElBQUkyQixPQUFKLENBQVksYUFBWixFQUEwQixDQUFDLE9BQUQsRUFBUyxxQkFBVCxFQUFnQyxVQUFTQyxLQUFULEVBQWdCK0MsbUJBQWhCLEVBQW9DLENBRTdGLENBRnlCLENBQTFCLEU7Ozs7Ozs7OztBQ0FBM0UsSUFBSUMsVUFBSixDQUFlLFdBQWYsRUFBMkIsQ0FBQyxRQUFELEVBQVUsYUFBVixFQUF3QixRQUF4QixFQUFrQyxVQUFTQyxNQUFULEVBQWlCaUMsSUFBakIsRUFBc0JzRCxNQUF0QixFQUE2Qjs7QUFFeEZ2RixTQUFPd0YsS0FBUCxHQUFlLFlBQVU7QUFDdkIsUUFBRyxDQUFDeEYsT0FBTytDLFFBQVIsSUFBb0IsQ0FBQy9DLE9BQU95RixRQUEvQixFQUF3QztBQUN0Q3JFLGtCQUFZQyxLQUFaLENBQWtCLHdCQUFsQixFQUE0QyxJQUE1QyxFQUFrRCxLQUFsRDtBQUNBO0FBQ0Q7O0FBRURZLFNBQUt3QixLQUFMLENBQVcsRUFBQyxZQUFXekQsT0FBTytDLFFBQW5CLEVBQTRCLFlBQVcvQyxPQUFPeUYsUUFBOUMsRUFBWCxFQUFxRS9FLElBQXJFLENBQTBFLFVBQVNDLEdBQVQsRUFBYTtBQUNyRnNCLFdBQUtDLFNBQUwsQ0FBZXZCLElBQUlDLElBQUosQ0FBU3VCLEtBQXhCO0FBQ0FvRCxhQUFPRyxFQUFQLENBQVUsTUFBVixFQUFpQixFQUFqQixFQUFvQixFQUFDQyxRQUFPLElBQVIsRUFBcEI7QUFDSCxLQUhDLEVBR0EsVUFBU2hGLEdBQVQsRUFBYTtBQUNiUyxrQkFBWUMsS0FBWixDQUFrQixxQkFBbEIsRUFBeUMsSUFBekMsRUFBK0MsS0FBL0M7QUFDRCxLQUxDO0FBT0QsR0FiRDtBQWdCRCxDQWxCMEIsQ0FBM0IsRTs7Ozs7Ozs7O0FDRUF2QixJQUFJQyxVQUFKLENBQWUsU0FBZixFQUEwQixDQUFDLFFBQUQsRUFBVyxhQUFYLEVBQTBCLFFBQTFCLEVBQW9DLGNBQXBDLEVBQW9ELHFCQUFwRCxFQUEyRSxhQUEzRSxFQUEwRixZQUExRixFQUF3RyxVQUFVQyxNQUFWLEVBQWtCRyxXQUFsQixFQUErQm9GLE1BQS9CLEVBQXVDSyxZQUF2QyxFQUFxRG5CLG1CQUFyRCxFQUEwRVgsV0FBMUUsRUFBdUYrQixVQUF2RixFQUFtRzs7QUFFbk9wQixzQkFBb0JFLE9BQXBCO0FBQ0EzRSxTQUFPc0MsVUFBUCxHQUFvQm5DLFlBQVltQyxVQUFoQzs7QUFFQWxDLElBQUVDLFFBQUYsRUFBWUMsS0FBWixDQUFrQixZQUFZOztBQUc1QkYsTUFBRSxRQUFGLEVBQVlHLEtBQVo7O0FBR0FILE1BQUUsa0JBQUYsRUFBc0IwRixRQUF0QixDQUErQjtBQUM3QkMsa0JBQVksR0FEaUI7QUFFN0JDLG1CQUFhLEdBRmdCO0FBRzdCQyxzQkFBZ0IsS0FIYTtBQUk3QkMsY0FBUSxDQUpxQixFQUlsQjtBQUNYQyxtQkFBYSxJQUxnQixFQUtWO0FBQ25CQyxpQkFBVyxNQU5rQixFQU1WO0FBQ25CQyx1QkFBaUIsS0FQWSxDQU9OO0FBUE0sS0FBL0I7QUFTRCxHQWZEOztBQWlCQXJHLFNBQU93RixLQUFQLEdBQWUsWUFBWTtBQUN6QixRQUFJLENBQUN4RixPQUFPK0MsUUFBUixJQUFvQixDQUFDL0MsT0FBT3lGLFFBQWhDLEVBQTBDO0FBQ3hDeEUsY0FBUUMsR0FBUixDQUFZLHNCQUFaO0FBQ0E7QUFDRDs7QUFHRGxCLFdBQU9zRyxZQUFQLEdBQXNCLFlBQU07QUFDMUJsRyxRQUFFLGtCQUFGLEVBQXNCbUcsT0FBdEIsQ0FBOEIsTUFBOUI7O0FBRUFuRyxRQUFFLGtCQUFGLEVBQXNCbUcsT0FBdEIsQ0FBOEIsTUFBOUI7QUFDRCxLQUpEOztBQU1BLFFBQUlDLFdBQVc7QUFDYnpELGdCQUFVL0MsT0FBTytDLFFBREo7QUFFYjBDLGdCQUFVekYsT0FBT3lGO0FBRkosS0FBZjs7QUFLQXRGLGdCQUFZc0QsS0FBWixDQUFrQitDLFFBQWxCLEVBQTRCOUYsSUFBNUIsQ0FBaUMsVUFBVUMsR0FBVixFQUFlO0FBQzlDTSxjQUFRQyxHQUFSLENBQVkseUJBQVo7QUFDQUQsY0FBUUMsR0FBUixDQUFZUCxJQUFJQyxJQUFKLENBQVN1QixLQUFyQjtBQUNBaEMsa0JBQVkrQixTQUFaLENBQXNCdkIsSUFBSUMsSUFBSixDQUFTdUIsS0FBL0I7QUFDQW5DLGFBQU9zQyxVQUFQLEdBQW9CbkMsWUFBWW1DLFVBQVosRUFBcEI7QUFDQWlELGFBQU9HLEVBQVAsQ0FBVSxNQUFWLEVBQWtCLEVBQWxCLEVBQXNCO0FBQ3BCQyxnQkFBUTtBQURZLE9BQXRCO0FBR0F2RixRQUFFLGFBQUYsRUFBaUJHLEtBQWpCLENBQXVCLE1BQXZCO0FBQ0QsS0FURCxFQVNHLFVBQVVnQixHQUFWLEVBQWU7QUFDaEJOLGNBQVFDLEdBQVIsQ0FBWSx5QkFBWjtBQUNBRCxjQUFRd0YsS0FBUixDQUFjbEYsR0FBZDtBQUNELEtBWkQ7QUFhRCxHQS9CRDs7QUFpQ0F2QixTQUFPMEcsTUFBUCxHQUFnQixZQUFZOztBQUUxQnZHLGdCQUFZeUQsTUFBWjtBQUNBMkIsV0FBT0csRUFBUCxDQUFVLE9BQVY7QUFFRCxHQUxEOztBQVFBRSxlQUFhZSxXQUFiLEdBQTJCakcsSUFBM0IsQ0FBZ0MsVUFBVUUsSUFBVixFQUFnQjtBQUM5Q0ssWUFBUUMsR0FBUixDQUFZTixJQUFaO0FBQ0FaLFdBQU80RyxTQUFQLEdBQW1CaEIsYUFBYWdCLFNBQWhDO0FBQ0E7QUFDRCxHQUpEOztBQU1BbkMsc0JBQW9Cb0MsVUFBcEIsR0FBaUMsVUFBVTFFLEtBQVYsRUFBaUI7QUFDaERsQixZQUFRQyxHQUFSLENBQVlpQixLQUFaO0FBQ0FuQyxXQUFPNEcsU0FBUCxDQUFpQkUsSUFBakIsQ0FBc0IzRSxLQUF0QjtBQUNBbkMsV0FBT29FLE1BQVA7QUFDRCxHQUpEOztBQU1BTixjQUFZaUQsY0FBWixHQUE2QnJHLElBQTdCLENBQWtDLFVBQVNDLEdBQVQsRUFBYTtBQUM3Q1gsV0FBT2dILFVBQVAsR0FBb0IsbUJBQWlCckcsSUFBSUMsSUFBSixDQUFTcUcsS0FBOUM7QUFDRCxHQUZEOztBQUlBakgsU0FBT2tILFNBQVAsR0FBbUIsVUFBVUMsT0FBVixFQUFtQjtBQUNwQ3ZCLGlCQUFhd0IsV0FBYixDQUF5QkQsT0FBekIsRUFBa0N6RyxJQUFsQyxDQUF1QyxVQUFVQyxHQUFWLEVBQWU7O0FBRXBEUyxrQkFBWUMsS0FBWixDQUFrQixlQUFsQixFQUFtQyxJQUFuQyxFQUF5QyxPQUF6QztBQUNBckIsYUFBTzRHLFNBQVAsQ0FBaUJTLE9BQWpCLENBQXlCLFVBQUMvQyxPQUFELEVBQVVnRCxDQUFWLEVBQWdCO0FBQ3ZDLFlBQUloRCxRQUFRckIsR0FBUixJQUFla0UsT0FBbkIsRUFBNEI7QUFDMUJsRyxrQkFBUUMsR0FBUixDQUFZb0csQ0FBWjs7QUFFQXRILGlCQUFPNEcsU0FBUCxDQUFpQlUsQ0FBakIsRUFBb0JDLFNBQXBCLEdBQWdDNUcsSUFBSUMsSUFBSixDQUFTMkcsU0FBekM7O0FBRUE7QUFDRDtBQUNGLE9BUkQ7QUFTRCxLQVpELEVBWUcsVUFBVWhHLEdBQVYsRUFBZTtBQUNoQkgsa0JBQVlDLEtBQVosQ0FBa0IsMkJBQWxCLEVBQStDLElBQS9DLEVBQXFELEtBQXJEO0FBQ0QsS0FkRDtBQWVELEdBaEJEOztBQWtCQXJCLFNBQU93SCxRQUFQLEdBQWtCLFVBQVVMLE9BQVYsRUFBbUI7QUFDbkN2QixpQkFBYTZCLGdCQUFiLENBQThCTixPQUE5QixFQUF1Q3pHLElBQXZDLENBQTRDLFVBQVVFLElBQVYsRUFBZ0I7QUFDMURRLGtCQUFZQyxLQUFaLENBQWtCLHNCQUFsQixFQUEwQyxJQUExQyxFQUFnRCxPQUFoRDtBQUNBckIsYUFBTzRHLFNBQVAsQ0FBaUJTLE9BQWpCLENBQXlCLFVBQUMvQyxPQUFELEVBQVVnRCxDQUFWLEVBQWdCO0FBQ3ZDLFlBQUloRCxRQUFRckIsR0FBUixJQUFla0UsT0FBbkIsRUFBNEI7QUFDMUJuSCxpQkFBTzRHLFNBQVAsQ0FBaUJjLE1BQWpCLENBQXdCSixDQUF4QixFQUEyQixDQUEzQjtBQUNBO0FBQ0Q7QUFDRixPQUxEO0FBTUQsS0FSRCxFQVFHLFVBQVUvRixHQUFWLEVBQWU7QUFDaEJILGtCQUFZQyxLQUFaLENBQWtCLDJCQUFsQixFQUErQyxJQUEvQyxFQUFxRCxLQUFyRDtBQUNELEtBVkQ7QUFXRCxHQVpEOztBQWNBckIsU0FBT21CLElBQVAsR0FBYztBQUNad0csZUFBVyxFQURDO0FBRVpDLGNBQVUsRUFGRTtBQUdaWCxXQUFPLEVBSEs7QUFJWlksV0FBTyxFQUpLO0FBS1pDLGFBQVMsRUFMRztBQU1aQyxhQUFTLEVBTkc7QUFPWnRDLGNBQVU7QUFQRSxHQUFkO0FBU0F6RixTQUFPZ0ksZ0JBQVAsR0FBMEIsWUFBWTtBQUNwQ2xFLGdCQUFZaUQsY0FBWixHQUE2QnJHLElBQTdCLENBQWtDLFVBQVVDLEdBQVYsRUFBZTtBQUMvQ1gsYUFBT21CLElBQVAsR0FBY1IsSUFBSUMsSUFBbEI7QUFDQVosYUFBT21CLElBQVAsQ0FBWTJHLE9BQVosR0FBc0JuSCxJQUFJQyxJQUFKLENBQVNrSCxPQUFULENBQWlCRyxjQUF2QztBQUNBN0gsUUFBRSxTQUFGLEVBQWFHLEtBQWIsQ0FBbUIsTUFBbkI7QUFDQWEsa0JBQVk4RyxnQkFBWjtBQUNELEtBTEQsRUFLRyxVQUFVM0csR0FBVixFQUFlO0FBQ2hCTixjQUFRQyxHQUFSLENBQVlLLEdBQVo7QUFDRCxLQVBEO0FBU0QsR0FWRDs7QUFZQXZCLFNBQU9tSSxXQUFQLEdBQXFCLFlBQVk7O0FBRS9CLFFBQUlDLE9BQU9wSSxPQUFPb0ksSUFBbEI7QUFDQW5ILFlBQVFDLEdBQVIsQ0FBWWtILElBQVo7QUFDQW5ILFlBQVFDLEdBQVIsQ0FBWSxhQUFha0gsSUFBekI7QUFDQSxRQUFJQyxZQUFZLGNBQWhCO0FBQ0F4QyxlQUFXeUMsZUFBWCxDQUEyQkYsSUFBM0IsRUFBaUNDLFNBQWpDLEVBQTRDM0gsSUFBNUMsQ0FBaUQsVUFBVUMsR0FBVixFQUFlO0FBQzlEWCxhQUFPbUIsSUFBUCxDQUFZOEYsS0FBWixHQUFvQnRHLElBQUlDLElBQUosQ0FBUzJILElBQTdCO0FBQ0FuSCxrQkFBWUMsS0FBWixDQUFrQiw4QkFBbEIsRUFBa0QsSUFBbEQsRUFBd0QsT0FBeEQ7QUFDRCxLQUhELEVBR0csWUFBWTtBQUNiRCxrQkFBWUMsS0FBWixDQUFrQiw2QkFBbEIsRUFBaUQsSUFBakQsRUFBdUQsS0FBdkQ7QUFDRCxLQUxEO0FBTUQsR0FaRDs7QUFjQXJCLFNBQU93SSxpQkFBUCxHQUEyQixZQUFZLENBRXRDLENBRkQ7O0FBS0F4SSxTQUFPeUksV0FBUCxHQUFxQixZQUFZOztBQUUvQjNFLGdCQUFZNEUsVUFBWixDQUF1QjFJLE9BQU9tQixJQUE5QixFQUFvQ1QsSUFBcEMsQ0FBeUMsVUFBVUMsR0FBVixFQUFlO0FBQ3REUyxrQkFBWUMsS0FBWixDQUFrQix1QkFBbEIsRUFBMkMsSUFBM0MsRUFBaUQsT0FBakQ7QUFDQWpCLFFBQUUsU0FBRixFQUFhRyxLQUFiLENBQW1CLE9BQW5CO0FBQ0QsS0FIRCxFQUdHLFVBQVVnQixHQUFWLEVBQWU7QUFDaEJILGtCQUFZQyxLQUFaLENBQWtCLCtCQUFsQixFQUFtRCxJQUFuRCxFQUF5RCxLQUF6RDtBQUNELEtBTEQ7QUFNRCxHQVJEO0FBU0FyQixTQUFPbUQsYUFBUCxHQUF1QmhELFlBQVlnRCxhQUFuQztBQUNELENBakt5QixDQUExQixFOzs7Ozs7Ozs7QUNGQTs7QUFDQTs7Ozs7O0FBR0EsSUFBTXdGLDZCQUFOO0FBQ0EsSUFBSUMsYUFBYSxJQUFqQjtBQUNBOUksSUFBSTJCLE9BQUosQ0FBWSxxQkFBWixFQUFrQyxDQUFDLGFBQUQsRUFBZSxhQUFmLEVBQThCLFVBQVNxQyxXQUFULEVBQXNCM0QsV0FBdEIsRUFBa0M7O0FBRWpHLE1BQUl3QixNQUFNLEVBQVY7O0FBRUEsTUFBSWtILGdCQUFnQixTQUFoQkEsYUFBZ0IsQ0FBU2pFLE9BQVQsRUFBaUI7O0FBRXBDLFFBQUloRSxPQUFPNEIsS0FBS0MsS0FBTCxDQUFXbUMsUUFBUWhFLElBQW5CLENBQVg7QUFDQUssWUFBUUMsR0FBUixDQUFZTixJQUFaO0FBQ0MsWUFBT0EsS0FBS2tJLFdBQVo7QUFDRSxXQUFLLHNCQUFZQyxTQUFqQjtBQUNBO0FBQ0E7QUFDQSxXQUFLLHNCQUFZQyxVQUFqQjtBQUNBL0gsZ0JBQVFDLEdBQVIsQ0FBWTBELE9BQVo7QUFDQSxZQUFHLE9BQU9qRCxJQUFJa0YsVUFBWCxLQUEwQixVQUE3QixFQUF3QztBQUN4Q2xGLGNBQUlrRixVQUFKLENBQWVqRyxLQUFLZ0UsT0FBcEI7QUFDQztBQUNEO0FBQ0EsV0FBSyxzQkFBWXFFLFlBQWpCO0FBQ0EsWUFBRyxPQUFPdEgsSUFBSXVILFlBQVgsS0FBNEIsVUFBL0IsRUFBMEM7QUFDekN2SCxjQUFJdUgsWUFBSixDQUFpQnRJLEtBQUtnRSxPQUF0QjtBQUNBO0FBQ0Q7QUFDQSxXQUFLLHNCQUFZdUUsV0FBakI7QUFDQSxZQUFHLE9BQU94SCxJQUFJeUQsV0FBWCxLQUEyQixVQUE5QixFQUF5QztBQUN2Q3pELGNBQUl5RCxXQUFKLENBQWdCeEUsS0FBS2dFLE9BQXJCO0FBQ0Q7QUFsQkg7QUFvQkQsR0F4QkQ7O0FBMEJDakQsTUFBSWdELE9BQUosR0FBYyxVQUFTeUUsUUFBVCxFQUFrQjtBQUM1QixRQUFJUixlQUFlLElBQWYsSUFBdUJ6SSxZQUFZbUMsVUFBWixFQUEzQixFQUFxRDtBQUNuRHNHLG1CQUFhLElBQUlTLFNBQUosQ0FBYyxxQkFBZCxFQUFxQ2xKLFlBQVlrQyxRQUFaLEVBQXJDLENBQWI7O0FBRUF1RyxpQkFBV1UsTUFBWCxHQUFvQixZQUFXO0FBQzdCckksZ0JBQVFDLEdBQVIsQ0FBWSxpQkFBWjtBQUNELE9BRkQ7O0FBSUEwSCxpQkFBVy9ELFNBQVgsR0FBdUIsVUFBU0QsT0FBVCxFQUFpQjs7QUFFcENpRSxzQkFBY2pFLE9BQWQ7QUFDSCxPQUhEO0FBS0Q7QUFDRixHQWRIOztBQWdCRGpELE1BQUk0SCxJQUFKLEdBQVcsVUFBUzNFLE9BQVQsRUFBaUI7O0FBRTFCRCxZQUFRNEUsSUFBUixDQUFhM0UsT0FBYjtBQUNELEdBSEQ7O0FBS0FqRCxNQUFJa0YsVUFBSjtBQUNBbEYsTUFBSXVILFlBQUo7QUFDQXZILE1BQUk2SCxRQUFKO0FBQ0E3SCxNQUFJeUQsV0FBSjs7QUFFQyxTQUFPekQsR0FBUDtBQUdELENBM0RpQyxDQUFsQyxFOzs7Ozs7QUNOQSwyQkFBMkIsYUFBYSxFQUFFO0FBQzFDO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQiw4QkFBOEI7QUFDbEQsR0FBRztBQUNILEVBQUU7QUFDRjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3pDQTs7Ozs7OztBQ0FBLGtCQUFrQiw0TkFBNE4sZUFBZSw4SUFBOEksMk9BQTJPLHFGQUFxRixvQ0FBb0MsNkRBQTZELHNDQUFzQyxnQkFBZ0Isa0JBQWtCLGtGQUFrRixrQkFBa0IsaUZBQWlGLHVKQUF1SixpTEFBaUwsZ0JBQWdCLGNBQWMsWUFBWSxrQkFBa0Isc1BBQXNQLDJFQUEyRSxZQUFZLHFHQUFxRyxvQjs7Ozs7Ozs7Ozs7O0FDQS8xRCxJQUFNOEgsY0FBYztBQUNsQlYsYUFBVyxXQURPO0FBRWxCQyxjQUFZLFlBRk07QUFHbEJDLGdCQUFjLGNBSEk7QUFJbEJFLGVBQWE7QUFKSyxDQUFwQjs7a0JBT2VNLFc7Ozs7Ozs7OztBQ1BmM0osSUFBSUMsVUFBSixDQUFlLGtCQUFmLEVBQW1DLENBQUMsUUFBRCxFQUFVLGFBQVYsRUFBd0IsWUFBeEIsRUFBcUMsV0FBckMsRUFBaUQsV0FBakQsRUFBNkQsVUFBU0MsTUFBVCxFQUFpQjhELFdBQWpCLEVBQTZCK0IsVUFBN0IsRUFBd0M2RCxTQUF4QyxFQUFtREMsU0FBbkQsRUFBNkQ7O0FBRTNKdEYsVUFBUUMsT0FBUixDQUFnQmpFLFFBQWhCLEVBQTBCQyxLQUExQixDQUFnQyxZQUFZO0FBQzFDRixNQUFFLFFBQUYsRUFBWUcsS0FBWjtBQUNBSCxNQUFFLFFBQUYsRUFBWW1FLGVBQVo7QUFDQyxHQUhIOztBQUtFdkUsU0FBTzRKLFFBQVAsR0FBa0IsRUFBbEI7QUFDRjVKLFNBQU9tQixJQUFQLEdBQWM7QUFDWjRCLGNBQVMsRUFERztBQUVaMEMsY0FBUyxFQUZHO0FBR1prQyxlQUFVLEVBSEU7QUFJWkMsY0FBUyxFQUpHO0FBS1ppQyxnQkFBVyxFQUxDO0FBTVozRyxZQUFPLEVBTks7QUFPWjRFLGFBQVEsRUFQSTtBQVFaRCxXQUFNLEVBUk07QUFTWkUsYUFBUSxFQVRJO0FBVVpkLFdBQU0sRUFWTTtBQVdaNkMsb0JBQWU7QUFYSCxHQUFkOztBQWNBOUosU0FBT21JLFdBQVAsR0FBcUIsWUFBVTs7QUFFN0IsUUFBSUMsT0FBT3BJLE9BQU9vSSxJQUFsQjtBQUNBbkgsWUFBUUMsR0FBUixDQUFZa0gsSUFBWjtBQUNBbkgsWUFBUUMsR0FBUixDQUFZLGFBQWFrSCxJQUF6QjtBQUNBLFFBQUlDLFlBQVksY0FBaEI7QUFDRHhDLGVBQVd5QyxlQUFYLENBQTJCRixJQUEzQixFQUFpQ0MsU0FBakMsRUFBNEMzSCxJQUE1QyxDQUFpRCxVQUFTQyxHQUFULEVBQWE7QUFDNURYLGFBQU9tQixJQUFQLENBQVk4RixLQUFaLEdBQW9CdEcsSUFBSUMsSUFBSixDQUFTMkgsSUFBN0I7QUFDRG5ILGtCQUFZQyxLQUFaLENBQWtCLDhCQUFsQixFQUFrRCxJQUFsRCxFQUF3RCxPQUF4RDtBQUNELEtBSEEsRUFHQyxZQUFVO0FBQ1ZELGtCQUFZQyxLQUFaLENBQWtCLDZCQUFsQixFQUFpRCxJQUFqRCxFQUF1RCxLQUF2RDtBQUNELEtBTEE7QUFNRCxHQVpBOztBQWNGckIsU0FBTytKLFlBQVAsR0FBc0JMLFNBQXRCO0FBQ0ExSixTQUFPZ0ssWUFBUCxHQUFzQkwsU0FBdEI7O0FBRUUzSixTQUFPdUQsUUFBUCxHQUFrQixZQUFXO0FBQzNCLFFBQUkwRyxXQUFXN0osRUFBRSxXQUFGLEVBQWVvRSxHQUFmLEVBQWY7QUFDQSxRQUFJMEYsV0FBVzlKLEVBQUUsYUFBRixFQUFpQm9FLEdBQWpCLEVBQWY7O0FBRUF4RSxXQUFPbUIsSUFBUCxDQUFZMkksY0FBWixHQUE2QkksUUFBN0I7QUFDQSxRQUFHLENBQUNsSyxPQUFPbUIsSUFBUCxDQUFZNEIsUUFBYixJQUF5QixDQUFDL0MsT0FBT21CLElBQVAsQ0FBWXNFLFFBQXRDLElBQWtELENBQUN3RSxRQUF0RCxFQUErRDtBQUM3RDdJLGtCQUFZQyxLQUFaLENBQWtCLHVDQUFsQixFQUEwRCxJQUExRCxFQUErRCxLQUEvRDtBQUNBO0FBQ0Q7QUFDRHlDLGdCQUFZUCxRQUFaLENBQXFCdkQsT0FBT21CLElBQTVCLEVBQWtDVCxJQUFsQyxDQUF1QyxVQUFTQyxHQUFULEVBQWE7QUFDakRNLGNBQVFDLEdBQVIsQ0FBWVAsR0FBWjtBQUNBbUQsa0JBQVlxRyxXQUFaLENBQXdCLEVBQUN0SixRQUFPRixJQUFJQyxJQUFKLENBQVN3SixFQUFqQixFQUFvQkMsWUFBV0osUUFBL0IsRUFBeEIsRUFBa0V2SixJQUFsRSxDQUF1RSxVQUFTRSxJQUFULEVBQWM7QUFDcEZRLG9CQUFZQyxLQUFaLENBQWtCLDhCQUFsQixFQUFpRCxJQUFqRCxFQUFzRCxPQUF0RDtBQUNBO0FBQ0EsT0FIRCxFQUdHaUosS0FISCxDQUdTLFVBQVMvSSxHQUFULEVBQWE7QUFDckJILG9CQUFZQyxLQUFaLENBQWtCLGtDQUFsQixFQUFxRCxJQUFyRCxFQUEwRCxLQUExRDtBQUNBLE9BTEQ7QUFPRixLQVRELEVBU0dpSixLQVRILENBU1MsVUFBUzdELEtBQVQsRUFBZTtBQUN0QnJGLGtCQUFZQyxLQUFaLENBQWtCLGtDQUFsQixFQUFxRCxJQUFyRCxFQUEwRCxLQUExRDtBQUNELEtBWEQ7QUFZRCxHQXJCRDtBQXdCRCxDQS9Ea0MsQ0FBbkM7O0FBbUVBdkIsSUFBSXlLLFNBQUosQ0FBYyxXQUFkLEVBQTJCLENBQUMsWUFBVztBQUNyQyxTQUFPO0FBQ0xDLFdBQU87QUFDTEMsaUJBQVcsR0FETjtBQUVMQyxtQkFBYTtBQUZSLEtBREY7QUFLTEMsVUFBTSxjQUFTSCxLQUFULEVBQWdCbEcsT0FBaEIsRUFBeUJzRyxVQUF6QixFQUFxQztBQUN6Q3RHLGNBQVF1RyxJQUFSLENBQWEsUUFBYixFQUF1QixVQUFTQyxXQUFULEVBQXNCO0FBQzNDTixjQUFNQyxTQUFOLEdBQWtCSyxZQUFZQyxNQUFaLENBQW1CQyxLQUFuQixDQUF5QixDQUF6QixDQUFsQjtBQUNBLFlBQUlDLFNBQVMsSUFBSUMsVUFBSixFQUFiO0FBQ0FELGVBQU9FLE1BQVAsR0FBZ0IsVUFBU0MsU0FBVCxFQUFvQjtBQUNsQ1osZ0JBQU1wRyxNQUFOLENBQWEsWUFBVztBQUN0Qm9HLGtCQUFNRSxXQUFOLEdBQW9CVSxVQUFVTCxNQUFWLENBQWlCTSxNQUFyQztBQUNELFdBRkQ7QUFHRCxTQUpEO0FBS0FKLGVBQU9LLGFBQVAsQ0FBcUJkLE1BQU1DLFNBQTNCO0FBQ0QsT0FURDtBQVVEO0FBaEJJLEdBQVA7QUFrQkQsQ0FuQjBCLENBQTNCOztBQXFCQTNLLElBQUl5TCxPQUFKLENBQVksWUFBWixFQUEwQixDQUFDLE9BQUQsRUFBUyxhQUFULEVBQXdCLFVBQVU3SixLQUFWLEVBQWdCdkIsV0FBaEIsRUFBNkI7QUFDN0UsT0FBS21JLGVBQUwsR0FBdUIsVUFBU0YsSUFBVCxFQUFlQyxTQUFmLEVBQXlCO0FBQzdDLFFBQUltRCxLQUFLLElBQUlDLFFBQUosRUFBVDtBQUNBRCxPQUFHRSxNQUFILENBQVUsTUFBVixFQUFrQnRELElBQWxCOztBQUdBLFdBQU8xRyxNQUFNRSxJQUFOLENBQVd5RyxTQUFYLEVBQXNCbUQsRUFBdEIsRUFBMEIsRUFBQ0csa0JBQWtCdEgsUUFBUXVILFFBQTNCO0FBQ2hDQyxlQUFTLEVBQUMsZ0JBQWdCQyxTQUFqQixFQUEyQixpQkFBZ0IsWUFBVzNMLFlBQVlrQyxRQUFaLEVBQXRELEVBRHVCLEVBQTFCLENBQVA7QUFJRixHQVREO0FBVUQsQ0FYeUIsQ0FBMUIsRTs7Ozs7Ozs7O0FDeEZBdkMsSUFBSUMsVUFBSixDQUFlLFlBQWYsRUFBNkIsQ0FBQyxRQUFELEVBQVUsZUFBVixFQUEwQixRQUExQixFQUFtQyxZQUFuQyxFQUFpRCxVQUFTQyxNQUFULEVBQWlCK0wsYUFBakIsRUFBZ0NySCxNQUFoQyxFQUF3Q21CLFVBQXhDLEVBQW1EOztBQUUvSDdGLFNBQU84RSxVQUFQLEdBQW9CSixNQUFwQjs7QUFFQXRFLElBQUVDLFFBQUYsRUFBWUMsS0FBWixDQUFrQixZQUFVO0FBQzFCRixNQUFFLFFBQUYsRUFBWUcsS0FBWjtBQUNELEdBRkQ7O0FBSUFQLFNBQU9nTSxNQUFQLEdBQWdCLFVBQVNDLEtBQVQsRUFBZTtBQUM3QkYsa0JBQWNDLE1BQWQsQ0FBcUJDLEtBQXJCLEVBQTRCdkwsSUFBNUIsQ0FBaUMsVUFBU0MsR0FBVCxFQUFhO0FBQzVDUyxrQkFBWUMsS0FBWixDQUFrQlYsSUFBSUMsSUFBSixDQUFTZ0UsT0FBM0IsRUFBb0MsSUFBcEMsRUFBMEMsT0FBMUM7QUFDRCxLQUZELEVBRUcsVUFBU3JELEdBQVQsRUFBYTtBQUNkSCxrQkFBWUMsS0FBWixDQUFrQkUsSUFBSVgsSUFBSixDQUFTZ0UsT0FBM0IsRUFBb0MsSUFBcEMsRUFBMEMsS0FBMUM7QUFDRCxLQUpEO0FBS0QsR0FORDs7QUFRQTVFLFNBQU9rTSxNQUFQLEdBQWdCLFVBQVNELEtBQVQsRUFBZTtBQUM3QkYsa0JBQWNHLE1BQWQsQ0FBcUJELEtBQXJCLEVBQTRCdkwsSUFBNUIsQ0FBaUMsVUFBU0MsR0FBVCxFQUFhO0FBQzVDWCxhQUFPOEUsVUFBUCxDQUFrQmdDLElBQWxCLENBQXVCbUYsS0FBdkI7QUFDQWpNLGFBQU9vRSxNQUFQO0FBQ0FoRCxrQkFBWUMsS0FBWixDQUFrQlYsSUFBSUMsSUFBSixDQUFTZ0UsT0FBM0IsRUFBb0MsSUFBcEMsRUFBMEMsT0FBMUM7QUFDRCxLQUpELEVBSUcsVUFBU3JELEdBQVQsRUFBYTtBQUNkSCxrQkFBWUMsS0FBWixDQUFrQkUsSUFBSVgsSUFBSixDQUFTZ0UsT0FBM0IsRUFBb0MsSUFBcEMsRUFBMEMsS0FBMUM7QUFDRCxLQU5EO0FBT0QsR0FSRDs7QUFVQTVFLFNBQU9tTSxNQUFQLEdBQWdCLFVBQVMvQixFQUFULEVBQVk7QUFDMUIyQixrQkFBY0ssTUFBZCxDQUFxQmhDLEVBQXJCLEVBQXlCMUosSUFBekIsQ0FBOEIsVUFBU0MsR0FBVCxFQUFhO0FBQ3pDWCxhQUFPOEUsVUFBUCxDQUFrQnVDLE9BQWxCLENBQTBCLGlCQUFPO0FBQy9CLFlBQUc0RSxNQUFNaEosR0FBTixLQUFjbUgsRUFBakIsRUFBb0I7QUFDbEJwSyxpQkFBTzhFLFVBQVAsQ0FBa0J1SCxHQUFsQixDQUFzQkosS0FBdEI7QUFDRDtBQUNGLE9BSkQ7QUFLQTdLLGtCQUFZQyxLQUFaLENBQWtCVixJQUFJQyxJQUFKLENBQVNnRSxPQUEzQixFQUFvQyxJQUFwQyxFQUEwQyxPQUExQztBQUNELEtBUEQsRUFPRyxVQUFTckQsR0FBVCxFQUFhO0FBQ2RILGtCQUFZQyxLQUFaLENBQWtCRSxJQUFJWCxJQUFKLENBQVNnRSxPQUEzQixFQUFvQyxJQUFwQyxFQUEwQyxLQUExQztBQUNELEtBVEQ7QUFVRCxHQVhEOztBQWFBNUUsU0FBT08sS0FBUCxHQUFlLEVBQWY7QUFDQVAsU0FBT3NNLFNBQVAsR0FBbUIsVUFBU0wsS0FBVCxFQUFlO0FBQ2hDak0sV0FBT08sS0FBUCxDQUFhMEwsS0FBYixHQUFxQkEsS0FBckI7QUFDQTdMLE1BQUUsY0FBRixFQUFrQkcsS0FBbEIsQ0FBd0IsTUFBeEI7QUFDRCxHQUhEO0FBSUFQLFNBQU91TSxVQUFQLEdBQW9CLFlBQVU7QUFDNUJuTSxNQUFFLGNBQUYsRUFBa0JHLEtBQWxCLENBQXdCLE9BQXhCO0FBQ0QsR0FGRDs7QUFJQVAsU0FBT3lJLFdBQVAsR0FBcUIsVUFBU3dELEtBQVQsRUFBZTtBQUNsQ0Ysa0JBQWNDLE1BQWQsQ0FBcUJDLEtBQXJCLEVBQTRCdkwsSUFBNUIsQ0FBaUMsVUFBU0MsR0FBVCxFQUFhO0FBQzVDUyxrQkFBWUMsS0FBWixDQUFrQlYsSUFBSUMsSUFBSixDQUFTZ0UsT0FBM0IsRUFBb0MsSUFBcEMsRUFBMEMsT0FBMUM7QUFDQXhFLFFBQUUsY0FBRixFQUFrQkcsS0FBbEIsQ0FBd0IsT0FBeEI7QUFDRCxLQUhELEVBR0csVUFBU2dCLEdBQVQsRUFBYTtBQUNkSCxrQkFBWUMsS0FBWixDQUFrQkUsSUFBSVgsSUFBSixDQUFTZ0UsT0FBM0IsRUFBb0MsSUFBcEMsRUFBMEMsS0FBMUM7QUFDRCxLQUxEO0FBTUQsR0FQRDtBQVFBNUUsU0FBT3dNLFNBQVAsR0FBbUIsWUFBVTtBQUMzQnhNLFdBQU9PLEtBQVAsQ0FBYTBMLEtBQWIsR0FBcUIsRUFBckI7QUFDQWpNLFdBQU9PLEtBQVAsQ0FBYTBMLEtBQWIsQ0FBbUJRLEdBQW5CLEdBQXlCLElBQXpCO0FBQ0FyTSxNQUFFLGNBQUYsRUFBa0JHLEtBQWxCLENBQXdCLE1BQXhCO0FBQ0QsR0FKRDs7QUFNQVAsU0FBT21JLFdBQVAsR0FBcUIsWUFBVTs7QUFFN0IsUUFBSUMsT0FBT3BJLE9BQU9vSSxJQUFsQjtBQUNBbkgsWUFBUUMsR0FBUixDQUFZa0gsSUFBWjtBQUNBbkgsWUFBUUMsR0FBUixDQUFZLGFBQWFrSCxJQUF6QjtBQUNBLFFBQUlDLFlBQVksbUJBQWhCO0FBQ0R4QyxlQUFXeUMsZUFBWCxDQUEyQkYsSUFBM0IsRUFBaUNDLFNBQWpDLEVBQTRDM0gsSUFBNUMsQ0FBaUQsVUFBU0MsR0FBVCxFQUFhO0FBQzVEWCxhQUFPTyxLQUFQLENBQWEwTCxLQUFiLENBQW1CaEYsS0FBbkIsR0FBMkJ0RyxJQUFJQyxJQUFKLENBQVMySCxJQUFwQztBQUNEbkgsa0JBQVlDLEtBQVosQ0FBa0IsOEJBQWxCLEVBQWtELElBQWxELEVBQXdELE9BQXhEO0FBQ0QsS0FIQSxFQUdDLFVBQVNFLEdBQVQsRUFBYTtBQUNiTixjQUFRQyxHQUFSLENBQVlLLEdBQVo7QUFDQUgsa0JBQVlDLEtBQVosQ0FBa0IsNkJBQWxCLEVBQWlELElBQWpELEVBQXVELEtBQXZEO0FBQ0QsS0FOQTtBQU9ELEdBYkE7QUFjRCxDQTVFNEIsQ0FBN0IsRTs7Ozs7Ozs7O0FDQUF2QixJQUFJMkIsT0FBSixDQUFZLGVBQVosRUFBNEIsQ0FBQyxPQUFELEVBQVMsYUFBVCxFQUF3QixVQUFTQyxLQUFULEVBQWdCdkIsV0FBaEIsRUFBNEI7QUFDOUUsTUFBTXdCLE1BQU0sRUFBWjs7QUFFQUEsTUFBSStLLE1BQUosR0FBYSxZQUFVO0FBQ25CLFdBQU9oTCxNQUFNSyxHQUFOLENBQVUsWUFBVixFQUF1QixFQUFDOEosU0FBUSxFQUFDLGlCQUFpQixZQUFXMUwsWUFBWWtDLFFBQVosRUFBN0IsRUFBVCxFQUF2QixDQUFQO0FBQ0gsR0FGRDs7QUFJQVYsTUFBSUksR0FBSixHQUFVLFVBQVNxSSxFQUFULEVBQVk7QUFDcEIsV0FBTzFJLE1BQU1LLEdBQU4sQ0FBVSxZQUFXcUksRUFBckIsRUFBeUIsRUFBQ3lCLFNBQVEsRUFBQyxpQkFBaUIsWUFBVzFMLFlBQVlrQyxRQUFaLEVBQTdCLEVBQVQsRUFBekIsQ0FBUDtBQUNELEdBRkQ7O0FBSUFWLE1BQUlxSyxNQUFKLEdBQWEsVUFBU0MsS0FBVCxFQUFlO0FBQzFCaEwsWUFBUUMsR0FBUixDQUFZK0ssS0FBWjtBQUNBLFdBQU92SyxNQUFNaUwsR0FBTixDQUFVLFlBQVdWLE1BQU1oSixHQUEzQixFQUFnQ2dKLEtBQWhDLEVBQXVDLEVBQUNKLFNBQVEsRUFBQyxpQkFBaUIsWUFBVzFMLFlBQVlrQyxRQUFaLEVBQTdCLEVBQVQsRUFBdkMsQ0FBUDtBQUNELEdBSEQ7O0FBS0FWLE1BQUl1SyxNQUFKLEdBQWEsVUFBU0QsS0FBVCxFQUFlO0FBQzFCLFdBQU92SyxNQUFNRSxJQUFOLENBQVcsZUFBWCxFQUE0QnFLLEtBQTVCLEVBQW1DLEVBQUNKLFNBQVEsRUFBQyxpQkFBaUIsWUFBVzFMLFlBQVlrQyxRQUFaLEVBQTdCLEVBQVQsRUFBbkMsQ0FBUDtBQUNELEdBRkQ7O0FBSUFWLE1BQUl5SyxNQUFKLEdBQWEsVUFBU2hDLEVBQVQsRUFBWTtBQUN2QixXQUFPMUksTUFBTTBLLE1BQU4sQ0FBYSxZQUFXaEMsRUFBeEIsRUFBNEIsRUFBQ3lCLFNBQVEsRUFBQyxpQkFBaUIsWUFBVzFMLFlBQVlrQyxRQUFaLEVBQTdCLEVBQVQsRUFBNUIsQ0FBUDtBQUNELEdBRkQ7O0FBSUFWLE1BQUlpTCxNQUFKLEdBQWEsVUFBUzNGLEtBQVQsRUFBZTtBQUMxQixXQUFPdkYsTUFBTUUsSUFBTixDQUFXLG9CQUFYLEVBQWlDcUYsS0FBakMsRUFBd0MsRUFBQzRFLFNBQVEsRUFBQyxpQkFBaUIsWUFBVzFMLFlBQVlrQyxRQUFaLEVBQTdCLEVBQVQsRUFBeEMsQ0FBUDtBQUNELEdBRkQ7QUFHQSxTQUFPVixHQUFQO0FBQ0QsQ0E1QjJCLENBQTVCLEU7Ozs7Ozs7OztBQ0lBN0IsSUFBSUMsVUFBSixDQUFlLFdBQWYsRUFBMkIsQ0FBQyxRQUFELEVBQVUsV0FBVixFQUFzQixjQUF0QixFQUFzQyxVQUFTQyxNQUFULEVBQWlCMkosU0FBakIsRUFBNEIvRCxZQUE1QixFQUF5QztBQUN6RzVGLFNBQU82TSxhQUFQLEdBQXVCbEQsU0FBdkI7O0FBRUEzSixTQUFPbUMsS0FBUCxHQUFlO0FBQ1oySyxpQkFBWSxFQURBO0FBRVpDLGlCQUFZLEVBRkE7QUFHWmpGLGFBQVEsRUFISTtBQUlaa0YsZ0JBQVcsRUFKQztBQUtaQyxpQkFBWSxFQUxBO0FBTVpDLGVBQVU7O0FBTkUsR0FBZjtBQVNBLE1BQUlDLGtCQUFrQixTQUFsQkEsZUFBa0IsR0FBVTtBQUMvQixRQUFJQyxJQUFJLENBQUMsS0FBS0MsS0FBS0MsTUFBTCxFQUFOLEVBQXFCQyxRQUFyQixFQUFSO0FBQ0EsUUFBSUMsTUFBTUosRUFBRXpLLEtBQUYsQ0FBUSxFQUFSLENBQVY7QUFDQSxXQUFPNkssSUFBSUosRUFBRUssTUFBRixHQUFTLENBQWIsSUFBZ0JELElBQUlKLEVBQUVLLE1BQUYsR0FBUyxDQUFiLENBQWhCLEdBQWdDRCxJQUFJSixFQUFFSyxNQUFGLEdBQVMsQ0FBYixDQUFoQyxHQUFnREQsSUFBSUosRUFBRUssTUFBRixHQUFTLENBQWIsQ0FBdkQ7QUFDRCxHQUpBOztBQU1BcEosVUFBUUMsT0FBUixDQUFnQmpFLFFBQWhCLEVBQTBCQyxLQUExQixDQUFnQyxZQUFZOztBQUUzQ0YsTUFBRSxRQUFGLEVBQVltRSxlQUFaO0FBQ0MsR0FIRjs7QUFLQ3ZFLFNBQU8wTixhQUFQLEdBQXVCLFlBQVU7QUFDL0IxTixXQUFPbUMsS0FBUCxDQUFhNkssVUFBYixHQUEwQjVNLEVBQUUsYUFBRixFQUFpQm9FLEdBQWpCLEVBQTFCOztBQUVBdkQsWUFBUUMsR0FBUixDQUFZbEIsT0FBT21DLEtBQVAsQ0FBYTZLLFVBQXpCO0FBQ0EsUUFBRyxDQUFDaE4sT0FBT21DLEtBQVAsQ0FBYTRLLFdBQWQsSUFBNkIsQ0FBQy9NLE9BQU9tQyxLQUFQLENBQWE2SyxVQUE5QyxFQUF5RDtBQUN2RDVMLGtCQUFZQyxLQUFaLENBQWtCLDRCQUFsQixFQUFnRCxJQUFoRCxFQUFzRCxLQUF0RDtBQUNBO0FBQ0Q7O0FBRURyQixXQUFPbUMsS0FBUCxDQUFhMkssV0FBYixHQUEyQkssaUJBQTNCOztBQUVBdkgsaUJBQWErSCxXQUFiLENBQXlCM04sT0FBT21DLEtBQWhDLEVBQXVDekIsSUFBdkMsQ0FBNEMsVUFBU0UsSUFBVCxFQUFjO0FBQ3hEUSxrQkFBWUMsS0FBWixDQUFrQiw0QkFBbEIsRUFBZ0QsSUFBaEQsRUFBc0QsT0FBdEQ7QUFDRCxLQUZELEVBRUUsVUFBU0UsR0FBVCxFQUFhO0FBQ2JILGtCQUFZQyxLQUFaLENBQWtCLGdDQUFsQixFQUFvRCxJQUFwRCxFQUEwRCxLQUExRDtBQUNELEtBSkQ7QUFNRCxHQWpCRDtBQXNCRCxDQTdDMEIsQ0FBM0IsRTs7Ozs7Ozs7O0FDSkF2QixJQUFJMkIsT0FBSixDQUFZLGNBQVosRUFBNEIsQ0FBQyxPQUFELEVBQVUsYUFBVixFQUF5QixVQUFVQyxLQUFWLEVBQWlCdkIsV0FBakIsRUFBOEI7O0FBRWpGLE1BQUl3QixNQUFNO0FBQ1JpRixlQUFXO0FBREgsR0FBVjtBQUdBakYsTUFBSWlNLGVBQUosR0FBc0IsWUFBWTtBQUNoQyxRQUFJMUssU0FBUy9DLFlBQVkrQyxNQUFaLEVBQWI7QUFDQSxXQUFPeEIsTUFBTUssR0FBTixDQUFVLGtCQUFrQm1CLE1BQTVCLEVBQW9DO0FBQ3pDMkksZUFBUztBQUNQLHlCQUFpQixZQUFZMUwsWUFBWWtDLFFBQVo7QUFEdEI7QUFEZ0MsS0FBcEMsQ0FBUDtBQUtELEdBUEQ7O0FBU0FWLE1BQUlnRixXQUFKLEdBQWtCLFlBQVk7QUFDNUIsV0FBT2pGLE1BQU1LLEdBQU4sQ0FBVSxrQkFBa0I1QixZQUFZK0MsTUFBWixFQUE1QixFQUFrRDtBQUN2RDJJLGVBQVM7QUFDUCx5QkFBaUIsWUFBWTFMLFlBQVlrQyxRQUFaO0FBRHRCO0FBRDhDLEtBQWxELEVBSUozQixJQUpJLENBSUMsVUFBVUMsR0FBVixFQUFlO0FBQ3JCZ0IsVUFBSWlGLFNBQUosR0FBZ0JqRyxJQUFJQyxJQUFwQjtBQUNBLGFBQU9ELElBQUlDLElBQVg7QUFDRCxLQVBNLENBQVA7QUFRRCxHQVREOztBQVdBZSxNQUFJeUYsV0FBSixHQUFrQixVQUFVRCxPQUFWLEVBQW1CO0FBQ25DLFdBQU96RixNQUFNaUwsR0FBTixDQUFVLG1CQUFtQnhGLE9BQW5CLEdBQTZCLEdBQTdCLEdBQW1DaEgsWUFBWTZDLGFBQVosRUFBN0MsRUFBMEUsRUFBMUUsRUFBOEU7QUFDbkY2SSxlQUFTO0FBQ1AseUJBQWlCLFlBQVkxTCxZQUFZa0MsUUFBWjtBQUR0QjtBQUQwRSxLQUE5RSxDQUFQO0FBS0QsR0FORDs7QUFRQVYsTUFBSThGLGdCQUFKLEdBQXVCLFVBQVVOLE9BQVYsRUFBbUI7QUFDeEMsV0FBT3pGLE1BQU1pTCxHQUFOLENBQVUsb0JBQW9CeEYsT0FBcEIsR0FBOEIsR0FBOUIsR0FBb0NoSCxZQUFZNkMsYUFBWixFQUE5QyxFQUEyRSxFQUEzRSxFQUErRTtBQUNwRjZJLGVBQVM7QUFDUCx5QkFBaUIsWUFBWTFMLFlBQVlrQyxRQUFaO0FBRHRCO0FBRDJFLEtBQS9FLENBQVA7QUFLRCxHQU5EOztBQVFBVixNQUFJZ00sV0FBSixHQUFrQixVQUFVeEwsS0FBVixFQUFpQjtBQUNqQ2xCLFlBQVFDLEdBQVIsQ0FBWWYsWUFBWStDLE1BQVosRUFBWjtBQUNBZixVQUFNK0ssU0FBTixHQUFrQi9NLFlBQVk2QyxhQUFaLEVBQWxCO0FBQ0FiLFVBQU1lLE1BQU4sR0FBZS9DLFlBQVkrQyxNQUFaLEVBQWY7QUFDQSxXQUFPeEIsTUFBTUUsSUFBTixDQUFXLGVBQVgsRUFBNEJPLEtBQTVCLEVBQW1DO0FBQ3hDMEosZUFBUztBQUNQLHlCQUFpQixZQUFZMUwsWUFBWWtDLFFBQVo7QUFEdEI7QUFEK0IsS0FBbkMsQ0FBUDtBQUtELEdBVEQ7O0FBV0EsU0FBT1YsR0FBUDtBQUNELENBckQyQixDQUE1QixFOzs7Ozs7Ozs7QUNBQTdCLElBQUkyQixPQUFKLENBQVksYUFBWixFQUEyQixDQUFDLE9BQUQsRUFBVSxTQUFWLEVBQW9CLGFBQXBCLEVBQW1DLFVBQVVDLEtBQVYsRUFBaUJNLE9BQWpCLEVBQXlCN0IsV0FBekIsRUFBc0M7O0FBR2xHLE1BQUlnQixPQUFPLEVBQVg7O0FBRUFBLE9BQUswTSxXQUFMLEdBQW1CLFlBQVU7QUFDM0IsV0FBT25NLE1BQU1LLEdBQU4sQ0FBVSxZQUFWLEVBQXVCLEVBQUM4SixTQUFRLEVBQUMsaUJBQWdCLFlBQVcxTCxZQUFZa0MsUUFBWixFQUE1QixFQUFULEVBQXZCLEVBQXNGM0IsSUFBdEYsQ0FBMkYsVUFBU0MsR0FBVCxFQUFhOztBQUU3RyxhQUFPQSxJQUFJQyxJQUFYO0FBQ0QsS0FITSxDQUFQO0FBSUQsR0FMRDs7QUFPQU8sT0FBSzRGLGNBQUwsR0FBc0IsWUFBVTtBQUM1QixXQUFPckYsTUFBTUssR0FBTixDQUFVLFdBQVU1QixZQUFZNkMsYUFBWixFQUFwQixFQUFpRCxFQUFDNkksU0FBUSxFQUFDLGlCQUFnQixZQUFXMUwsWUFBWWtDLFFBQVosRUFBNUIsRUFBVCxFQUFqRCxDQUFQO0FBQ0gsR0FGRDs7QUFJQWxCLE9BQUsyTSxlQUFMLEdBQXVCLFlBQVU7QUFDL0IsV0FBT3BNLE1BQU1LLEdBQU4sQ0FBVSxnQkFBVixFQUE0QixFQUFDOEosU0FBUSxFQUFDLGlCQUFnQixZQUFXMUwsWUFBWWtDLFFBQVosRUFBNUIsRUFBVCxFQUE1QixFQUEyRjNCLElBQTNGLENBQWdHLFVBQVNDLEdBQVQsRUFBYTtBQUNsSCxhQUFPQSxJQUFJQyxJQUFYO0FBQ0QsS0FGTSxDQUFQO0FBR0QsR0FKRDs7QUFNQU8sT0FBS29DLFFBQUwsR0FBZ0IsVUFBUzNDLElBQVQsRUFBYzs7QUFFNUIsV0FBT2MsTUFBTUUsSUFBTixDQUFXLFdBQVgsRUFBdUJoQixJQUF2QixDQUFQO0FBQ0QsR0FIRDs7QUFLQU8sT0FBS2dKLFdBQUwsR0FBbUIsVUFBU3ZKLElBQVQsRUFBYztBQUMvQixXQUFPYyxNQUFNaUwsR0FBTixDQUFVLGVBQWEvTCxLQUFLQyxNQUFsQixHQUF5QixHQUF6QixHQUE2QkQsS0FBS3lKLFVBQTVDLEVBQXVELEVBQXZELEVBQTJELEVBQUN3QixTQUFRLEVBQUMsaUJBQWdCLFlBQVUxTCxZQUFZa0MsUUFBWixFQUEzQixFQUFULEVBQTNELENBQVA7QUFDRCxHQUZEOztBQUlBbEIsT0FBSzRNLGdCQUFMLEdBQXdCLFlBQVU7QUFDaEMsV0FBT3JNLE1BQU1LLEdBQU4sQ0FBVSxzQkFBVixFQUFrQyxFQUFDOEosU0FBUSxFQUFDLGlCQUFnQixZQUFVMUwsWUFBWWtDLFFBQVosRUFBM0IsRUFBVCxFQUFsQyxFQUFnRzNCLElBQWhHLENBQXFHLFVBQVNDLEdBQVQsRUFBYTtBQUNySCxhQUFPQSxJQUFJQyxJQUFYO0FBQ0gsS0FGTSxDQUFQO0FBR0QsR0FKRDs7QUFNQU8sT0FBSzZNLGlCQUFMLEdBQXlCLFlBQVU7QUFDakMsV0FBT3RNLE1BQU1pTCxHQUFOLENBQVUscUJBQW1CL0wsS0FBS0MsTUFBeEIsR0FBK0IsR0FBL0IsR0FBbUNELEtBQUtxTixhQUFMLENBQW1CN0QsRUFBaEUsRUFBb0UsRUFBcEUsRUFBd0UsRUFBQ3lCLFNBQVEsRUFBQyxpQkFBZ0IsWUFBVTFMLFlBQVlrQyxRQUFaLEVBQTNCLEVBQVQsRUFBeEUsQ0FBUDtBQUNELEdBRkQ7O0FBSUFsQixPQUFLdUgsVUFBTCxHQUFrQixVQUFTdkgsSUFBVCxFQUFjO0FBQzlCLFdBQU9PLE1BQU1pTCxHQUFOLENBQVUsV0FBU3hNLFlBQVk2QyxhQUFaLEVBQW5CLEVBQWdEN0IsSUFBaEQsRUFBc0QsRUFBQzBLLFNBQVEsRUFBQyxpQkFBZ0IsWUFBVTFMLFlBQVlrQyxRQUFaLEVBQTNCLEVBQVQsRUFBdEQsQ0FBUDtBQUNELEdBRkQ7QUFHQSxTQUFPbEIsSUFBUDtBQUNELENBN0MwQixDQUEzQixFIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIkY6XFxcXFByb2plY3RzXFxcXEthbmthaU11bmljaXBhbGl0eVxcXFxzcmNcXFxccHVibGljXFxcXGphdmFzY3JpcHRzXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgODU0ODM4MDA5N2NhM2U1ZWZhODUiLCJhcHAuY29udHJvbGxlcignYXR0ZW5kYW5jZUN0cmwnLCBbJyRzY29wZScsICdhdHRlbmRhbmNlU2VydmljZScsICdmaW5nZXJQcmludFNlcnZpY2UnLCdhdXRoU2VydmljZScsIGZ1bmN0aW9uKCRzY29wZSwgYXR0ZW5kU2VydmljZSwgZmluZ2VyUHJpbnRTZXJ2aWNlICxhdXRoU2VydmljZSl7XG5cbiAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAkKCcubW9kYWwnKS5tb2RhbCgpO1xuICB9KVxuJHNjb3BlLmF0dGVuZCA9IGZ1bmN0aW9uKCl7XG4gIGZpbmdlclByaW50U2VydmljZS52ZXJpZnkoKS50aGVuKGZ1bmN0aW9uKHJlcyl7XG5cbiAgICB2YXIgZGF0YSA9IHtcblxuICAgIH1cbiAgICBkYXRhLnVzZXJpZCA9IHJlcy5kYXRhLnVzZXJpZDtcbiAgICBkYXRhLmRhdGUgPSBuZXcgRGF0ZSgpLnRvRGF0ZVN0cmluZygpO1xuXG4gICAgYXR0ZW5kU2VydmljZS5hdHRlbmQoZGF0YSkudGhlbihmdW5jdGlvbihyZXMpe1xuICAgICAgY29uc29sZS5sb2cocmVzLmRhdGEpO1xuICAgICAgJHNjb3BlLnVzZXIgPSByZXMuZGF0YTtcbiAgICAgIE1hdGVyaWFsaXplLnRvYXN0KFwiQXR0ZW5kYW5jZSBkb25lICFcIiwgMzAwMCwgJ2dyZWVuJyk7XG4gICAgICAkKCcjdXNlcmRldGFpbCcpLm1vZGFsKCdvcGVuJyk7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJyN1c2VyZGV0YWlsJykubW9kYWwoJ2Nsb3NlJyk7XG4gICAgICB9LFxuICAgICAgNTAwMClcbiAgICB9LCBmdW5jdGlvbihlcnIpe1xuICAgICAgIE1hdGVyaWFsaXplLnRvYXN0KFwiRXJyb3Igb2NjdXJyZWQgIVwiLCAzMDAwLCAncmVkJyk7XG4gICAgfSlcblxuXG4gIH0sIGZ1bmN0aW9uKGVycil7XG5cbiAgICBpZihlcnIuc3RhdHVzPT00MDQpe1xuICAgICAgTWF0ZXJpYWxpemUudG9hc3QoXCJGaW5nZXIgUHJpbnQgTm90IFJlZ2lzdGVyZWQgIVwiLCAzMDAwLCAncmVkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIE1hdGVyaWFsaXplLnRvYXN0KFwiRXJyb3IgT2NjdXJyZWQgIVwiLCAzMDAwLCAncmVkJyk7XG4gICAgfVxuICB9KVxuXG59XG59XSlcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3B1YmxpYy9qYXZhc2NyaXB0cy9tdmMvYXR0ZW5kYW5jZUN0cmwuanMiLCJhcHAuZmFjdG9yeSgnYXR0ZW5kYW5jZVNlcnZpY2UnLCBbJyRodHRwJywgZnVuY3Rpb24oJGh0dHApe1xuXG4gIHZhciBvYmogPSB7fTtcblxuICBvYmouYXR0ZW5kID0gZnVuY3Rpb24oZGF0YSl7XG4gICAgcmV0dXJuICRodHRwLnBvc3QoJy9hdHRlbmRhbmNlL2F0dGVuZCcsZGF0YSk7XG4gIH1cblxuICBvYmouZ2V0QXR0ZW5kID0gZnVuY3Rpb24odXNlcmlkLCB0eXBlPVwidG9kYXlcIil7XG4gICAgICByZXR1cm4gJGh0dHAuZ2V0KGAvYXR0ZW5kYW5jZS8ke3VzZXJpZH1gKTtcbiAgfVxuXG5cbiAgcmV0dXJuIG9iajtcbn1dKVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vcHVibGljL2phdmFzY3JpcHRzL212Yy9hdHRlbmRhbmNlU2VydmljZS5qcyIsImFwcC5mYWN0b3J5KCdhdXRoU2VydmljZScsIFsnJGh0dHAnLCAnJHdpbmRvdycsIGZ1bmN0aW9uICgkaHR0cCwgJHdpbmRvdykge1xuXG4gIHZhciBhdXRoID0ge307XG5cbiAgYXV0aC5zYXZlVG9rZW4gPSBmdW5jdGlvbiAodG9rZW4pIHtcbiAgICAkd2luZG93LmxvY2FsU3RvcmFnZVsna2Fua2FpJ109IHRva2VuO1xuICB9XG5cbiAgYXV0aC5nZXRUb2tlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJHdpbmRvdy5sb2NhbFN0b3JhZ2VbJ2thbmthaSddO1xuICB9XG5cbiAgYXV0aC5pc0xvZ2dlZEluID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciB0b2tlbiA9IGF1dGguZ2V0VG9rZW4oKTtcblxuICAgIGlmICh0b2tlbikge1xuICAgICAgdmFyIHBheWxvYWQgPSBKU09OLnBhcnNlKCR3aW5kb3cuYXRvYih0b2tlbi5zcGxpdCgnLicpWzFdKSk7XG5cbiAgICAgIHJldHVybiBwYXlsb2FkLmV4cCA+IERhdGUubm93KCkgLyAxMDAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZyhcIk5vdCBsb2dnZWQgSW5cIik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9O1xuXG4gIGF1dGguY3VycmVudFVzZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGF1dGguaXNMb2dnZWRJbigpKSB7XG4gICAgICB2YXIgdG9rZW4gPSBhdXRoLmdldFRva2VuKCk7XG4gICAgICB2YXIgcGF5bG9hZCA9IEpTT04ucGFyc2UoJHdpbmRvdy5hdG9iKHRva2VuLnNwbGl0KCcuJylbMV0pKTtcblxuICAgICAgcmV0dXJuIHBheWxvYWQudXNlcm5hbWU7XG4gICAgfVxuICB9O1xuXG4gIGF1dGguY3VycmVudFVzZXJJZCA9IGZ1bmN0aW9uKCl7XG4gICAgaWYgKGF1dGguaXNMb2dnZWRJbigpKSB7XG4gICAgICB2YXIgdG9rZW4gPSBhdXRoLmdldFRva2VuKCk7XG4gICAgICB2YXIgcGF5bG9hZCA9IEpTT04ucGFyc2UoJHdpbmRvdy5hdG9iKHRva2VuLnNwbGl0KCcuJylbMV0pKTtcbiAgICAgIHJldHVybiBwYXlsb2FkLl9pZDtcbiAgICB9XG4gIH1cblxuICBhdXRoLndhcmRubyA9IGZ1bmN0aW9uKCl7XG4gICAgaWYgKGF1dGguaXNMb2dnZWRJbigpKSB7XG4gICAgICB2YXIgdG9rZW4gPSBhdXRoLmdldFRva2VuKCk7XG4gICAgICB2YXIgcGF5bG9hZCA9IEpTT04ucGFyc2UoJHdpbmRvdy5hdG9iKHRva2VuLnNwbGl0KCcuJylbMV0pKTtcblxuICAgICAgcmV0dXJuIHBheWxvYWQud2FyZG5vO1xuICAgIH1cbiAgfVxuXG4gIGF1dGguaGFzUGVybWlzc2lvbiA9IChwZXJtaXNzaW9uKSA9PiB7XG4gICAgaWYgKGF1dGguaXNMb2dnZWRJbigpKSB7XG4gICAgICB2YXIgdG9rZW4gPSBhdXRoLmdldFRva2VuKCk7XG4gICAgICB2YXIgcGF5bG9hZCA9IEpTT04ucGFyc2UoJHdpbmRvdy5hdG9iKHRva2VuLnNwbGl0KCcuJylbMV0pKTtcblxuICAgICAgcmV0dXJuIHBheWxvYWQucGVybWlzc2lvbnMuaW5jbHVkZXMocGVybWlzc2lvbik7XG4gICAgfVxuICB9XG4gIGF1dGgucmVnaXN0ZXIgPSBmdW5jdGlvbiAodXNlcikge1xuICAgIHJldHVybiAkaHR0cC5wb3N0KCcvcmVnaXN0ZXInLCB1c2VyKS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICBhdXRoLnNhdmVUb2tlbihkYXRhLnRva2VuKTtcbiAgICB9KTtcbiAgfTtcblxuICBhdXRoLmxvZ0luID0gZnVuY3Rpb24gKHVzZXIpIHtcbiAgICByZXR1cm4gJGh0dHAucG9zdCgnL2xvZ2luJywgdXNlcik7XG5cbiAgfTtcblxuICBhdXRoLmhhc1Blcm1pc3Npb25Gb3IgPSBzdGF0ZW5hbWUgPT4ge1xuICAgIHN3aXRjaChzdGF0ZW5hbWUpe1xuICAgICAgY2FzZSAncmVnaXN0ZXJwcmludCc6XG4gICAgICBjYXNlICdyZWdpc3RlcnVzZXInOlxuICAgICAgcmV0dXJuIGF1dGguaGFzUGVybWlzc2lvbigncmVnaXN0ZXJ1c2VyJyk7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBhdXRoLmxvZ091dCA9IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zb2xlLmxvZygnTG9nZ2luZyBvdXQgdXNlcicpO1xuICAgICR3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2thbmthaScpO1xuICB9XG4gIHJldHVybiBhdXRoO1xufV0pO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vcHVibGljL2phdmFzY3JpcHRzL212Yy9hdXRoU2VydmljZS5qcyIsImFwcC5jb250cm9sbGVyKCdmaW5nZXJQcmludEN0cmwnLCBbJyRzY29wZScsJ2ZpbmdlclByaW50U2VydmljZScsJ3VzZXJTZXJ2aWNlJywndXNlcnMnLGZ1bmN0aW9uKCRzY29wZSxmaW5nZXJQcmludFNlcnZpY2UsdXNlclNlcnZpY2UsIHVzZXJzKXtcblxuXG4gIGNvbnNvbGUubG9nKHVzZXJzKTtcbiAgJHNjb3BlLnVzZXJsaXN0ICA9IHVzZXJzO1xuICAkc2NvcGUudXNlcmlkPScnO1xuXG5cbiAgJHNjb3BlLnJlZ2lzdGVyID0geydzdWNjZXNzJzonJywgJ2ZhaWxlZCc6Jyd9O1xuXG4gICRzY29wZS52ZXJpZnk9IHsnc3VjY2Vzcyc6JycsJ2ZhaWxlZCc6Jyd9O1xuXG5cblxuICB2YXIgY2xlYXIgPSBmdW5jdGlvbigpe1xuXG4gICAgJHNjb3BlLnZlcmlmeS5zdWNjZXNzPWZhbHNlO1xuICAgICRzY29wZS52ZXJpZnkuZmFpbGVkPWZhbHNlO1xuICAgICRzY29wZS5yZWdpc3Rlci5zdWNjZXNzPWZhbHNlO1xuICAgICRzY29wZS5yZWdpc3Rlci5mYWlsZWQ9ZmFsc2U7XG5cbiAgfVxuICBjbGVhcigpO1xuXG4gICQoJyN1c2VyaWQnKS5jaGFuZ2UoZnVuY3Rpb24oKXtcbiAgICAgIGNsZWFyKCk7XG4gICAgICAkc2NvcGUuJGFwcGx5KCk7XG4gIH0pO1xuXG4gIGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICQoJy5tb2RhbCcpLm1vZGFsKCk7XG4gICAgJCgnc2VsZWN0JykubWF0ZXJpYWxfc2VsZWN0KCk7XG4gICAgfSk7XG5cblxuXG5cbiRzY29wZS5yZWdpc3RlciA9IGZ1bmN0aW9uKCl7XG4gICAkc2NvcGUudXNlcmlkID0gJChcIiN1c2VyaWRcIikudmFsKCk7XG4gICRzY29wZS5yZWdpc3Rlci5zdWNjZXNzPScnO1xuICAkc2NvcGUucmVnaXN0ZXIuZmFpbGVkPScnO1xuICBpZighJHNjb3BlLnVzZXJpZClcbiAge1xuICAgIE1hdGVyaWFsaXplLnRvYXN0KCdTZWxlY3QgdGhlIHVzZXInLCAzMDAwLCdyZWQnKTtcbiAgICByZXR1cm47XG4gIH1cbiAgZmluZ2VyUHJpbnRTZXJ2aWNlLnJlZ2lzdGVyKCRzY29wZS51c2VyaWQpLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgICBNYXRlcmlhbGl6ZS50b2FzdChcIkZpbmdlciBQcmludCBSZWdpc3RlclwiLCAzMDAwLCBcImdyZWVuXCIpO1xuICAgICRzY29wZS5yZWdpc3Rlci5zdWNjZXNzID0gdHJ1ZTtcbiAgfSwgZnVuY3Rpb24oZXJyKXtcbiAgICBNYXRlcmlhbGl6ZS50b2FzdChcIkVycm9yIG9jY3VycmVkIHdoaWxlIHJlZ2lzdGVyaW5nIGZpbmdlcnByaW50XCIsIDMwMDAsIFwicmVkXCIpO1xuICAgICRzY29wZS5yZWdpc3Rlci5mYWlsZWQgPSB0cnVlO1xuICB9KVxufVxuXG5cblxuJHNjb3BlLnZlcmlmeSA9IGZ1bmN0aW9uKCl7XG4gICRzY29wZS52ZXJpZnkuc3VjY2Vzcz0nJztcbiAgJHNjb3BlLnZlcmlmeS5mYWlsZWQ9Jyc7XG4gIGZpbmdlclByaW50U2VydmljZS52ZXJpZnkoKS50aGVuKGZ1bmN0aW9uKHJlcyl7XG4gICAgTWF0ZXJpYWxpemUudG9hc3QoXCJGaW5nZXIgUHJpbnQgaXMgb2YgXCIrIHJlcy5kYXRhLnVzZXJpZCwgMzAwMCwgXCJncmVlblwiKTtcbiAgICAkc2NvcGUudmVyaWZ5LnN1Y2Nlc3MgPSB0cnVlO1xuICB9LCBmdW5jdGlvbihlcnIpe1xuICAgIE1hdGVyaWFsaXplLnRvYXN0KFwiRXJyb3Igb2NjdXJyZWQgd2hpbGUgcmVhZGluZyBmaW5nZXJwcmludFwiLCAzMDAwLCBcInJlZFwiKTtcbiAgICAkc2NvcGUudmVyaWZ5LmZhaWxlZCA9IHRydWU7XG4gIH0pXG59XG5cblxufV0pO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vcHVibGljL2phdmFzY3JpcHRzL212Yy9maW5nZXJQcmludEN0cmwuanMiLCJhcHAuZmFjdG9yeSgnZmluZ2VyUHJpbnRTZXJ2aWNlJywgWyckaHR0cCcsIGZ1bmN0aW9uKCRodHRwKXtcblxuICB2YXIgb2JqID0ge307XG5cbiAgb2JqLnJlZ2lzdGVyID0gZnVuY3Rpb24odXNlcmlkKXtcbiAgICByZXR1cm4gJGh0dHAucG9zdCgnL3JlZ2lzdGVyUHJpbnQnLCB7J3VzZXJpZCc6dXNlcmlkfSk7XG4gIH1cblxuICBvYmoudmVyaWZ5ID0gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gJGh0dHAucG9zdCgnL3ZlcmlmeVByaW50Jyx7fSk7XG4gIH1cblxuICByZXR1cm4gb2JqO1xufV0pXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wdWJsaWMvamF2YXNjcmlwdHMvbXZjL2ZpbmdlclByaW50U2VydmljZS5qcyIsIlxuXG5cblxuYXBwLmNvbnRyb2xsZXIoJ0hvbWVDdHJsJyxbJyRzY29wZScsJyRodHRwJywnbm90aWZpY2F0aW9uU2VydmljZScsJ3NsaWRlcycsIGZ1bmN0aW9uKCRzY29wZSwkaHR0cCxub3RpZmljYXRpb25TZXJ2aWNlLHNsaWRlcyl7XG4gbm90aWZpY2F0aW9uU2VydmljZS5jb25uZWN0KGZ1bmN0aW9uKG1lc3NhZ2Upe1xuICBtZXNzYWdlLm9ubWVzc2FnZShmdW5jdGlvbihtZXNzYWdlKXtcbiAgICBjb25zb2xlLmxvZyhtZXNzYWdlKTtcbiAgfSlcbiB9KTtcbiAkc2NvcGUuc2xpZGVzbGlzdCA9IHNsaWRlcztcbiAkc2NvcGUuc2xpZGVBbGlnbiA9IFsnbGVmdC1hbGlnbicsJ2NlbnRlci1hbGlnbicsJ3JpZ2h0LWFsaWduJ107XG4gJHNjb3BlLmNhbGxlZHRva2VuID0gJyc7XG4gJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgJCgnLmNhcm91c2VsLmNhcm91c2VsLXNsaWRlcicpLmNhcm91c2VsKHtmdWxsV2lkdGg6IHRydWV9KTtcbiAgJCgnLnNsaWRlcicpLnNsaWRlcigpO1xufSk7XG5cbm5vdGlmaWNhdGlvblNlcnZpY2UudG9rZW5jYWxsZWQgPSBmdW5jdGlvbihtZXNzYWdlKXtcbiAgTWF0ZXJpYWxpemUudG9hc3QobWVzc2FnZSwzMDAwLFwiZ3JlZW5cIik7XG4gICQoJyNmaXhlZC1pdGVtJykuYWRkQ2xhc3MoJ3dvYmJsZSBhbmltYXRlZCcpO1xuICAkc2NvcGUuY2FsbGVkdG9rZW49bWVzc2FnZTtcbiAgJHNjb3BlLiRhcHBseSgpO1xuXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAkKCcjZml4ZWQtaXRlbScpLnJlbW92ZUNsYXNzKCd3b2JibGUgYW5pbWF0ZWQnKTtcbiAgICAkc2NvcGUuY2FsbGVkdG9rZW49Jyc7XG4gICAgJHNjb3BlLiRhcHBseSgpO1xuICB9LDQwMDApO1xufVxuXG59XSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wdWJsaWMvamF2YXNjcmlwdHMvbXZjL2hvbWVDdHJsLmpzIiwiYXBwLmZhY3RvcnkoJ0hvbWVTZXJpdmNlJyxbJyRodHRwJywnbm90aWZpY2F0aW9uU2VydmljZScgLGZ1bmN0aW9uKCRodHRwLCBub3RpZmljYXRpb25TZXJ2aWNlKXtcblxufV0pO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vcHVibGljL2phdmFzY3JpcHRzL212Yy9ob21lU2VydmljZS5qcyIsImFwcC5jb250cm9sbGVyKCdMb2dpbkN0cmwnLFsnJHNjb3BlJywnYXV0aFNlcnZpY2UnLCckc3RhdGUnLCBmdW5jdGlvbigkc2NvcGUsIGF1dGgsJHN0YXRlKXtcblxuICAkc2NvcGUubG9naW4gPSBmdW5jdGlvbigpe1xuICAgIGlmKCEkc2NvcGUudXNlcm5hbWUgJiYgISRzY29wZS5wYXNzd29yZCl7XG4gICAgICBNYXRlcmlhbGl6ZS50b2FzdChcIkZpbGwgdXAgYWxsIHRoZSBmaWVsZHNcIiwgMTUwMCAsXCJyZWRcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgYXV0aC5sb2dJbih7J3VzZXJuYW1lJzokc2NvcGUudXNlcm5hbWUsJ3Bhc3N3b3JkJzokc2NvcGUucGFzc3dvcmQgfSkudGhlbihmdW5jdGlvbihyZXMpe1xuICAgICAgYXV0aC5zYXZlVG9rZW4ocmVzLmRhdGEudG9rZW4pO1xuICAgICAgJHN0YXRlLmdvKCdob21lJyx7fSx7cmVsb2FkOnRydWV9KTtcbiAgfSxmdW5jdGlvbihyZXMpe1xuICAgIE1hdGVyaWFsaXplLnRvYXN0KFwiSW52YWxpZCBDcmVkZW50aWFsc1wiLCAxNTAwICxcInJlZFwiKTtcbiAgfVxuICApO1xuICB9XG5cblxufV0pO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vcHVibGljL2phdmFzY3JpcHRzL212Yy9sb2dpbkN0cmwuanMiLCJcblxuYXBwLmNvbnRyb2xsZXIoJ25hdkN0cmwnLCBbJyRzY29wZScsICdhdXRoU2VydmljZScsICckc3RhdGUnLCAndG9rZW5TZXJ2aWNlJywgJ25vdGlmaWNhdGlvblNlcnZpY2UnLCAndXNlclNlcnZpY2UnLCAnZmlsZVVwbG9hZCcsIGZ1bmN0aW9uICgkc2NvcGUsIGF1dGhTZXJ2aWNlLCAkc3RhdGUsIHRva2VuU2VydmljZSwgbm90aWZpY2F0aW9uU2VydmljZSwgdXNlclNlcnZpY2UsIGZpbGVVcGxvYWQpIHtcblxuICBub3RpZmljYXRpb25TZXJ2aWNlLmNvbm5lY3QoKTtcbiAgJHNjb3BlLmlzTG9nZ2VkSW4gPSBhdXRoU2VydmljZS5pc0xvZ2dlZEluO1xuXG4gICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcblxuXG4gICAgJCgnLm1vZGFsJykubW9kYWwoKTtcblxuXG4gICAgJCgnLmRyb3Bkb3duLWJ1dHRvbicpLmRyb3Bkb3duKHtcbiAgICAgIGluRHVyYXRpb246IDMwMCxcbiAgICAgIG91dER1cmF0aW9uOiAyMjUsXG4gICAgICBjb25zdHJhaW5XaWR0aDogZmFsc2UsXG4gICAgICBndXR0ZXI6IDAsIC8vIFNwYWNpbmcgZnJvbSBlZGdlXG4gICAgICBiZWxvd09yaWdpbjogdHJ1ZSwgLy8gRGlzcGxheXMgZHJvcGRvd24gYmVsb3cgdGhlIGJ1dHRvblxuICAgICAgYWxpZ25tZW50OiAnbGVmdCcsIC8vIERpc3BsYXlzIGRyb3Bkb3duIHdpdGggZWRnZSBhbGlnbmVkIHRvIHRoZSBsZWZ0XG4gICAgICBzdG9wUHJvcGFnYXRpb246IGZhbHNlIC8vIFN0b3BzIGV2ZW50IHByb3BhZ2F0aW9uXG4gICAgfSk7XG4gIH0pXG5cbiAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghJHNjb3BlLnVzZXJuYW1lIHx8ICEkc2NvcGUucGFzc3dvcmQpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiRmlsbCBhbGwgdGhlIGZpZWxkcy5cIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG5cbiAgICAkc2NvcGUuc2hvd0hpZGVNZW51ID0gKCkgPT4ge1xuICAgICAgJCgnLmJ1dHRvbi1jb2xsYXBzZScpLnNpZGVOYXYoJ3Nob3cnKTtcblxuICAgICAgJCgnLmJ1dHRvbi1jb2xsYXBzZScpLnNpZGVOYXYoJ2hpZGUnKTtcbiAgICB9XG5cbiAgICB2YXIgdXNlckNyZWQgPSB7XG4gICAgICB1c2VybmFtZTogJHNjb3BlLnVzZXJuYW1lLFxuICAgICAgcGFzc3dvcmQ6ICRzY29wZS5wYXNzd29yZFxuICAgIH07XG5cbiAgICBhdXRoU2VydmljZS5sb2dJbih1c2VyQ3JlZCkudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIlN1Y2Nlc3NmdWxseSBsb2dnZWQgaW4gXCIpO1xuICAgICAgY29uc29sZS5sb2cocmVzLmRhdGEudG9rZW4pO1xuICAgICAgYXV0aFNlcnZpY2Uuc2F2ZVRva2VuKHJlcy5kYXRhLnRva2VuKTtcbiAgICAgICRzY29wZS5pc0xvZ2dlZEluID0gYXV0aFNlcnZpY2UuaXNMb2dnZWRJbigpO1xuICAgICAgJHN0YXRlLmdvKCdob21lJywge30sIHtcbiAgICAgICAgcmVsb2FkOiB0cnVlXG4gICAgICB9KTtcbiAgICAgICQoJyNsb2dpbk1vZGFsJykubW9kYWwoJ2hpZGUnKTtcbiAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkVycm9yIHdoaWxlIGxvZ2dpbmcgaW4gXCIpO1xuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgIH0pO1xuICB9XG5cbiAgJHNjb3BlLmxvZ291dCA9IGZ1bmN0aW9uICgpIHtcblxuICAgIGF1dGhTZXJ2aWNlLmxvZ091dCgpO1xuICAgICRzdGF0ZS5nbygnbG9naW4nKTtcblxuICB9XG5cblxuICB0b2tlblNlcnZpY2UudG9kYXlUb2tlbnMoKS50aGVuKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgJHNjb3BlLnRva2VubGlzdCA9IHRva2VuU2VydmljZS50b2tlbmxpc3Q7XG4gICAgLy8kc2NvcGUudG9rZW5saXN0ID0gZGF0YTtcbiAgfSk7XG5cbiAgbm90aWZpY2F0aW9uU2VydmljZS50b2tlbmFkZGVkID0gZnVuY3Rpb24gKHRva2VuKSB7XG4gICAgY29uc29sZS5sb2codG9rZW4pO1xuICAgICRzY29wZS50b2tlbmxpc3QucHVzaCh0b2tlbik7XG4gICAgJHNjb3BlLiRhcHBseSgpO1xuICB9XG5cbiAgdXNlclNlcnZpY2UuZ2V0VXNlckRldGFpbHMoKS50aGVuKGZ1bmN0aW9uKHJlcyl7XG4gICAgJHNjb3BlLnByb2ZpbGVwaWMgPSBcIi9pbWFnZXMvdXNlcnMvXCIrcmVzLmRhdGEuaW1hZ2U7XG4gIH0pXG5cbiAgJHNjb3BlLmNhbGxUb2tlbiA9IGZ1bmN0aW9uICh0b2tlbmlkKSB7XG4gICAgdG9rZW5TZXJ2aWNlLmhhbmRsZVRva2VuKHRva2VuaWQpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuXG4gICAgICBNYXRlcmlhbGl6ZS50b2FzdChcIlRva2VuIENhbGxlZCBcIiwgMjAwMCwgXCJncmVlblwiKTtcbiAgICAgICRzY29wZS50b2tlbmxpc3QuZm9yRWFjaCgoZWxlbWVudCwgaSkgPT4ge1xuICAgICAgICBpZiAoZWxlbWVudC5faWQgPT0gdG9rZW5pZCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGkpO1xuXG4gICAgICAgICAgJHNjb3BlLnRva2VubGlzdFtpXS5oYW5kbGVkYnkgPSByZXMuZGF0YS5oYW5kbGVkYnk7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICBNYXRlcmlhbGl6ZS50b2FzdChcIkVycm9yIHdoaWxlIGNhbGxpbmcgdG9rZW5cIiwgMjAwMCwgXCJyZWRcIik7XG4gICAgfSlcbiAgfVxuXG4gICRzY29wZS5tYXJrRG9uZSA9IGZ1bmN0aW9uICh0b2tlbmlkKSB7XG4gICAgdG9rZW5TZXJ2aWNlLmNvbXBsZXRlSGFuZGxpbmcodG9rZW5pZCkudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgTWF0ZXJpYWxpemUudG9hc3QoXCJUb2tlbiBNYXJrZWQgYXMgRG9uZVwiLCAyMDAwLCBcImdyZWVuXCIpO1xuICAgICAgJHNjb3BlLnRva2VubGlzdC5mb3JFYWNoKChlbGVtZW50LCBpKSA9PiB7XG4gICAgICAgIGlmIChlbGVtZW50Ll9pZCA9PSB0b2tlbmlkKSB7XG4gICAgICAgICAgJHNjb3BlLnRva2VubGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgTWF0ZXJpYWxpemUudG9hc3QoXCJFcnJvciB3aGlsZSBjbG9zaW5nIHRva2VuXCIsIDIwMDAsIFwicmVkXCIpO1xuICAgIH0pXG4gIH1cblxuICAkc2NvcGUudXNlciA9IHtcbiAgICBmaXJzdG5hbWU6ICcnLFxuICAgIGxhc3RuYW1lOiAnJyxcbiAgICBpbWFnZTogJycsXG4gICAgZW1haWw6ICcnLFxuICAgIHBob25lbm86ICcnLFxuICAgIGFkZHJlc3M6ICcnLFxuICAgIHBhc3N3b3JkOiAnJ1xuICB9XG4gICRzY29wZS5zaG93cHJvZmlsZW1vZGFsID0gZnVuY3Rpb24gKCkge1xuICAgIHVzZXJTZXJ2aWNlLmdldFVzZXJEZXRhaWxzKCkudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAkc2NvcGUudXNlciA9IHJlcy5kYXRhO1xuICAgICAgJHNjb3BlLnVzZXIucGhvbmVubyA9IHJlcy5kYXRhLnBob25lbm8uJG51bWJlckRlY2ltYWw7XG4gICAgICAkKCcjbW9kYWwxJykubW9kYWwoJ29wZW4nKTtcbiAgICAgIE1hdGVyaWFsaXplLnVwZGF0ZVRleHRGaWVsZHMoKTtcbiAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgIH0pO1xuXG4gIH1cblxuICAkc2NvcGUudXBsb2FkSW1hZ2UgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICB2YXIgZmlsZSA9ICRzY29wZS5maWxlO1xuICAgIGNvbnNvbGUubG9nKGZpbGUpO1xuICAgIGNvbnNvbGUubG9nKCdmaWxlIGlzICcgKyBmaWxlKTtcbiAgICB2YXIgdXBsb2FkVXJsID0gXCIvdXBsb2FkSW1hZ2VcIjtcbiAgICBmaWxlVXBsb2FkLnVwbG9hZEZpbGVUb1VybChmaWxlLCB1cGxvYWRVcmwpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgJHNjb3BlLnVzZXIuaW1hZ2UgPSByZXMuZGF0YS5wYXRoO1xuICAgICAgTWF0ZXJpYWxpemUudG9hc3QoXCJJbWFnZSBVcGxvYWRlZCBTdWNjZXNzZnVsbHkhXCIsIDMwMDAsIFwiZ3JlZW5cIik7XG4gICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgTWF0ZXJpYWxpemUudG9hc3QoXCJFcnJvciB3aGlsZSB1cGxvYWRpbmcgaW1hZ2VcIiwgMzAwMCwgXCJyZWRcIik7XG4gICAgfSk7XG4gIH07XG5cbiAgJHNjb3BlLmNsb3NlcHJvZmlsZW1vZGFsID0gZnVuY3Rpb24gKCkge1xuXG4gIH1cblxuXG4gICRzY29wZS5zYXZlY2hhbmdlcyA9IGZ1bmN0aW9uICgpIHtcblxuICAgIHVzZXJTZXJ2aWNlLnVwZGF0ZVVzZXIoJHNjb3BlLnVzZXIpLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgTWF0ZXJpYWxpemUudG9hc3QoXCJVc2VyIHByb2ZpbGUgdXBkYXRlZCFcIiwgMjAwMCwgJ2dyZWVuJyk7XG4gICAgICAkKCcjbW9kYWwxJykubW9kYWwoJ2Nsb3NlJyk7XG4gICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgTWF0ZXJpYWxpemUudG9hc3QoXCJFcnJvciB3aGlsZSB1cGRhdGluZyBwcm9maWxlIVwiLCAyMDAwLCAncmVkJyk7XG4gICAgfSlcbiAgfVxuICAkc2NvcGUuaGFzUGVybWlzc2lvbiA9IGF1dGhTZXJ2aWNlLmhhc1Blcm1pc3Npb247XG59XSlcblxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vcHVibGljL2phdmFzY3JpcHRzL212Yy9uYXZDdHJsLmpzIiwiaW1wb3J0IHsgY2xpZW50IH0gZnJvbSAnd2Vic29ja2V0JztcbmltcG9ydCAgTWVzc2FnZVR5cGUgIGZyb20gJy4uLy4uLy4uL25vdGlmaWNhdGlvbi9tZXNzYWdldHlwZSc7XG5cblxuY29uc3Qgd2ViU29ja2V0ID0gY2xpZW50O1xudmFyIGNvbm5lY3Rpb24gPSBudWxsO1xuYXBwLmZhY3RvcnkoJ25vdGlmaWNhdGlvblNlcnZpY2UnLFsndXNlclNlcnZpY2UnLCdhdXRoU2VydmljZScsIGZ1bmN0aW9uKHVzZXJTZXJ2aWNlLCBhdXRoU2VydmljZSl7XG5cbiB2YXIgb2JqID0geyB9O1xuXG4gdmFyIGhhbmRsZU1lc3NhZ2UgPSBmdW5jdGlvbihtZXNzYWdlKXtcblxuICB2YXIgZGF0YSA9IEpTT04ucGFyc2UobWVzc2FnZS5kYXRhKTtcbiAgY29uc29sZS5sb2coZGF0YSk7XG4gICBzd2l0Y2goZGF0YS5tZXNzYWdlVHlwZSl7XG4gICAgIGNhc2UgTWVzc2FnZVR5cGUuQlJPQURDQVNUOlxuICAgICAvL1RPRE86IE5vdGlmaWNhdGlvblxuICAgICBicmVhaztcbiAgICAgY2FzZSBNZXNzYWdlVHlwZS5UT0tFTkFEREVEOlxuICAgICBjb25zb2xlLmxvZyhtZXNzYWdlKTtcbiAgICAgaWYodHlwZW9mIG9iai50b2tlbmFkZGVkID09PSAnZnVuY3Rpb24nKXtcbiAgICAgb2JqLnRva2VuYWRkZWQoZGF0YS5tZXNzYWdlKTtcbiAgICAgfVxuICAgICBicmVhaztcbiAgICAgY2FzZSBNZXNzYWdlVHlwZS5UT0tFTlJFTU9WRUQ6XG4gICAgIGlmKHR5cGVvZiBvYmoudG9rZW5yZW1vdmVkID09PSAnZnVuY3Rpb24nKXtcbiAgICAgIG9iai50b2tlbnJlbW92ZWQoZGF0YS5tZXNzYWdlKTtcbiAgICAgfVxuICAgICBicmVhaztcbiAgICAgY2FzZSBNZXNzYWdlVHlwZS5UT0tFTkNBTExFRDpcbiAgICAgaWYodHlwZW9mIG9iai50b2tlbmNhbGxlZCA9PT0gJ2Z1bmN0aW9uJyl7XG4gICAgICAgb2JqLnRva2VuY2FsbGVkKGRhdGEubWVzc2FnZSk7XG4gICAgIH1cbiAgIH1cbiB9XG5cbiAgb2JqLmNvbm5lY3QgPSBmdW5jdGlvbihjYWxsYmFjayl7XG4gICAgICBpZiAoY29ubmVjdGlvbiA9PT0gbnVsbCAmJiBhdXRoU2VydmljZS5pc0xvZ2dlZEluKCkpIHtcbiAgICAgICAgY29ubmVjdGlvbiA9IG5ldyBXZWJTb2NrZXQoJ3dzOi8vMTI3LjAuMC4xOjkwMDknLCBhdXRoU2VydmljZS5nZXRUb2tlbigpKTtcblxuICAgICAgICBjb25uZWN0aW9uLm9ub3BlbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ29ubmVjdGlvbiBPcGVuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29ubmVjdGlvbi5vbm1lc3NhZ2UgPSBmdW5jdGlvbihtZXNzYWdlKXtcblxuICAgICAgICAgICAgaGFuZGxlTWVzc2FnZShtZXNzYWdlKTtcbiAgICAgICAgfVxuXG4gICAgICB9XG4gICAgfVxuXG4gb2JqLnNlbmQgPSBmdW5jdGlvbihtZXNzYWdlKXtcblxuICAgY29ubmVjdC5zZW5kKG1lc3NhZ2UpO1xuIH1cblxuIG9iai50b2tlbmFkZGVkIDtcbiBvYmoudG9rZW5yZW1vdmVkIDtcbiBvYmoudXBsb2FkZWQ7XG4gb2JqLnRva2VuY2FsbGVkO1xuXG4gIHJldHVybiBvYmo7XG5cblxufV0pXG5cblxuXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wdWJsaWMvamF2YXNjcmlwdHMvbXZjL3B1c2hOb3RpZmljYXRpb24uanMiLCJ2YXIgX2dsb2JhbCA9IChmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pKCk7XG52YXIgTmF0aXZlV2ViU29ja2V0ID0gX2dsb2JhbC5XZWJTb2NrZXQgfHwgX2dsb2JhbC5Nb3pXZWJTb2NrZXQ7XG52YXIgd2Vic29ja2V0X3ZlcnNpb24gPSByZXF1aXJlKCcuL3ZlcnNpb24nKTtcblxuXG4vKipcbiAqIEV4cG9zZSBhIFczQyBXZWJTb2NrZXQgY2xhc3Mgd2l0aCBqdXN0IG9uZSBvciB0d28gYXJndW1lbnRzLlxuICovXG5mdW5jdGlvbiBXM0NXZWJTb2NrZXQodXJpLCBwcm90b2NvbHMpIHtcblx0dmFyIG5hdGl2ZV9pbnN0YW5jZTtcblxuXHRpZiAocHJvdG9jb2xzKSB7XG5cdFx0bmF0aXZlX2luc3RhbmNlID0gbmV3IE5hdGl2ZVdlYlNvY2tldCh1cmksIHByb3RvY29scyk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0bmF0aXZlX2luc3RhbmNlID0gbmV3IE5hdGl2ZVdlYlNvY2tldCh1cmkpO1xuXHR9XG5cblx0LyoqXG5cdCAqICduYXRpdmVfaW5zdGFuY2UnIGlzIGFuIGluc3RhbmNlIG9mIG5hdGl2ZVdlYlNvY2tldCAodGhlIGJyb3dzZXIncyBXZWJTb2NrZXRcblx0ICogY2xhc3MpLiBTaW5jZSBpdCBpcyBhbiBPYmplY3QgaXQgd2lsbCBiZSByZXR1cm5lZCBhcyBpdCBpcyB3aGVuIGNyZWF0aW5nIGFuXG5cdCAqIGluc3RhbmNlIG9mIFczQ1dlYlNvY2tldCB2aWEgJ25ldyBXM0NXZWJTb2NrZXQoKScuXG5cdCAqXG5cdCAqIEVDTUFTY3JpcHQgNTogaHR0cDovL2JjbGFyeS5jb20vMjAwNC8xMS8wNy8jYS0xMy4yLjJcblx0ICovXG5cdHJldHVybiBuYXRpdmVfaW5zdGFuY2U7XG59XG5pZiAoTmF0aXZlV2ViU29ja2V0KSB7XG5cdFsnQ09OTkVDVElORycsICdPUEVOJywgJ0NMT1NJTkcnLCAnQ0xPU0VEJ10uZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KFczQ1dlYlNvY2tldCwgcHJvcCwge1xuXHRcdFx0Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIE5hdGl2ZVdlYlNvY2tldFtwcm9wXTsgfVxuXHRcdH0pO1xuXHR9KTtcbn1cblxuLyoqXG4gKiBNb2R1bGUgZXhwb3J0cy5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgJ3czY3dlYnNvY2tldCcgOiBOYXRpdmVXZWJTb2NrZXQgPyBXM0NXZWJTb2NrZXQgOiBudWxsLFxuICAgICd2ZXJzaW9uJyAgICAgIDogd2Vic29ja2V0X3ZlcnNpb25cbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy93ZWJzb2NrZXQvbGliL2Jyb3dzZXIuanNcbi8vIG1vZHVsZSBpZCA9IDExXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vcGFja2FnZS5qc29uJykudmVyc2lvbjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3dlYnNvY2tldC9saWIvdmVyc2lvbi5qc1xuLy8gbW9kdWxlIGlkID0gMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSB7XCJfZnJvbVwiOlwid2Vic29ja2V0XCIsXCJfaWRcIjpcIndlYnNvY2tldEAxLjAuMjVcIixcIl9pbkJ1bmRsZVwiOmZhbHNlLFwiX2ludGVncml0eVwiOlwic2hhNTEyLU01OG5qdmk2WnhWYjVrN2twbkhoMkJ2Tkt1Qldpd0lZdnNUb0VyQnpXaHZCWll3bEVpTGN5THJHNDFUMWpSY3JZOWV0dHFQWUVxZHVMSTd1bDU0Q1ZRPT1cIixcIl9sb2NhdGlvblwiOlwiL3dlYnNvY2tldFwiLFwiX3BoYW50b21DaGlsZHJlblwiOnt9LFwiX3JlcXVlc3RlZFwiOntcInR5cGVcIjpcInRhZ1wiLFwicmVnaXN0cnlcIjp0cnVlLFwicmF3XCI6XCJ3ZWJzb2NrZXRcIixcIm5hbWVcIjpcIndlYnNvY2tldFwiLFwiZXNjYXBlZE5hbWVcIjpcIndlYnNvY2tldFwiLFwicmF3U3BlY1wiOlwiXCIsXCJzYXZlU3BlY1wiOm51bGwsXCJmZXRjaFNwZWNcIjpcImxhdGVzdFwifSxcIl9yZXF1aXJlZEJ5XCI6W1wiI1VTRVJcIixcIi9cIl0sXCJfcmVzb2x2ZWRcIjpcImh0dHBzOi8vcmVnaXN0cnkubnBtanMub3JnL3dlYnNvY2tldC8tL3dlYnNvY2tldC0xLjAuMjUudGd6XCIsXCJfc2hhc3VtXCI6XCI5OThlYzc5MGYwYTNlYWNiOGIwOGI1MGE0MzUwMDI2NjkyYTExOTU4XCIsXCJfc3BlY1wiOlwid2Vic29ja2V0XCIsXCJfd2hlcmVcIjpcIkY6XFxcXFByb2plY3RzXFxcXEthbmthaU11bmljaXBhbGl0eVxcXFxzcmNcIixcImF1dGhvclwiOntcIm5hbWVcIjpcIkJyaWFuIE1jS2VsdmV5XCIsXCJlbWFpbFwiOlwiYnJpYW5Ad29ybGl6ZS5jb21cIixcInVybFwiOlwiaHR0cHM6Ly93d3cud29ybGl6ZS5jb20vXCJ9LFwiYnJvd3NlclwiOlwibGliL2Jyb3dzZXIuanNcIixcImJ1Z3NcIjp7XCJ1cmxcIjpcImh0dHBzOi8vZ2l0aHViLmNvbS90aGV0dXJ0bGUzMi9XZWJTb2NrZXQtTm9kZS9pc3N1ZXNcIn0sXCJidW5kbGVEZXBlbmRlbmNpZXNcIjpmYWxzZSxcImNvbmZpZ1wiOntcInZlcmJvc2VcIjpmYWxzZX0sXCJjb250cmlidXRvcnNcIjpbe1wibmFtZVwiOlwiScOxYWtpIEJheiBDYXN0aWxsb1wiLFwiZW1haWxcIjpcImliY0BhbGlheC5uZXRcIixcInVybFwiOlwiaHR0cDovL2Rldi5zaXBkb2MubmV0XCJ9XSxcImRlcGVuZGVuY2llc1wiOntcImRlYnVnXCI6XCJeMi4yLjBcIixcIm5hblwiOlwiXjIuMy4zXCIsXCJ0eXBlZGFycmF5LXRvLWJ1ZmZlclwiOlwiXjMuMS4yXCIsXCJ5YWV0aVwiOlwiXjAuMC42XCJ9LFwiZGVwcmVjYXRlZFwiOmZhbHNlLFwiZGVzY3JpcHRpb25cIjpcIldlYnNvY2tldCBDbGllbnQgJiBTZXJ2ZXIgTGlicmFyeSBpbXBsZW1lbnRpbmcgdGhlIFdlYlNvY2tldCBwcm90b2NvbCBhcyBzcGVjaWZpZWQgaW4gUkZDIDY0NTUuXCIsXCJkZXZEZXBlbmRlbmNpZXNcIjp7XCJidWZmZXItZXF1YWxcIjpcIl4xLjAuMFwiLFwiZmF1Y2V0XCI6XCJeMC4wLjFcIixcImd1bHBcIjpcImdpdCtodHRwczovL2dpdGh1Yi5jb20vZ3VscGpzL2d1bHAuZ2l0IzQuMFwiLFwiZ3VscC1qc2hpbnRcIjpcIl4yLjAuNFwiLFwianNoaW50XCI6XCJeMi4wLjBcIixcImpzaGludC1zdHlsaXNoXCI6XCJeMi4yLjFcIixcInRhcGVcIjpcIl40LjAuMVwifSxcImRpcmVjdG9yaWVzXCI6e1wibGliXCI6XCIuL2xpYlwifSxcImVuZ2luZXNcIjp7XCJub2RlXCI6XCI+PTAuMTAuMFwifSxcImhvbWVwYWdlXCI6XCJodHRwczovL2dpdGh1Yi5jb20vdGhldHVydGxlMzIvV2ViU29ja2V0LU5vZGVcIixcImtleXdvcmRzXCI6W1wid2Vic29ja2V0XCIsXCJ3ZWJzb2NrZXRzXCIsXCJzb2NrZXRcIixcIm5ldHdvcmtpbmdcIixcImNvbWV0XCIsXCJwdXNoXCIsXCJSRkMtNjQ1NVwiLFwicmVhbHRpbWVcIixcInNlcnZlclwiLFwiY2xpZW50XCJdLFwibGljZW5zZVwiOlwiQXBhY2hlLTIuMFwiLFwibWFpblwiOlwiaW5kZXhcIixcIm5hbWVcIjpcIndlYnNvY2tldFwiLFwicmVwb3NpdG9yeVwiOntcInR5cGVcIjpcImdpdFwiLFwidXJsXCI6XCJnaXQraHR0cHM6Ly9naXRodWIuY29tL3RoZXR1cnRsZTMyL1dlYlNvY2tldC1Ob2RlLmdpdFwifSxcInNjcmlwdHNcIjp7XCJndWxwXCI6XCJndWxwXCIsXCJpbnN0YWxsXCI6XCIobm9kZS1neXAgcmVidWlsZCAyPiBidWlsZGVycm9yLmxvZykgfHwgKGV4aXQgMClcIixcInRlc3RcIjpcImZhdWNldCB0ZXN0L3VuaXRcIn0sXCJ2ZXJzaW9uXCI6XCIxLjAuMjVcIn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy93ZWJzb2NrZXQvcGFja2FnZS5qc29uXG4vLyBtb2R1bGUgaWQgPSAxM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjb25zdCBNZXNzYWdlVHlwZSA9IHtcbiAgQlJPQURDQVNUOiAnYnJvYWRjYXN0JyxcbiAgVE9LRU5BRERFRDogJ3Rva2VuYWRkZWQnLFxuICBUT0tFTlJFTU9WRUQ6ICd0b2tlbnJlbW92ZWQnLFxuICBUT0tFTkNBTExFRDogJ3Rva2VuY2FsbGVkJ1xufVxuXG5leHBvcnQgZGVmYXVsdCBNZXNzYWdlVHlwZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL25vdGlmaWNhdGlvbi9tZXNzYWdldHlwZS5qcyIsImFwcC5jb250cm9sbGVyKCdyZWdpc3RlclVzZXJDdHJsJywgWyckc2NvcGUnLCd1c2VyU2VydmljZScsJ2ZpbGVVcGxvYWQnLCd1c2VyVHlwZXMnLCdkZXB0VHlwZXMnLGZ1bmN0aW9uKCRzY29wZSwgdXNlclNlcnZpY2UsZmlsZVVwbG9hZCx1c2VyVHlwZXMsIGRlcHRUeXBlcyl7XG5cbiAgYW5ndWxhci5lbGVtZW50KGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgJCgnLm1vZGFsJykubW9kYWwoKTtcbiAgICAkKCdzZWxlY3QnKS5tYXRlcmlhbF9zZWxlY3QoKTtcbiAgICB9KTtcblxuICAgICRzY29wZS5pbWFnZVNyYyA9IFwiXCI7XG4gICRzY29wZS51c2VyID0ge1xuICAgIHVzZXJuYW1lOicnLFxuICAgIHBhc3N3b3JkOicnLFxuICAgIGZpcnN0bmFtZTonJyxcbiAgICBsYXN0bmFtZTonJyxcbiAgICBlbXBsb3llZWlkOicnLFxuICAgIHdhcmRubzonJyxcbiAgICBwaG9uZW5vOicnLFxuICAgIGVtYWlsOicnLFxuICAgIGFkZHJlc3M6JycsXG4gICAgaW1hZ2U6JycsXG4gICAgZGVwYXJ0bWVudHR5cGU6JydcbiAgfTtcblxuICAkc2NvcGUudXBsb2FkSW1hZ2UgPSBmdW5jdGlvbigpe1xuXG4gICAgdmFyIGZpbGUgPSAkc2NvcGUuZmlsZTtcbiAgICBjb25zb2xlLmxvZyhmaWxlKTtcbiAgICBjb25zb2xlLmxvZygnZmlsZSBpcyAnICsgZmlsZSk7XG4gICAgdmFyIHVwbG9hZFVybCA9IFwiL3VwbG9hZEltYWdlXCI7XG4gICBmaWxlVXBsb2FkLnVwbG9hZEZpbGVUb1VybChmaWxlLCB1cGxvYWRVcmwpLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgICAgJHNjb3BlLnVzZXIuaW1hZ2UgPSByZXMuZGF0YS5wYXRoO1xuICAgIE1hdGVyaWFsaXplLnRvYXN0KFwiSW1hZ2UgVXBsb2FkZWQgU3VjY2Vzc2Z1bGx5IVwiLCAzMDAwLCBcImdyZWVuXCIpO1xuICB9LGZ1bmN0aW9uKCl7XG4gICAgTWF0ZXJpYWxpemUudG9hc3QoXCJFcnJvciB3aGlsZSB1cGxvYWRpbmcgaW1hZ2VcIiwgMzAwMCwgXCJyZWRcIik7XG4gIH0pO1xuIH07XG5cbiRzY29wZS51c2VyVHlwZUxpc3QgPSB1c2VyVHlwZXM7XG4kc2NvcGUuZGVwdFR5cGVMaXN0ID0gZGVwdFR5cGVzO1xuXG4gICRzY29wZS5yZWdpc3RlciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB1c2VydHlwZSA9ICQoJyN1c2VydHlwZScpLnZhbCgpO1xuICAgIHZhciBkZXB0dHlwZSA9ICQoJyNkZXBhcnRtZW50JykudmFsKCk7XG5cbiAgICAkc2NvcGUudXNlci5kZXBhcnRtZW50dHlwZSA9IGRlcHR0eXBlO1xuICAgIGlmKCEkc2NvcGUudXNlci51c2VybmFtZSB8fCAhJHNjb3BlLnVzZXIucGFzc3dvcmQgfHwgIXVzZXJ0eXBlKXtcbiAgICAgIE1hdGVyaWFsaXplLnRvYXN0KFwiVXNlcm5hbWUgYW5kIFBhc3N3b3JkIGlzIGNvbXB1bHNvcnkhIVwiLDMwMDAsJ3JlZCcpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB1c2VyU2VydmljZS5yZWdpc3Rlcigkc2NvcGUudXNlcikudGhlbihmdW5jdGlvbihyZXMpe1xuICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgdXNlclNlcnZpY2Uuc2V0VXNlclR5cGUoe3VzZXJpZDpyZXMuZGF0YS5pZCx1c2VydHlwZWlkOnVzZXJ0eXBlfSkudGhlbihmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgTWF0ZXJpYWxpemUudG9hc3QoXCJVc2VyIHN1Y2Nlc3NmdWxseSByZWdpc3RlcmVkXCIsMzAwMCxcImdyZWVuXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgTWF0ZXJpYWxpemUudG9hc3QoXCJFcnJvciB3aGlsZSByZWdpc3RlcmluZyB0aGUgdXNlclwiLDMwMDAsXCJyZWRcIik7XG4gICAgICAgfSlcblxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycm9yKXtcbiAgICAgIE1hdGVyaWFsaXplLnRvYXN0KFwiRXJyb3Igd2hpbGUgcmVnaXN0ZXJpbmcgdGhlIHVzZXJcIiwzMDAwLFwicmVkXCIpO1xuICAgIH0pXG4gIH1cblxuXG59XSk7XG5cblxuXG5hcHAuZGlyZWN0aXZlKFwiZmlsZWlucHV0XCIsIFtmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICBzY29wZToge1xuICAgICAgZmlsZWlucHV0OiBcIj1cIixcbiAgICAgIGZpbGVwcmV2aWV3OiBcIj1cIlxuICAgIH0sXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJpYnV0ZXMpIHtcbiAgICAgIGVsZW1lbnQuYmluZChcImNoYW5nZVwiLCBmdW5jdGlvbihjaGFuZ2VFdmVudCkge1xuICAgICAgICBzY29wZS5maWxlaW5wdXQgPSBjaGFuZ2VFdmVudC50YXJnZXQuZmlsZXNbMF07XG4gICAgICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24obG9hZEV2ZW50KSB7XG4gICAgICAgICAgc2NvcGUuJGFwcGx5KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2NvcGUuZmlsZXByZXZpZXcgPSBsb2FkRXZlbnQudGFyZ2V0LnJlc3VsdDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChzY29wZS5maWxlaW5wdXQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59XSk7XG5cbmFwcC5zZXJ2aWNlKCdmaWxlVXBsb2FkJywgWyckaHR0cCcsJ2F1dGhTZXJ2aWNlJywgZnVuY3Rpb24gKCRodHRwLGF1dGhTZXJ2aWNlKSB7XG4gIHRoaXMudXBsb2FkRmlsZVRvVXJsID0gZnVuY3Rpb24oZmlsZSwgdXBsb2FkVXJsKXtcbiAgICAgdmFyIGZkID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgIGZkLmFwcGVuZCgnZmlsZScsIGZpbGUpO1xuXG5cbiAgICAgcmV0dXJuICRodHRwLnBvc3QodXBsb2FkVXJsLCBmZCwge3RyYW5zZm9ybVJlcXVlc3Q6IGFuZ3VsYXIuaWRlbnRpdHksXG4gICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6IHVuZGVmaW5lZCwnQXV0aG9yaXphdGlvbic6J0JlYXJlciAnKyBhdXRoU2VydmljZS5nZXRUb2tlbigpfX0pXG5cblxuICB9XG59XSk7XG5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3B1YmxpYy9qYXZhc2NyaXB0cy9tdmMvcmVnaXN0ZXJVc2VyQ3RybC5qcyIsImFwcC5jb250cm9sbGVyKCdzbGlkZXJDdHJsJywgWyckc2NvcGUnLCdzbGlkZXJTZXJ2aWNlJywnc2xpZGVzJywnZmlsZVVwbG9hZCcsIGZ1bmN0aW9uKCRzY29wZSwgc2xpZGVyU2VydmljZSwgc2xpZGVzLCBmaWxlVXBsb2FkKXtcblxuICAkc2NvcGUuc2xpZGVzbGlzdCA9IHNsaWRlcztcblxuICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICQoJy5tb2RhbCcpLm1vZGFsKCk7XG4gIH0pXG5cbiAgJHNjb3BlLnVwZGF0ZSA9IGZ1bmN0aW9uKHNsaWRlKXtcbiAgICBzbGlkZXJTZXJ2aWNlLnVwZGF0ZShzbGlkZSkudGhlbihmdW5jdGlvbihyZXMpe1xuICAgICAgTWF0ZXJpYWxpemUudG9hc3QocmVzLmRhdGEubWVzc2FnZSwgMjAwMCwgJ2dyZWVuJylcbiAgICB9LCBmdW5jdGlvbihlcnIpe1xuICAgICAgTWF0ZXJpYWxpemUudG9hc3QoZXJyLmRhdGEubWVzc2FnZSwgMjAwMCwgJ3JlZCcpO1xuICAgIH0pXG4gIH1cblxuICAkc2NvcGUuY3JlYXRlID0gZnVuY3Rpb24oc2xpZGUpe1xuICAgIHNsaWRlclNlcnZpY2UuY3JlYXRlKHNsaWRlKS50aGVuKGZ1bmN0aW9uKHJlcyl7XG4gICAgICAkc2NvcGUuc2xpZGVzbGlzdC5wdXNoKHNsaWRlKTtcbiAgICAgICRzY29wZS4kYXBwbHkoKTtcbiAgICAgIE1hdGVyaWFsaXplLnRvYXN0KHJlcy5kYXRhLm1lc3NhZ2UsIDIwMDAsICdncmVlbicpXG4gICAgfSwgZnVuY3Rpb24oZXJyKXtcbiAgICAgIE1hdGVyaWFsaXplLnRvYXN0KGVyci5kYXRhLm1lc3NhZ2UsIDIwMDAsICdyZWQnKTtcbiAgICB9KVxuICB9XG5cbiAgJHNjb3BlLnJlbW92ZSA9IGZ1bmN0aW9uKGlkKXtcbiAgICBzbGlkZXJTZXJ2aWNlLmRlbGV0ZShpZCkudGhlbihmdW5jdGlvbihyZXMpe1xuICAgICAgJHNjb3BlLnNsaWRlc2xpc3QuZm9yRWFjaChzbGlkZT0+e1xuICAgICAgICBpZihzbGlkZS5faWQgPT09IGlkKXtcbiAgICAgICAgICAkc2NvcGUuc2xpZGVzbGlzdC5wb3Aoc2xpZGUpO1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgTWF0ZXJpYWxpemUudG9hc3QocmVzLmRhdGEubWVzc2FnZSwgMjAwMCwgJ2dyZWVuJylcbiAgICB9LCBmdW5jdGlvbihlcnIpe1xuICAgICAgTWF0ZXJpYWxpemUudG9hc3QoZXJyLmRhdGEubWVzc2FnZSwgMjAwMCwgJ3JlZCcpO1xuICAgIH0pXG4gIH1cblxuICAkc2NvcGUubW9kYWwgPSB7fTtcbiAgJHNjb3BlLnNob3dtb2RhbCA9IGZ1bmN0aW9uKHNsaWRlKXtcbiAgICAkc2NvcGUubW9kYWwuc2xpZGUgPSBzbGlkZTtcbiAgICAkKCcjc2xpZGVybW9kYWwnKS5tb2RhbCgnb3BlbicpO1xuICB9XG4gICRzY29wZS5jbG9zZW1vZGFsID0gZnVuY3Rpb24oKXtcbiAgICAkKCcjc2xpZGVybW9kYWwnKS5tb2RhbCgnY2xvc2UnKTtcbiAgfVxuXG4gICRzY29wZS5zYXZlY2hhbmdlcyA9IGZ1bmN0aW9uKHNsaWRlKXtcbiAgICBzbGlkZXJTZXJ2aWNlLnVwZGF0ZShzbGlkZSkudGhlbihmdW5jdGlvbihyZXMpe1xuICAgICAgTWF0ZXJpYWxpemUudG9hc3QocmVzLmRhdGEubWVzc2FnZSwgMjAwMCwgJ2dyZWVuJylcbiAgICAgICQoJyNzbGlkZXJtb2RhbCcpLm1vZGFsKCdjbG9zZScpO1xuICAgIH0sIGZ1bmN0aW9uKGVycil7XG4gICAgICBNYXRlcmlhbGl6ZS50b2FzdChlcnIuZGF0YS5tZXNzYWdlLCAyMDAwLCAncmVkJyk7XG4gICAgfSlcbiAgfVxuICAkc2NvcGUuY3JlYXRlbmV3ID0gZnVuY3Rpb24oKXtcbiAgICAkc2NvcGUubW9kYWwuc2xpZGUgPSB7fTtcbiAgICAkc2NvcGUubW9kYWwuc2xpZGUubmV3ID0gdHJ1ZTtcbiAgICAkKCcjc2xpZGVybW9kYWwnKS5tb2RhbCgnb3BlbicpO1xuICB9XG5cbiAgJHNjb3BlLnVwbG9hZEltYWdlID0gZnVuY3Rpb24oKXtcblxuICAgIHZhciBmaWxlID0gJHNjb3BlLmZpbGU7XG4gICAgY29uc29sZS5sb2coZmlsZSk7XG4gICAgY29uc29sZS5sb2coJ2ZpbGUgaXMgJyArIGZpbGUpO1xuICAgIHZhciB1cGxvYWRVcmwgPSBcInNsaWRlL3VwbG9hZEltYWdlXCI7XG4gICBmaWxlVXBsb2FkLnVwbG9hZEZpbGVUb1VybChmaWxlLCB1cGxvYWRVcmwpLnRoZW4oZnVuY3Rpb24ocmVzKXtcbiAgICAgJHNjb3BlLm1vZGFsLnNsaWRlLmltYWdlID0gcmVzLmRhdGEucGF0aDtcbiAgICBNYXRlcmlhbGl6ZS50b2FzdChcIkltYWdlIFVwbG9hZGVkIFN1Y2Nlc3NmdWxseSFcIiwgMzAwMCwgXCJncmVlblwiKTtcbiAgfSxmdW5jdGlvbihlcnIpe1xuICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgTWF0ZXJpYWxpemUudG9hc3QoXCJFcnJvciB3aGlsZSB1cGxvYWRpbmcgaW1hZ2VcIiwgMzAwMCwgXCJyZWRcIik7XG4gIH0pO1xuIH07XG59XSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wdWJsaWMvamF2YXNjcmlwdHMvbXZjL3NsaWRlckN0cmwuanMiLCJhcHAuZmFjdG9yeSgnc2xpZGVyU2VydmljZScsWyckaHR0cCcsJ2F1dGhTZXJ2aWNlJywgZnVuY3Rpb24oJGh0dHAsIGF1dGhTZXJ2aWNlKXtcbiAgY29uc3Qgb2JqID0ge307XG5cbiAgb2JqLmdldEFsbCA9IGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvc2xpZGUvYWxsJyx7aGVhZGVyczp7J0F1dGhvcml6YXRpb24nOiAnQmVhcmVyICcrIGF1dGhTZXJ2aWNlLmdldFRva2VuKCl9fSlcbiAgfVxuXG4gIG9iai5nZXQgPSBmdW5jdGlvbihpZCl7XG4gICAgcmV0dXJuICRodHRwLmdldCgnL3NsaWRlLycrIGlkLCB7aGVhZGVyczp7J0F1dGhvcml6YXRpb24nOiAnQmVhcmVyICcrIGF1dGhTZXJ2aWNlLmdldFRva2VuKCl9fSlcbiAgfVxuXG4gIG9iai51cGRhdGUgPSBmdW5jdGlvbihzbGlkZSl7XG4gICAgY29uc29sZS5sb2coc2xpZGUpO1xuICAgIHJldHVybiAkaHR0cC5wdXQoJy9zbGlkZS8nKyBzbGlkZS5faWQsIHNsaWRlLCB7aGVhZGVyczp7J0F1dGhvcml6YXRpb24nOiAnQmVhcmVyICcrIGF1dGhTZXJ2aWNlLmdldFRva2VuKCl9fSlcbiAgfVxuXG4gIG9iai5jcmVhdGUgPSBmdW5jdGlvbihzbGlkZSl7XG4gICAgcmV0dXJuICRodHRwLnBvc3QoJy9zbGlkZS9jcmVhdGUnLCBzbGlkZSwge2hlYWRlcnM6eydBdXRob3JpemF0aW9uJzogJ0JlYXJlciAnKyBhdXRoU2VydmljZS5nZXRUb2tlbigpfX0pXG4gIH1cblxuICBvYmouZGVsZXRlID0gZnVuY3Rpb24oaWQpe1xuICAgIHJldHVybiAkaHR0cC5kZWxldGUoJy9zbGlkZS8nKyBpZCwge2hlYWRlcnM6eydBdXRob3JpemF0aW9uJzogJ0JlYXJlciAnKyBhdXRoU2VydmljZS5nZXRUb2tlbigpfX0pXG4gIH1cblxuICBvYmoudXBsb2FkID0gZnVuY3Rpb24oaW1hZ2Upe1xuICAgIHJldHVybiAkaHR0cC5wb3N0KCcvc2xpZGUvdXBsb2FkSW1hZ2UnLCBpbWFnZSwge2hlYWRlcnM6eydBdXRob3JpemF0aW9uJzogJ0JlYXJlciAnKyBhdXRoU2VydmljZS5nZXRUb2tlbigpfX0pXG4gIH1cbiAgcmV0dXJuIG9iajtcbn1dKVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vcHVibGljL2phdmFzY3JpcHRzL212Yy9zbGlkZXJTZXJ2aWNlLmpzIiwiXG5cblxuXG5hcHAuY29udHJvbGxlcigndG9rZW5DdHJsJyxbJyRzY29wZScsJ2RlcHRUeXBlcycsJ3Rva2VuU2VydmljZScsIGZ1bmN0aW9uKCRzY29wZSwgZGVwdFR5cGVzLCB0b2tlblNlcnZpY2Upe1xuICRzY29wZS5kZXB0VHlwZXNMaXN0ID0gZGVwdFR5cGVzO1xuXG4gJHNjb3BlLnRva2VuID0ge1xuICAgIHRva2VubnVtYmVyOicnLFxuICAgIHZpc2l0b3JuYW1lOicnLFxuICAgIHBob25lbm86JycsXG4gICAgZGVwYXJ0bWVudDonJyxcbiAgICBkZXNjcmlwdGlvbjonJyxcbiAgICBjcmVhdGVkYnk6JydcblxuIH1cbiB2YXIgcmFuZG9tR2VuZXJhdG9yID0gZnVuY3Rpb24oKXtcbiAgdmFyIHggPSAoMjAgKiBNYXRoLnJhbmRvbSgpKS50b1N0cmluZygpIDtcbiAgdmFyIGFyciA9IHguc3BsaXQoXCJcIik7XG4gIHJldHVybiBhcnJbeC5sZW5ndGgtMV0rYXJyW3gubGVuZ3RoLTJdK2Fyclt4Lmxlbmd0aC0zXSthcnJbeC5sZW5ndGgtNF07XG59XG5cbiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcblxuICAkKCdzZWxlY3QnKS5tYXRlcmlhbF9zZWxlY3QoKTtcbiAgfSk7XG5cbiAgJHNjb3BlLmdlbmVyYXRlVG9rZW4gPSBmdW5jdGlvbigpe1xuICAgICRzY29wZS50b2tlbi5kZXBhcnRtZW50ID0gJCgnI2RlcGFydG1lbnQnKS52YWwoKTtcblxuICAgIGNvbnNvbGUubG9nKCRzY29wZS50b2tlbi5kZXBhcnRtZW50KTtcbiAgICBpZighJHNjb3BlLnRva2VuLnZpc2l0b3JuYW1lIHx8ICEkc2NvcGUudG9rZW4uZGVwYXJ0bWVudCl7XG4gICAgICBNYXRlcmlhbGl6ZS50b2FzdChcIlBsZWFzZSBmaWxsIGFsbCB0aGUgZmllbGRzXCIsIDMwMDAsIFwicmVkXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgICRzY29wZS50b2tlbi50b2tlbm51bWJlciA9IHJhbmRvbUdlbmVyYXRvcigpO1xuXG4gICAgdG9rZW5TZXJ2aWNlLmNyZWF0ZVRva2VuKCRzY29wZS50b2tlbikudGhlbihmdW5jdGlvbihkYXRhKXtcbiAgICAgIE1hdGVyaWFsaXplLnRvYXN0KFwiU3VjY2Vzc2Z1bGx5IGNyZWF0ZWQgdG9rZW5cIiwgMzAwMCwgXCJncmVlblwiKTtcbiAgICB9LGZ1bmN0aW9uKGVycil7XG4gICAgICBNYXRlcmlhbGl6ZS50b2FzdChcIkVycm9yIHdoaWxlIGNyZWF0aW5nIHRoZSB0b2tlblwiLCAzMDAwLCAncmVkJyk7XG4gICAgfSk7XG5cbiAgfVxuXG5cblxuXG59XSlcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3B1YmxpYy9qYXZhc2NyaXB0cy9tdmMvdG9rZW5DdHJsLmpzIiwiYXBwLmZhY3RvcnkoJ3Rva2VuU2VydmljZScsIFsnJGh0dHAnLCAnYXV0aFNlcnZpY2UnLCBmdW5jdGlvbiAoJGh0dHAsIGF1dGhTZXJ2aWNlKSB7XG5cbiAgdmFyIG9iaiA9IHtcbiAgICB0b2tlbmxpc3Q6IFtdXG4gIH1cbiAgb2JqLmZldGNoVG9kYXlUb2tlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgd2FyZG5vID0gYXV0aFNlcnZpY2Uud2FyZG5vKCk7XG4gICAgcmV0dXJuICRodHRwLmdldCgnL3Rva2VuL3RvZGF5LycgKyB3YXJkbm8sIHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0F1dGhvcml6YXRpb24nOiAnQmVhcmVyICcgKyBhdXRoU2VydmljZS5nZXRUb2tlbigpXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBvYmoudG9kYXlUb2tlbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICRodHRwLmdldCgnL3Rva2VuL3RvZGF5LycgKyBhdXRoU2VydmljZS53YXJkbm8oKSwge1xuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQXV0aG9yaXphdGlvbic6ICdCZWFyZXIgJyArIGF1dGhTZXJ2aWNlLmdldFRva2VuKClcbiAgICAgIH1cbiAgICB9KS50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgIG9iai50b2tlbmxpc3QgPSByZXMuZGF0YTtcbiAgICAgIHJldHVybiByZXMuZGF0YVxuICAgIH0pO1xuICB9XG5cbiAgb2JqLmhhbmRsZVRva2VuID0gZnVuY3Rpb24gKHRva2VuaWQpIHtcbiAgICByZXR1cm4gJGh0dHAucHV0KCcvdG9rZW4vaGFuZGxlLycgKyB0b2tlbmlkICsgJy8nICsgYXV0aFNlcnZpY2UuY3VycmVudFVzZXJJZCgpLCB7fSwge1xuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQXV0aG9yaXphdGlvbic6ICdCZWFyZXIgJyArIGF1dGhTZXJ2aWNlLmdldFRva2VuKClcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG9iai5jb21wbGV0ZUhhbmRsaW5nID0gZnVuY3Rpb24gKHRva2VuaWQpIHtcbiAgICByZXR1cm4gJGh0dHAucHV0KCcvdG9rZW4vaGFuZGxlZC8nICsgdG9rZW5pZCArICcvJyArIGF1dGhTZXJ2aWNlLmN1cnJlbnRVc2VySWQoKSwge30sIHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0F1dGhvcml6YXRpb24nOiAnQmVhcmVyICcgKyBhdXRoU2VydmljZS5nZXRUb2tlbigpXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBvYmouY3JlYXRlVG9rZW4gPSBmdW5jdGlvbiAodG9rZW4pIHtcbiAgICBjb25zb2xlLmxvZyhhdXRoU2VydmljZS53YXJkbm8oKSk7XG4gICAgdG9rZW4uY3JlYXRlZGJ5ID0gYXV0aFNlcnZpY2UuY3VycmVudFVzZXJJZCgpO1xuICAgIHRva2VuLndhcmRubyA9IGF1dGhTZXJ2aWNlLndhcmRubygpO1xuICAgIHJldHVybiAkaHR0cC5wb3N0KCcvdG9rZW4vY3JlYXRlJywgdG9rZW4sIHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ0F1dGhvcml6YXRpb24nOiAnQmVhcmVyICcgKyBhdXRoU2VydmljZS5nZXRUb2tlbigpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHJldHVybiBvYmo7XG59XSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wdWJsaWMvamF2YXNjcmlwdHMvbXZjL3Rva2VuU2VydmljZS5qcyIsImFwcC5mYWN0b3J5KCd1c2VyU2VydmljZScsIFsnJGh0dHAnLCAnJHdpbmRvdycsJ2F1dGhTZXJ2aWNlJywgZnVuY3Rpb24gKCRodHRwLCAkd2luZG93LGF1dGhTZXJ2aWNlKSB7XG5cblxuICB2YXIgdXNlciA9IHsgIH07XG5cbiAgdXNlci5nZXRBbGxVc2VycyA9IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuICRodHRwLmdldCgnL3VzZXIvbGlzdCcse2hlYWRlcnM6eydBdXRob3JpemF0aW9uJzonQmVhcmVyICcrIGF1dGhTZXJ2aWNlLmdldFRva2VuKCl9fSkudGhlbihmdW5jdGlvbihyZXMpe1xuXG4gICAgICByZXR1cm4gcmVzLmRhdGE7XG4gICAgfSk7XG4gIH1cblxuICB1c2VyLmdldFVzZXJEZXRhaWxzID0gZnVuY3Rpb24oKXtcbiAgICAgIHJldHVybiAkaHR0cC5nZXQoJy91c2VyLycrIGF1dGhTZXJ2aWNlLmN1cnJlbnRVc2VySWQoKSwge2hlYWRlcnM6eydBdXRob3JpemF0aW9uJzonQmVhcmVyICcrIGF1dGhTZXJ2aWNlLmdldFRva2VuKCl9fSk7XG4gIH1cblxuICB1c2VyLmdldEFsbFVzZXJUeXBlcyA9IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuICRodHRwLmdldCgnL3VzZXJUeXBlL2xpc3QnLCB7aGVhZGVyczp7J0F1dGhvcml6YXRpb24nOidCZWFyZXIgJysgYXV0aFNlcnZpY2UuZ2V0VG9rZW4oKX19KS50aGVuKGZ1bmN0aW9uKHJlcyl7XG4gICAgICByZXR1cm4gcmVzLmRhdGE7XG4gICAgfSk7XG4gIH1cblxuICB1c2VyLnJlZ2lzdGVyID0gZnVuY3Rpb24oZGF0YSl7XG5cbiAgICByZXR1cm4gJGh0dHAucG9zdCgnL3JlZ2lzdGVyJyxkYXRhKTtcbiAgfVxuXG4gIHVzZXIuc2V0VXNlclR5cGUgPSBmdW5jdGlvbihkYXRhKXtcbiAgICByZXR1cm4gJGh0dHAucHV0KCcvdXNlclR5cGUvJytkYXRhLnVzZXJpZCsnLycrZGF0YS51c2VydHlwZWlkLHt9LCB7aGVhZGVyczp7J0F1dGhvcml6YXRpb24nOidCZWFyZXIgJythdXRoU2VydmljZS5nZXRUb2tlbigpfX0pO1xuICB9XG5cbiAgdXNlci5nZXRBbGxEZXBhcnRtZW50ID0gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gJGh0dHAuZ2V0KCcvZGVwYXJ0bWVudHR5cGUvbGlzdCcsIHtoZWFkZXJzOnsnQXV0aG9yaXphdGlvbic6J0JlYXJlciAnK2F1dGhTZXJ2aWNlLmdldFRva2VuKCl9fSkudGhlbihmdW5jdGlvbihyZXMpe1xuICAgICAgICByZXR1cm4gcmVzLmRhdGE7XG4gICAgfSk7XG4gIH1cblxuICB1c2VyLnNldERlcGFydG1lbnRUeXBlID0gZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gJGh0dHAucHV0KCcvZGVwYXJ0bWVudHR5cGUvJytkYXRhLnVzZXJpZCsnLycrZGF0YS5kZXBhcnRtZW50eXBlLmlkLCB7fSwge2hlYWRlcnM6eydBdXRob3JpemF0aW9uJzonQmVhcmVyICcrYXV0aFNlcnZpY2UuZ2V0VG9rZW4oKX19KTtcbiAgfVxuXG4gIHVzZXIudXBkYXRlVXNlciA9IGZ1bmN0aW9uKHVzZXIpe1xuICAgIHJldHVybiAkaHR0cC5wdXQoJy91c2VyLycrYXV0aFNlcnZpY2UuY3VycmVudFVzZXJJZCgpLCB1c2VyLCB7aGVhZGVyczp7J0F1dGhvcml6YXRpb24nOidCZWFyZXIgJythdXRoU2VydmljZS5nZXRUb2tlbigpfX0pO1xuICB9XG4gIHJldHVybiB1c2VyO1xufV0pO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vcHVibGljL2phdmFzY3JpcHRzL212Yy91c2VyU2VydmljZS5qcyJdLCJzb3VyY2VSb290IjoiIn0=