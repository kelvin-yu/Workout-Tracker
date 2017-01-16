var app = angular.module('workoutApp');

app.controller('exerciseController', function($scope, $location, exerciseService){
	$scope.newExercise = {name:''};
	$scope.exercises = exerciseService.query();	
	$scope.post = function(){
		exerciseService.save($scope.newExercise, function(){
			$location.path('/');
		});
	};
});
