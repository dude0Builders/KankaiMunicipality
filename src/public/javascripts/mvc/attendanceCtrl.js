app.controller('attendanceCtrl', ['$scope', 'attendanceService', 'fingerPrintService','authService', function($scope, attendService, fingerPrintService ,authService){

  $(document).ready(function(){
    $('.modal').modal();
  })
$scope.attend = function(){
  fingerPrintService.verify().then(function(res){

    var data = {

    }
    data.userid = res.data.userid;
    data.date = new Date().toDateString();

    attendService.attend(data).then(function(res){
      console.log(res.data);
      $scope.user = res.data;
      Materialize.toast("Attendance done !", 3000, 'green');
      $('#userdetail').modal('open');
      setTimeout(function(){
        $('#userdetail').modal('close');
      },
      5000)
    }, function(err){
       Materialize.toast("Error occurred !", 3000, 'red');
    })


  }, function(err){

    if(err.status==404){
      Materialize.toast("Finger Print Not Registered !", 3000, 'red');
    } else {
      Materialize.toast("Error Occurred !", 3000, 'red');
    }
  })

}
}])
