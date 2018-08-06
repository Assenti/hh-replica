app.controller('SignUpEmployeeCtrl', SignUpEmployeeCtrl);

SignUpEmployeeCtrl.$inject = ['$http', '$scope'];

function SignUpEmployeeCtrl($http, $scope){
	var vm = this;
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