var app = angular.module('workoutApp');

app.controller('mainController', function($http, $location, $rootScope, $scope, routineService, workoutService, exerciseService){
	$http.get('/api/user').then(function(response){
		$scope.user = response.data;
	});
	$scope.routines = routineService.query();
	$scope.workouts = workoutService.query();
	$scope.exercises = exerciseService.query();
});
