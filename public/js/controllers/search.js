app.controller('SearchCtrl', SearchCtrl);

SearchCtrl.$inject = ['$http', '$scope', '$state', '$rootScope'];

function SearchCtrl($http, $scope, $state, $rootScope){
	var vm = this;
	vm.chosenOption = 'Вакансии';
	vm.currentPage = 1;
	vm.pages = [];
	vm.allPages = [];
	vm.count = 0;

	vm.filterOptions = ['По умолчанию', 'По дате', 'По возрастанию зарплаты', 'По убыванию зарплаты'];


	if(vm.chosenOption === 'Вакансии') {
		vm.xp = 'vacancy';
		vm.sal = 'vacancy';
	}
	if(vm.chosenOption === 'Резюме') {
		vm.xp = 'cv';
		vm.sal = 'cv';
	}

	$http.get('/api/getxp', {params: {
		query: vm.xp
	}})
	.success(function(response){
		vm.xps = response.sort(function(a,b) {
			if(a.xpLength < b.xpLength) return -1;
			if (a.xpLength > b.xpLength) return 1;
			return 0;
		});
	})
	.error(function(err){
		console.log(err);
	})

	$http.get('/api/getsalaries', {params: {
		query: vm.sal
	}})
	.success(function(response){
		vm.salaries = response.sort(function(a,b) {
			if(a.salary < b.salary) return -1;
			if (a.salary > b.salary) return 1;
			return 0;
		})
		
	})
	.error(function(err){
		console.log(err);
	})

	

	vm.nextPage = function(){
		if(vm.currentPage % 5 == 0 && vm.currentPage < vm.allPages.length){
			vm.pages = vm.allPages.slice(vm.currentPage, vm.currentPage + 5);
			vm.currentPage++;
			vm.search();
		} else if(vm.currentPage < vm.allPages.length){
			vm.currentPage++;
			vm.search();
		}
	}

	vm.prevPage = function(){
		if((vm.currentPage - 1) % 5 == 0 && vm.currentPage > 1){
			vm.currentPage--;
			vm.pages = vm.allPages.slice(vm.currentPage - 5, vm.currentPage);
			vm.search();
		} else if(vm.currentPage > 1){
			vm.currentPage--;
			vm.search();
		}
	}

	vm.displayPage = function(page){
		vm.currentPage = page;
		vm.search();
	}

	vm.chooseBlock = function(block){
		vm.chosenOption = block;
	}

	vm.search = function(){
		if(vm.chosenOption === 'Вакансии'){
			if(vm.filterOption === vm.filterOptions[0] || vm.filterOption === vm.filterOptions[1]){
				var salarysort = undefined;
				var datesort = undefined;
			}
			if(vm.filterOption === vm.filterOptions[2]){
				var salarysort = 1;
				var datesort = undefined;
			}
			if(vm.filterOption === vm.filterOptions[3]){
				var salarysort = -1;
				var datesort = undefined;
			}

			$http.get('/api/vacancy/search/filters', { params: {
				salary: vm.salary,
				salarysort: salarysort,
				datesort: datesort,
				xp: vm.xpLength,
				page: vm.currentPage
			}})
			.success(function(response){
				if(response.results.length == 0) vm.notFound = true;
				vm.results = response.results;
				vm.count = response.count;
				vm.allPages = new Array(Math.ceil(vm.count / 5));

				for(var i = 0; i < vm.allPages.length; i++){
					vm.allPages[i] = i;
				}
				vm.pages = vm.allPages.slice(0, 5);
			})
		}
		if(vm.chosenOption === 'Резюме'){
			if(vm.filterOption === vm.filterOptions[0] || vm.filterOption === vm.filterOptions[1]){
				var salarysort = undefined;
				var datesort = undefined;
			}
			if(vm.filterOption === vm.filterOptions[2]){
				var salarysort = 1;
				var datesort = undefined;
			}
			if(vm.filterOption === vm.filterOptions[3]){
				var salarysort = -1;
				var datesort = undefined;
			}

			$http.get('/api/cv/search/filters', { params: {
				salary: vm.salary,
				salarysort: salarysort,
				datesort: datesort,
				xp: vm.xpLength,
				page: vm.currentPage
			}})
			.success(function(response){
				console.log(response)
				if(response.results.length == 0) vm.notFound = true;
				vm.results = response.results;
				vm.count = response.count;
				vm.allPages = new Array(Math.ceil(vm.count / 5));

				for(var i = 0; i < vm.allPages.length; i++){
					vm.allPages[i] = i;
				}
				vm.pages = vm.allPages.slice(0, 5);
			})
		}
	}

	vm.reset = function(){
		$state.reload();
	}

	vm.yearDefiner = function(xp){
		if(xp == 1) return ' год';
		else if(xp > 1 && xp < 5) return ' года';
		else return ' лет';
	}

	vm.toolToggle = function(id){
		$('#'+id).slideToggle('slow');
	}

}