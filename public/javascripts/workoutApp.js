var app = angular.module('workoutApp', ['ngRoute', 'ngResource', 'ngCookies']);
	
app.run(function($rootScope, $http, $location, $route){
    $rootScope.logout = function(){
        $http.get("/auth/logout").then(function(response){
			$location.path('/');
			$route.reload();
		});
    };
});

app.config(function($routeProvider, $locationProvider, $httpProvider){
	$httpProvider.interceptors.push(function($q, $location){
		return {
			response : function(response){
				return response;
			},
			responseError : function(response){
				console.log('xd');
				if(response.status === 401){
					$location.path('/login');
				}
				return $q.reject(response);
			}
		};
	});

	$locationProvider.html5Mode({
	  enabled: true,
	  requireBase: false
	});

	var blockUnauth = function($q, $http, $location){
		var deferred = $q.defer();
		$http.get('/auth/loggedin').then(function(isLoggedIn){
			if(isLoggedIn.data){
				deferred.resolve();
			}
			else{
				deferred.reject();		
				$location.path('/login');
			}
		});
		return deferred.promise;
	};

	var blockAuth = function($q, $http, $location){
		var deferred = $q.defer();
		$http.get('/auth/loggedin').then(function(isLoggedIn){
			if(isLoggedIn.data){
				$location.path('/');
				deferred.reject();
			}
			else{
				deferred.resolve();		
			}
		});
		return deferred.promise;
	};

    $routeProvider
        .when('/', {
            templateUrl: 'main.html',
            controller: 'mainController',
			resolve: {
				loggedin :blockUnauth
			}
        })
		.when('/login', {
			templateUrl: 'login.html',
			controller: 'authController',
			resolve: {
				loggedin: blockAuth
			}
		})
		.when('/signup', {
			templateUrl: 'signup.html',
			controller: 'authController',
			resolve: {
				loggedin: blockAuth
			}
		})
		.when('/routines', {
			templateUrl: 'routine_views/routines.html',
			controller: 'routineController',
			resolve: {
				loggedin : blockUnauth
			}
		})
		.when('/workouts', {
			templateUrl: 'workout_views/workouts.html',
			controller: 'workoutController',
			resolve: {
				loggedin :blockUnauth
			}
		})
		.when('/exercises', {
			templateUrl: 'exercise_views/exercises.html',
			controller: 'exerciseController',
			resolve: {
				loggedin :blockUnauth
			}
		})
		.when('/addRoutine', {
			templateUrl: 'routine_views/addRoutine.html',
			controller: 'routineController',
			resolve: {
				loggedin :blockUnauth
			}
		})
		.when('/addWorkout', {
			templateUrl: 'workout_views/addWorkout.html',
			controller: 'workoutController',
			resolve: {
				loggedin :blockUnauth
			}
		})
		.when('/addExercise', {
			templateUrl: 'exercise_views/addExercise.html',
			controller: 'exerciseController',
			resolve: {
				loggedin :blockUnauth
			}
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

app.controller('authController', function($scope, $http, $location){
  $scope.user = {username: '', password: '', name: ''};
  $scope.error_message = '';

  $scope.login = function(){
    $http.post('/auth/login', $scope.user).then(function(success){
      if(success.data.state == 'success'){
        $location.path('/');
      }
      else{
        $scope.error_message = success.data.message;
      }
	});
  };

  $scope.signup = function(){
    $http.post('/auth/signup', $scope.user).then(function(success){
      if(success.data.state == 'success'){
        $location.path('/');
      }
      else{
        $scope.error_message = success.data.message;
      }
    });
  };
});
