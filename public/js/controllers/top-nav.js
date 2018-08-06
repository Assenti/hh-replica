app.controller('TopNavCtrl', TopNavCtrl);

TopNavCtrl.$inject = ['$http', '$scope', '$rootScope', '$window'];

function TopNavCtrl($http, $scope, $rootScope, $window){
	var vm = this;
	vm.dropList = null;
	
	vm.signIn = function(){
		var data = {
			email: vm.email,
			password: vm.password
		}

		$http.post('/api/employee/signin', data)
		.success(function(response){
			$rootScope.session = response;
			$state.go('home');
		})
		.error(function(err){
			vm.invalidSignIn = true;
			console.log(err);
		});
	}

	vm.signout = function(){
		$http.post('/api/employee/signout')
		.success(function(response){
			$rootScope.session = undefined;
			$state.go('home');
		})
		.error(function(err){
			console.log(err);
		});
	}

	vm.openDropList = function(id){
		vm.dropList = id;
	}

	vm.closeDropList = function(){
		vm.dropList = null;
	}

	vm.logo = true;
	vm.search = true;
	vm.auth = true;

	vm.session = true;
}