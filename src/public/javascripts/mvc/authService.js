app.factory('authService', ['$http', '$window', function ($http, $window) {

  var auth = {};

  auth.saveToken = function (token) {
    $window.localStorage['kankai']= token;
  }

  auth.getToken = function () {
    return $window.localStorage['kankai'];
  }

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
  }
  return auth;
}]);
