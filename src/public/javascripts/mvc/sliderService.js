app.factory('sliderService',['$http','authService', function($http, authService){
  const obj = {};

  obj.getAll = function(){
      return $http.get('/slide/all',{headers:{'Authorization': 'Bearer '+ authService.getToken()}})
  }

  obj.get = function(id){
    return $http.get('/slide/'+ id, {headers:{'Authorization': 'Bearer '+ authService.getToken()}})
  }

  obj.update = function(slide){
    console.log(slide);
    return $http.put('/slide/'+ slide._id, slide, {headers:{'Authorization': 'Bearer '+ authService.getToken()}})
  }

  obj.create = function(slide){
    return $http.post('/slide/create', slide, {headers:{'Authorization': 'Bearer '+ authService.getToken()}})
  }

  obj.delete = function(id){
    return $http.delete('/slide/'+ id, {headers:{'Authorization': 'Bearer '+ authService.getToken()}})
  }

  obj.upload = function(image){
    return $http.post('/slide/uploadImage', image, {headers:{'Authorization': 'Bearer '+ authService.getToken()}})
  }
  return obj;
}])
