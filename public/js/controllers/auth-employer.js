app.controller('AuthEmployerCtrl', AuthEmployerCtrl);

AuthEmployerCtrl.$inject = ['$http', '$scope', '$state', '$rootScope'];

function AuthEmployerCtrl($http, $scope, $state, $rootScope){
	var vm = this;
	vm.invalidSignIn = false;

	vm.signIn = function(){
		var data = {
			email: vm.email,
			password: vm.password
		}

		$http.post('/api/employer/signin', data)
		.success(function(response){
			$rootScope.session = response;
			$state.go('home');
		})
		.error(function(err){
			vm.invalidSignIn = true;
			console.log(err);
		});
	}

	
}