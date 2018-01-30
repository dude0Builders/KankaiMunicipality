app.factory('tokenService', ['$http', 'authService', function ($http, authService) {

  var obj = {
    tokenlist: []
  }
  obj.fetchTodayToken = function () {
    var wardno = authService.wardno();
    return $http.get('/token/today/' + wardno, {
      headers: {
        'Authorization': 'Bearer ' + authService.getToken()
      }
    });
  }

  obj.todayTokens = function () {
    return $http.get('/token/today/' + authService.wardno(), {
      headers: {
        'Authorization': 'Bearer ' + authService.getToken()
      }
    }).then(function (res) {
      obj.tokenlist = res.data;
      return res.data
    });
  }

  obj.handleToken = function (tokenid) {
    return $http.put('/token/handle/' + tokenid + '/' + authService.currentUserId(), {}, {
      headers: {
        'Authorization': 'Bearer ' + authService.getToken()
      }
    });
  }

  obj.completeHandling = function (tokenid) {
    return $http.put('/token/handled/' + tokenid + '/' + authService.currentUserId(), {}, {
      headers: {
        'Authorization': 'Bearer ' + authService.getToken()
      }
    });
  }

  obj.createToken = function (token) {
    console.log(authService.wardno());
    token.createdby = authService.currentUserId();
    token.wardno = authService.wardno();
    return $http.post('/token/create', token, {
      headers: {
        'Authorization': 'Bearer ' + authService.getToken()
      }
    })
  }

  return obj;
}]);
