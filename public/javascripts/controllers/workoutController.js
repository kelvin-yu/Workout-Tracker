var app = angular.module('workoutApp');

app.controller('workoutController', function($location, $scope, workoutService, routineService){
	$scope.newWorkout = {routine:''};
	$scope.selectedRoutine = '';
	$scope.workouts = workoutService.query();
	$scope.routines = routineService.query();
	$scope.post = function(){
		$scope.newWorkout.routine = $scope.selectedRoutine._id;
		workoutService.save($scope.newWorkout, function(){
			$location.path('/');	
		});
	};
});
