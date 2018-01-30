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

  auth.currentUserId = function(){
    if (auth.isLoggedIn()) {
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));
      return payload._id;
    }
  }

  auth.wardno = function(){
    if (auth.isLoggedIn()) {
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.wardno;
    }
  }

  auth.hasPermission = (permission) => {
    if (auth.isLoggedIn()) {
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.permissions.includes(permission);
    }
  }
  auth.register = function (user) {
    return $http.post('/register', user).success(function (data) {
      auth.saveToken(data.token);
    });
  };

  auth.logIn = function (user) {
    return $http.post('/login', user);

  };

  auth.hasPermissionFor = statename => {
    switch(statename){
      case 'registerprint':
      case 'registeruser':
      return auth.hasPermission('registeruser');

      default:
      return true;
    }
  }

  auth.logOut = function () {
    console.log('Logging out user');
    $window.localStorage.removeItem('kankai');
  }
  return auth;
}]);
