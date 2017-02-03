var app = angular.module('workoutApp', ['ngRoute', 'ngResource', 'ngCookies']);
	
app.run(function($rootScope, $http, $location, $route, errorMessageHandler){
	$rootScope.user = {username:"", password:""};
    $rootScope.logout = function(){
        $http.get("/auth/logout").then(function(response){
			$location.path('/');
			$route.reload();
		});
    };
	$rootScope.login = function(){
		$http.post('/auth/login', $rootScope.user).then(function(success){
			if(success.data.state == 'success'){
				$location.path('/home');
				$route.reload();
		 	}
			else{
		errorMessageHandler.push('authError', success.data.message);
			$location.path('/login');	
				$route.reload();
			}
		});
	};
	$rootScope.goHome = function(){
		$location.path('/');
		$route.reload();
	};
	$rootScope.loggedIn = false;
});

app.config(function($routeProvider, $locationProvider, $httpProvider){
	$httpProvider.interceptors.push(function($q, $location){
		return {
			response : function(response){
				return response;
			},
			responseError : function(response){
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

	var blockUnauth = function($q, $http, $location, $rootScope){
		var deferred = $q.defer();
		$http.get('/auth/loggedin').then(function(isLoggedIn){
			if(isLoggedIn.data){
				$rootScope.loggedIn = true;
				deferred.resolve();
			}
			else{
				$rootScope.loggedIn = false;
				deferred.reject();		
				$location.path('/login');
			}
		});
		return deferred.promise;
	};

	var blockAuth = function($q, $http, $location, $rootScope){
		var deferred = $q.defer();
		$http.get('/auth/loggedin').then(function(isLoggedIn){
			if(isLoggedIn.data){
				$rootScope.loggedIn = true;
				$location.path('/home');
				deferred.reject();
			}
			else{
				$rootScope.loggedIn = false;
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
				loggedin :blockAuth
			}
        })
		.when('/home', {
            templateUrl: 'home.html',
            controller: 'homeController',
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

app.factory('errorMessageHandler', function(){
	var errorMessage = {};
	return {
		push : function(key, message){
			errorMessage[key] = message;
		},
		pop : function(key){
			if(errorMessage[key]){
				var message = errorMessage[key];	
				errorMessage[key] = "";
				return message;
			}
			else{
				return "";	
			}
		}
	};
});

app.controller('authController', function($scope, $http, $location, errorMessageHandler){
  $scope.user = {username: '', password: '', name: ''};
  $scope.error_message = errorMessageHandler.pop('authError');
  $scope.login = function(){
    $http.post('/auth/login', $scope.user).then(function(success){
      if(success.data.state == 'success'){
        $location.path('/home');
      }
      else{
		errorMessageHandler.push('authError', success.data.message);
		  $scope.error_message = errorMessageHandler.pop('authError');
      }
	});
  };

  $scope.signup = function(){
    $http.post('/auth/signup', $scope.user).then(function(success){
      if(success.data.state == 'success'){
        $location.path('/home');
      }
      else{
		errorMessageHandler.push('authError', success.data.message);
		  $scope.error_message = errorMessageHandler.pop('authError');
      }
    });
  };
});
