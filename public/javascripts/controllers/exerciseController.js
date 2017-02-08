var app = angular.module('workoutApp');

app.controller('exerciseController', function($scope, $location, exerciseService){
	//view exercises
	$scope.newExercise = {name:'', muscles_worked:[], force:[], equipment:[]};
	$scope.exercises = exerciseService.query();		
	//add exercises
	$scope.addMuscleField = function(){
		$scope.newExercise.muscles_worked.push("");
	};	

	$scope.addForceField = function(){
		$scope.newExercise.force.push("");
	};	

	$scope.addEquipmentField = function(){
		$scope.newExercise.equipment.push("");
	};	
	
	$scope.addExercise = function(){
		exerciseService.save($scope.newExercise, function(){
			$location.path('/');
		});
	};

	$scope.selectedExercise = {};
	$scope.expand = function(exercise){
		//BUG: makes the call during opening and closing
		console.log($scope.selectedExercise);	
		$scope.selectedExercise = exerciseService.get({id:exercise._id});	
	};
});
