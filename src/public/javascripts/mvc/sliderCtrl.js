app.controller('sliderCtrl', ['$scope','sliderService','slides','fileUpload', function($scope, sliderService, slides, fileUpload){

  $scope.slideslist = slides;


  $(document).ready(function () {
    $('.modal').modal();
  })

  $scope.update = function(slide){
    sliderService.update(slide).then(function(res){
      Materialize.toast(res.data.message, 2000, 'green')
    }, function(err){
      Materialize.toast(err.data.message, 2000, 'red');
    })
  }

  $scope.create = function(slide){
    sliderService.create(slide).then(function(res){
      $scope.slideslist.push(slide);
      $scope.$apply();
      Materialize.toast(res.data.message, 2000, 'green')
    }, function(err){
      Materialize.toast(err.data.message, 2000, 'red');
    })
  }

  $scope.remove = function(id){
    sliderService.delete(id).then(function(res){
      $scope.slideslist.forEach(slide=>{
        if(slide._id === id){
          $scope.slideslist.pop(slide);
        }
      })
      Materialize.toast(res.data.message, 2000, 'green')
    }, function(err){
      Materialize.toast(err.data.message, 2000, 'red');
    })
  }

  $scope.modal = {};
  $scope.showmodal = function(slide){
    $scope.modal.slide = slide;
    $('#slidermodal').modal('open');
  }
  $scope.closemodal = function(){
    $('#slidermodal').modal('close');
  }

  $scope.savechanges = function(slide){
    sliderService.update(slide).then(function(res){
      Materialize.toast(res.data.message, 2000, 'green')
      $('#slidermodal').modal('close');
    }, function(err){
      Materialize.toast(err.data.message, 2000, 'red');
    })
  }
  $scope.createnew = function(){
    $scope.modal.slide = {};
    $scope.modal.slide.new = true;
    $('#slidermodal').modal('open');
  }

  $scope.uploadImage = function(){

    var file = $scope.file;
    console.log(file);
    console.log('file is ' + file);
    var uploadUrl = "slide/uploadImage";
   fileUpload.uploadFileToUrl(file, uploadUrl).then(function(res){
     $scope.modal.slide.image = res.data.path;
    Materialize.toast("Image Uploaded Successfully!", 3000, "green");
  },function(err){
    console.log(err);
    Materialize.toast("Error while uploading image", 3000, "red");
  });
 };
}]);
