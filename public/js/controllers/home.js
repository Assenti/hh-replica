app.controller('MainCtrl', MainCtrl);

MainCtrl.$inject = ['$http', '$scope', '$rootScope', '$state'];

function MainCtrl($http, $scope, $rootScope, $state){
	var vm = this;

	vm.registration = false;
	vm.employerAuth = false;

	vm.signIn = function(){
		var data = {
			email: vm.email,
			password: vm.password
		}

		$http.post('/api/user/signin', data)
		.success(function(response){
			$rootScope.session = response;
			if(response.employerAccess) {
				$state.go('employer/' + response._id);
			} else {
				$state.go('/user/' + response._id);
			}
		})
		.error(function(err){
			console.log(err);
		});
	}

	$http.get('/api/user')
		.success(function(response){
			vm.users = response;
		})
		.error(function(err){
			console.log(err);
		})

	$http.get('/api/employer')
		.success(function(response){
			vm.employers = response;
		})
		.error(function(err){
			console.log(err);
		})

	// $http.get('/api/cv')
	// 	.success(function(response){
	// 		vm.cvsQuantity = response;
	// 	})
	// 	.error(function(err){
	// 		console.log(err);
	// 	})

}