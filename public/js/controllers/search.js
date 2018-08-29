app.controller('SearchCtrl', SearchCtrl);

SearchCtrl.$inject = ['$http', '$scope', '$state', '$rootScope'];

function SearchCtrl($http, $scope, $state, $rootScope){
	var vm = this;
	vm.chosenOption = 'Вакансии';
	vm.currentPage = 1;
	vm.pages = [];
	vm.allPages = [];
	vm.toggler = false;
	vm.xp = null;

	vm.years = ['Выберите опыт',0,1,2,3,4,5,6,7,8,9,10];
	vm.year = vm.years[0];

	vm.salaries = ['Выберите оклад',50000,100000,200000,300000,400000,500000];
	vm.salary = vm.salaries[0];

	$http.get('/api/vacancy/search/' + vm.currentPage)
	.success(function(response){
		vm.results = response.results;
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

	vm.nextPage = function(){
		if(vm.currentPage % 5 == 0 && vm.currentPage < vm.allPages.length){
			vm.pages = vm.allPages.slice(vm.currentPage, vm.currentPage + 5);
			vm.currentPage++;
			vm.getPosts();
		} else if(vm.currentPage < vm.allPages.length){
			vm.currentPage++;
			vm.getPosts();
		}
	}

	vm.prevPage = function(){
		if((vm.currentPage - 1) % 5 == 0 && vm.currentPage > 1){
			vm.currentPage--;
			vm.pages = vm.allPages.slice(vm.currentPage - 5, vm.currentPage);
			vm.getPosts();
		} else if(vm.currentPage > 1){
			vm.currentPage--;
			vm.getPosts();
		}
	}

	vm.getPosts = function() {
		var api = 'vacancy';
		if(vm.chosenOption === 'Резюме') api = 'cv'
		else if(vm.chosenOption === 'Компании') api = 'employer' 
		$http.get('/api/' + api + '/search/' + vm.currentPage)
			.success(function(response){
				vm.results = response.results;

			})
			.error(function(err){
				console.log(err);
			})
	}

	vm.displayPage = function(page){
		vm.currentPage = page;
		vm.getPosts();
	}

	vm.uniSearch = function(option, api){
		vm.chosenOption = option;
		$http.get('/api/' + api + '/search/' + vm.currentPage)
		.success(function(response){
			vm.results = response.results;
			vm.count = response.count;
			if(vm.results.length === 0){
				vm.notFound = true;
			}
			vm.allPages = new Array(Math.ceil(vm.count / 5));
			for(var i = 0; i < vm.allPages.length; i++){
				vm.allPages[i] = i;
			}
			vm.pages = vm.allPages.slice(0, 5);
		})
		.error(function(err){
			console.log(err);
		})
	}

	var setFilter = function(filter){
		vm.filter = filter;
	}

	var setFilterReverse = function(filter){
		vm.filter = '-' + filter;
	}

	vm.sortToggler = function(filter1, filter2){
		if(vm.chosenOption === 'Компании'){
			vm.toggler = !vm.toggler;
			if(vm.toggler) setFilter(filter2)
			else setFilterReverse(filter2);
		} else {
			vm.toggler = !vm.toggler;
			if(vm.toggler) setFilter(filter1)
			else setFilterReverse(filter1);
		}
		
	}


}