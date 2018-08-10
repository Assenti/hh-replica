app.controller('TopNavCtrl', TopNavCtrl);

TopNavCtrl.$inject = ['$http', '$scope', '$rootScope', '$window', '$state', '$cookies'];

function TopNavCtrl($http, $scope, $rootScope, $window, $state, $cookies){
	var vm = this;

	if($cookies.getObject('session')){
		$rootScope.session = $cookies.getObject('session');
	}
	
	vm.signout = function(){
		$http.post('/api/user/signout')
		.success(function(response){
			$rootScope.session = undefined;
			$state.go('home');
		})
		.error(function(err){
			console.log(err);
		});
	}

	vm.dropList = null;
	vm.openDropList = function(id){
		vm.dropList = id;
	}

	vm.closeDropList = function(){
		vm.dropList = null;
	}
}