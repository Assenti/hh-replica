app.controller('EmployeeDashboardCtrl', EmployeeDashboardCtrl);

EmployeeDashboardCtrl.$inject = ['$http', '$scope', '$state', '$rootScope'];

function EmployeeDashboardCtrl($http, $scope, $state, $rootScope){
	var vm = this;
	vm.invites = 0;
	vm.modal = false;
	
	$http.get('/api/cv/user/' + $rootScope.session._id)
	.success(function(response){
		vm.cvs = response;
		for(var i = 0; i < vm.cvs.length; i++){
			vm.invites += vm.cvs[i].responses.length;
		}
	})
	.error(function(err){
		console.log(err);
	})


	$http.get('/api/vacancy')
	.success(function(response){
		console.log(response);
		vm.vacancies = response;
	})
	.error(function(err){
		console.log(err);
	})

   
   	vm.openModal = function(cv, index){
   		vm.modal = true;
   		vm.cvToDelete = cv;
   		vm.index = index;
   	}
   	vm.closeModal = function(){
   		vm.modal = false;
   	}

   	vm.deleteCV = function(){
		$http.delete('/api/cv/' + $state.params.id + '/' + vm.cvToDelete._id)
		.success(function(response){
			vm.cvs.splice(vm.index, 1);
		})
		.error(function(err){
			console.log(err);
		});
	}

	vm.removeResponse = function(cv, response){
		$http.delete('/api/cv/response/' + cv._id + '/' + response)
		.success(function(response){
			console.log(response);
		})
		.error(function(err){
			console.log(err);
		});
	}

}