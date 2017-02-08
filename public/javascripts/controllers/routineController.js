var app = angular.module('workoutApp');

app.controller('routineController', function($location, $http, $scope, routineService, $rootScope){
	$scope.newRoutine = {title:''};
	$scope.routines = routineService.query();
	$scope.selectedRoutine = {};
	$scope.isExpanded = false;
	$scope.post = function(){
		routineService.save($scope.newRoutine, function(){
			$location.path('/');
		});
	};
	$scope.expand = function(routine){
		//BUG: makes the call during opening and closing
		$scope.selectedRoutine = routineService.get({id:routine._id});	
	};
});
