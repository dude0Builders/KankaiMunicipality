var app = angular.module('kankai', ['ui.router']);

function authenticate($q, user, $state, $timeout) {
  if (user.isLoggedIn()) {
    // Resolve the promise successfully
    return $q.when()
  } else {
    // The next bit of code is asynchronously tricky.

    $timeout(function() {
      // This code runs after the authentication promise has been rejected.
      // Go to the log-in page
      $state.go('login',{},{reload:true});
    },200);

    // Reject the authentication promise to prevent the state from loading
    return $q.reject()
  }

}
app.config(['$stateProvider', '$urlRouterProvider','$locationProvider', function($stateProvider, $urlRouterProvider,$locationProvider){
  $stateProvider.state('login',{
    url:'/login',
    templateUrl:'/login.html',
    controller:'LoginCtrl',
    onEnter: ['$state', 'authService', function($state, auth){
      if(auth.isLoggedIn()){
        $state.go('home',{},{reload:true});
      }
    }]
  })
  .state('home', {
    url:'/home',
    templateUrl:'/home.html',
    controller:'HomeCtrl',
    resolve:{
      login: ['$q', '$rootScope','$state','authService','$timeout', function($q, $rootScope, $state,authService, $timeout) {
       authenticate($q,authService,$state,$timeout);

      }]
    }
  }).state('registerprint', {
    url:'/registerprint',
    templateUrl:'/registerprint.html',
    controller:'fingerPrintCtrl',
    resolve:{
      login: ['$q', '$rootScope','$state','authService','$timeout', function($q, $rootScope, $state,authService, $timeout) {
        authenticate($q,authService,$state,$timeout);

       }]
    }
  })
  .state('registeruser', {
    url:'/registeruser',
    templateUrl:'/registeruser.html',
    controller:'registerUserCtrl',
    resolve:{
      login: ['$q', '$rootScope','$state','authService','$timeout', function($q, $rootScope, $state,authService, $timeout) {
        authenticate($q,authService,$state,$timeout);

       }]
    }
  }).state('token', {
    url:'/token',
    templateUrl:'/token.html',
    controller:'tokenCtrl',
    resolve:{
      login: ['$q', '$rootScope','$state','authService','$timeout', function($q, $rootScope, $state,authService, $timeout) {
        authenticate($q,authService,$state,$timeout);

       }]
    }
  })
  // .state('foods', {
  //   url:'/foods',
  //   templateUrl:'/foods.html',
  //   controller:'foodsCtrl'
  // }).state('beverages',{
  //   url:'/beverages',
  //   templateUrl:'/beverages.html',
  //   controller:'beveragesCtrl'
  // })
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
  $urlRouterProvider.otherwise('login');
}])



// app.directive('autoLocation', function(){
//   return {
//     link : function($scope, element, attrs){
//       autocomplete = new google.maps.places.Autocomplete(
//         /** @type {HTMLInputElement} */
//         element, {
//             types: ['geocode']
//         });

//         google.maps.event.addDomListener(element, 'focus', function (){

//                   if (navigator.geolocation) {
//                       navigator.geolocation.getCurrentPosition(function (position) {

//                           var geolocation = new google.maps.LatLng(
//                           position.coords.latitude, position.coords.longitude);
//                           var circle = new google.maps.Circle({
//                               center: geolocation,
//                               radius: position.coords.accuracy
//                           });
//                           autocomplete.setBounds(circle.getBounds());

//                           // Log autocomplete bounds here
//                           console.log(autocomplete.getBounds());
//                       });
//                   }
//               });
//     }


//   }
// })

