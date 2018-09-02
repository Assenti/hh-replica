app.controller('EmployeeDashboardCtrl', EmployeeDashboardCtrl);

EmployeeDashboardCtrl.$inject = ['$http', '$scope', '$state', '$rootScope', '$favourite'];

function EmployeeDashboardCtrl($http, $scope, $state, $rootScope, $favourite){
	var vm = this;
	vm.invites = 0;
	vm.watches = 0;
	vm.favourites = 0;
	vm.modal = false;
	vm.currentPage = 1;
	vm.pages = [];
	vm.allPages = [];

	vm.favourites = $favourite.getFavourites().length;

	$http.get('/api/cv/getresponses')
	.success(function(response){
		vm.invites = response.responses;
		vm.watches = response.watches;
	})
	.error(function(err){
		console.log(err);
	})

	
	$http.get('/api/cv/cvs/' + $state.params.id + '/' + vm.currentPage)
	.success(function(response){
		vm.cvs = response.cvs;
		vm.count = response.count;
		vm.allPages = new Array(Math.ceil(vm.count / 5));
		for(var i = 0; i < vm.allPages.length; i++){
			vm.allPages[i] = i;
		}
		vm.pages = vm.allPages.slice(0, 5);
	})
	.error(function(err){
		console.log(err);
	})


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
		$http.get('/api/cv/cvs/' + $state.params.id + '/' + vm.currentPage)
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