var app = angular.module('workoutApp');

app.controller('routineController', function($location, $http, $scope, routineService, $rootScope){
	$scope.newRoutine = {title:''};
	$scope.routines = routineService.query();
	$scope.post = function(){
		routineService.save($scope.newRoutine, function(){
			$location.path('/');
		});
	};
});
