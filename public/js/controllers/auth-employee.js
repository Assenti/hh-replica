app.controller('AuthEmployeeCtrl', AuthEmployeeCtrl);

AuthEmployeeCtrl.$inject = ['$http', '$scope', '$state', '$rootScope'];

function AuthEmployeeCtrl($http, $scope, $state, $rootScope){
	var vm = this;
	vm.invalidSignIn = false;

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

	vm.invalidPassword = false;

	function passwordValidate(passwordCandidate){
		if(passwordCandidate === vm.password) return vm.password;
		else vm.password = null;
	}

	vm.signup = function(){
		var data = {
			firstname: vm.firstname,
			lastname: vm.lastname,
			email: vm.email,
			password: passwordValidate(vm.passwordCandidate)
		}

		if(vm.password == null) {
			vm.invalidPassword = true;
		}

		$http.post('/api/employee', data)
		.success(function(response){
			$state.go('auth');
			console.log(response)
		})
		.error(function(err){
			console.log(err);
		});
	}

}