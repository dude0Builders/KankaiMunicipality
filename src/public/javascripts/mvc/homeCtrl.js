app.controller('HomeCtrl', ['$scope', '$http', 'notificationService', 'slides', function ($scope, $http, notificationService, slides) {
  notificationService.connect(function (message) {
    message.onmessage(function (message) {
      console.log(message);
    })
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
  }

}]);

