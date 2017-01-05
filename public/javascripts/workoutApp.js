var app = angular.module('workoutApp', ['ngRoute', 'ngResource']).run(function($rootScope, $http){
	$rootScope.user = {};
    $rootScope.authenticated = false;

    $rootScope.logout = function(){
        $http.get("/auth/logout");
        $rootScope.authenticated = false;
		$rootScope.current_user = {};
    };
});

app.config(function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'main.html',
            controller: 'mainController'
        })
		.when('/login', {
			templateUrl: 'login.html',
			controller: 'authController'
		})
		.when('/signup', {
			templateUrl: 'signup.html',
			controller: 'authController'
		})
		.when('/routines', {
			templateUrl: 'routines.html',
			controller: 'routineController'
		})
		.when('/workouts', {
			templateUrl: 'workouts.html',
			controller: 'workoutController'
		})
		.when('/addRoutine', {
			templateUrl: 'addRoutine.html',
			controller: 'routineController'
		})
		.when('/addWorkout', {
			templateUrl: 'addWorkout.html',
			controller: 'workoutController'
		});
});

app.factory('routineService', function($resource){
	return $resource('/api/routine/:id');
});

app.factory('workoutService', function($resource){
	return $resource('/api/workout/:id');
});

app.factory('exerciseService', function($resource){
	return $resource('/api/exercise/:id');
});

app.controller('mainController', function($http, $location, $rootScope, $scope, routineService, workoutService){
    $scope.init = function(){
        if(!$rootScope.authenticated){
            $location.path('/login');
        }
    };
    $scope.init();
	$scope.user = $rootScope.current_user;
	$scope.routines = routineService.query();
	$scope.workouts = workoutService.query();
});

app.controller('routineController', function($location, $http, $scope, routineService, $rootScope){
	$scope.newRoutine = {title:''};
	$scope.routines = routineService.query();
	$scope.post = function(){
		console.log($scope.newRoutine);
		routineService.save($scope.newRoutine, function(){
			$scope.routines = routineService.query();
			$location.path('/');
		});
	};
});

app.controller('workoutController', function($location, $scope, workoutService, routineService){
	$scope.newWorkout = {routine:''};
	$scope.selectedRoutine = '';
	$scope.workouts = workoutService.query();
	$scope.routines = routineService.query();
	console.log($scope.routines);
	$scope.post = function(){

		$scope.newWorkout.routine = $scope.selectedRoutine._id;
		workoutService.save($scope.newWorkout, function(){
			$location.path('/');	
		});
	};
});

app.controller('authController', function($scope, $http, $rootScope, $location){
  $scope.user = {username: '', password: '', name: ''};
  $scope.error_message = '';

  $scope.login = function(){
    $http.post('/auth/login', $scope.user).success(function(data){
      if(data.state == 'success'){
        $rootScope.authenticated = true;
        $rootScope.user = data.user;
        $location.path('/');
      }
      else{
        $scope.error_message = data.message;
      }
    });
  };

  $scope.signup = function(){
    $http.post('/auth/signup', $scope.user).success(function(data){
      if(data.state == 'success'){
        $rootScope.authenticated = true;
        $rootScope.user = data.user;
        $location.path('/');
      }
      else{
        $scope.error_message = data.message;
      }
    });
  };
});
