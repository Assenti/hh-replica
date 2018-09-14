app.controller('AuthCtrl', AuthCtrl);

AuthCtrl.$inject = ['$http', '$scope', '$state', '$rootScope', '$cookies'];

function AuthCtrl($http, $scope, $state, $rootScope, $cookies){
	var vm = this;
	vm.message = null;

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
			setTimeout(function(){ vm.message = null}, 3000);
		})
		.error(function(err){
			console.log(err);
			vm.status = 'error';
			vm.message = 'Не верно введены Email или пароль';
			setTimeout(function(){ vm.message = null}, 3000);
		});
	}

	vm.signUpEmployee = function(){
		var data = {
			firstname: vm.firstname,
			lastname: vm.lastname,
			email: vm.email,
			password: vm.password,
			phone: vm.phone
		}
		vm.isLoading = true;
		$http.post('/api/user/signup', data)
		.success(function(response){
			vm.isLoading = false;
			vm.status = 'success';
			vm.message = 'Регистрация прошла успешно, пройдите пожалуйста по ссылке указанной в письме отправленное вам на почту.';
			setTimeout(function(){ vm.message = null}, 3000);
		})
		.error(function(err){
			console.log(err);
			vm.isLoading = false;
			vm.status = 'error';
			vm.message = 'Ошибка регистрации. Пожалуйста повторите снова.';
			setTimeout(function(){ vm.message = null}, 3000);
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
			vm.isLoading = false;
			vm.status = 'success';
			vm.message = 'Регистрация прошла успешно, пройдите пожалуйста по ссылке указанной в письме отправленное вам на почту.';
			setTimeout(function(){ vm.message = null}, 3000);
		})
		.error(function(err){
			console.log(err);
			vm.isLoading = false;
			vm.status = 'error';
			vm.message = 'Ошибка регистрации. Пожалуйста повторите снова.';
			setTimeout(function(){ vm.message = null}, 3000);
		});
	}
}