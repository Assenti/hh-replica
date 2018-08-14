app.controller('AuthCtrl', AuthCtrl);

AuthCtrl.$inject = ['$http', '$scope', '$state', '$rootScope', '$cookies'];

function AuthCtrl($http, $scope, $state, $rootScope, $cookies){
	var vm = this;
	vm.success = false;
	vm.error = false;

	vm.signIn = function(){
		var data = {
			email: vm.email,
			password: vm.password
		}

		$http.post('/api/user/signin', data)
		.success(function(response){
			$rootScope.session = response;
			console.log(response);
			if(response.employerAccess){
				$state.go('employer', {id: response.employer});
			} else {
				$state.go('user', {id: response._id});
			}
			vm.success = true;
		})
		.error(function(err){
			console.log(err);
			vm.error = true;
		});
	}

	

	vm.signUpEmployee = function(){
		vm.isLoading = true;
		var data = {
			firstname: vm.firstname,
			lastname: vm.lastname,
			email: vm.email,
			password: vm.password,
			phone: vm.phone
		}

		$http.post('/api/user/signup', data)
		.success(function(response){
			vm.isLoading = false;
			vm.success = true;
		})
		.error(function(err){
			console.log(err);
			vm.error = true;
			vm.isLoading = false;
		});
	}

	vm.signUpEmployer = function(){

		vm.isLoading = true;
		var data = {
			firstname: vm.firstname,
			lastname: vm.lastname,
			email: vm.email,
			password: vm.password,
			phone: vm.phone,
			employerAccess: true,
			name: vm.name,
			site: vm.site,
			employeesQuantity: vm.employeesQuantity,
			city: vm.city
		}

		$http.post('/api/user/signup', data)
		.success(function(response){
			vm.success = true;
			vm.isLoading = false;
		})
		.error(function(err){
			console.log(err);
			vm.error = true;
			vm.isLoading = false;
		});
	}
}