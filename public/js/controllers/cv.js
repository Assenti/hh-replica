app.controller('CVCtrl', CVCtrl);

CVCtrl.$inject = ['$http', '$scope', '$state', '$rootScope'];

function CVCtrl($http, $scope, $state, $rootScope){
	var vm = this;

	$http.get('/api/cv/' + $state.params.id)
	.success(function(response){
		vm.cv = response;
	})
	.error(function(err){
		console.log(err);
	})



}