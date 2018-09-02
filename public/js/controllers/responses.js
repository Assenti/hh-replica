app.controller('ResponsesCtrl', ResponsesCtrl);

ResponsesCtrl.$inject = ['$http', '$scope', '$state', '$rootScope'];

function ResponsesCtrl($http, $scope, $state, $rootScope){
	var vm = this;
	vm.invites = 0;
	vm.modal = false;
	vm.currentPage = 1;
	vm.pages = [];
	vm.allPages = [];

	
	$http.get('/api/cv/responses/' + $state.params.id + '/' + vm.currentPage)
	.success(function(response){
		console.log(response);
		vm.cvs = response.cvs;
		vm.count = response.count;

		vm.allPages = new Array(Math.ceil(vm.count / 5));

		for(var i = 0; i < vm.allPages.length; i++){
			vm.allPages[i] = i;
		}
		vm.pages = vm.allPages.slice(0, 5);

		for(var i = 0; i < vm.cvs.length; i++){
			vm.invites += vm.cvs[i].responses.length;
		}
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

	vm.nextPage = function(){
		if(vm.currentPage % 5 == 0 && vm.currentPage < vm.allPages.length){
			vm.pages = vm.allPages.slice(vm.currentPage, vm.currentPage + 5);
			vm.currentPage++;
			vm.getCVs();
		} else if(vm.currentPage < vm.allPages.length){
			vm.currentPage++;
			vm.getCVs();
		}
	}

	vm.prevPage = function(){
		if((vm.currentPage - 1) % 5 == 0 && vm.currentPage > 1){
			vm.currentPage--;
			vm.pages = vm.allPages.slice(vm.currentPage - 5, vm.currentPage);
			vm.getCVs();
		} else if(vm.currentPage > 1){
			vm.currentPage--;
			vm.getCVs();
		}
	}

	vm.getCVs = function() {
		$http.get('/api/cv/responses/' + $state.params.id + '/' + vm.currentPage)
		.success(function(response){
			vm.cvs = response.cvs;
		})
		.error(function(err){
			console.log(err);
		})
	}

	vm.displayPage = function(page){
		vm.currentPage = page;
		vm.getCVs();
	}

}