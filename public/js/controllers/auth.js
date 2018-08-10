app.controller('AuthCtrl', AuthCtrl);

AuthCtrl.$inject = ['$http', '$scope', '$state', '$rootScope', '$cookies'];

function AuthCtrl($http, $scope, $state, $rootScope, $cookies){
	var vm = this;

	vm.employerAuth = false;

	vm.signIn = function(){
		var data = {
			email: vm.email,
			password: vm.password
		}

		$http.post('/api/user/signin', data)
		.success(function(response){
			$rootScope.session = response;
		})
		.error(function(err){
			console.log(err);
		});
	}

	vm.success = false;
	vm.error = false;
	vm.signUpEmployee = function(){
		var data = {
			firstname: vm.firstname,
			lastname: vm.lastname,
			email: vm.email,
			password: vm.password,
			phone: vm.phone
		}

		$http.post('/api/user/signup', data)
		.success(function(response){
			vm.success = true;
		})
		.error(function(err){
			console.log(err);
			vm.error = true;
		});
	}

	vm.signUpEmployer = function(){
		var data = {
			firstname: vm.firstname,
			lastname: vm.lastname,
			email: vm.email,
			password: vm.password,
			phone: vm.phone,
			employerAccess: true
		}

		var dataToEmployer = {
			name: vm.name,
			site: vm.site,
			employeesQuantity: vm.employeesQuantity,
			city: vm.city
		} 

		$http.post('/api/user/signup', data)
		.success(function(response){
			vm.success = true;
		})
		.error(function(err){
			console.log(err);
			vm.error = true;
		});

		$http.post('/api/employer/signup', dataToEmployer)
		.success(function(response){
			vm.success = true;
		})
		.error(function(err){
			console.log(err);
			vm.error = true;
		});
	}

}