app.controller('MainCtrl', MainCtrl);

MainCtrl.$inject = ['$http', '$scope', '$rootScope', '$state'];

function MainCtrl($http, $scope, $rootScope, $state){
	var vm = this;
	vm.message = null;
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
			if(response.employerAccess){
				$state.go('employer', {id: response.employer});
			} else {
				$state.go('user', {id: response._id});
			}
			vm.status = 'success';
			vm.message = 'Авторизация прошла успешно';
			setTimeout(function(){ vm.message = null;}, 3000);
		})
		.error(function(err){
			console.log(err);
			vm.status = 'error';
			vm.message = 'Не верно введены Email или пароль';
			setTimeout(function(){ vm.message = null;}, 3000);
		});
	}

	$http.get('/api/employer')
	.success(function(response){
		vm.employers = response;
	})
	.error(function(err){
		console.log(err);
	})

	$http.get('/api/cv')
	.success(function(response){
		vm.cvs = response;
	})
	.error(function(err){
		console.log(err);
	})

	$http.get('/api/vacancy')
	.success(function(response){
		vm.vacancies = response;
	})
	.error(function(err){
		console.log(err);
	})

	vm.yearDefiner = function(xp){
		if(xp == 1) return ' год';
		else if(xp > 1 && xp < 5) return ' года';
		else return ' лет';
	}
}