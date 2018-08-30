app.controller('AccountCtrl', AccountCtrl);

AccountCtrl.$inject = ['$http', '$scope', '$state', '$rootScope', '$cookies'];

function AccountCtrl($http, $scope, $state, $rootScope, $cookies){
	var vm = this;
	vm.editor = false;
	vm.message = null;

	$http.get('/api/user/account/' + $state.params.id)
	.success(function(response){
		vm.user = response;
	})
	.error(function(err){
		console.log(err);
	})

	vm.modal = false;
	vm.openModal = function(){
		vm.modal = true;
	}
	vm.closeModal = function(){
		vm.modal = false;
	}

	vm.openEditor = function(){
		vm.editor = true;
		vm.objectToEdit = vm.user;
	}

	vm.closeEditor = function(){
		vm.editor = false;
		vm.objectToEdit = null;
	}

	vm.editAccount = function(){
		$http.post('/api/user/account', vm.objectToEdit)
		.success(function(response){
			vm.objectToEdit = null;
			vm.editor = false;
		})
		.error(function(err){
			console.log(err);
		})
	}

	vm.deleteAccount = function(){
		$http.get('/api/employer/' + vm.user.employer)
		.success(function(response){
			vm.employer = response;
			if(vm.employer.users.length >= 2){
			$http.delete('/api/user/account/' + $state.params.id)
				.success(function(response){
					$state.go('home');
				})
				.error(function(err){
					console.log(err);
				})
			} else {
				vm.status = 'error';
				vm.message = 'Перед удалением необходимо добавить другого менеджера';
				return 
			}

		})
		.error(function(err){
			res.send(err);
		})
	}

}