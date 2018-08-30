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

	
	vm.years = ['Выберите опыт','Нет опыта',1,2,3,4,5,6,7,8,9,10];
	vm.year = vm.years[0];

	$http.get('/api/cv/salaries')
	.success(function(response){
		vm.cv_salaries = response;
	})
	.error(function(err){
		console.log(err);
	})

	// Output info on loading page (default - vacancies output)
	$http.get('/api/vacancy/search/' + vm.currentPage)
	.success(function(response){
		vm.results = response.results;
		vm.count = response.count;
		vm.vacancy_salaries = [];
		vm.allPages = new Array(Math.ceil(vm.count / 5));

		for(var j = 0; j < response.results.length; j++){
			vm.vacancy_salaries[j] = response.results[j].salary;
		}

		vm.salaries = ['Выберите оклад'];
		vm.salary = vm.salaries[0];
		var mergedSalaries = arrayUnique(vm.cv_salaries.concat(vm.vacancy_salaries));
		for(var k = 0, l = 1; k < mergedSalaries.length; k++, l++){
			vm.salaries[l] = mergedSalaries[k];
		}

		for(var i = 0; i < vm.allPages.length; i++){
			vm.allPages[i] = i;
		}
		vm.pages = vm.allPages.slice(0, 5);
	})
	.error(function(err){
		console.log(err);
	})

	function arrayUnique(array) {
	    var a = array.concat();
	    for(var i=0; i<a.length; ++i) {
	        for(var j=i+1; j<a.length; ++j) {
	            if(a[i] === a[j])
	                a.splice(j--, 1);
	        }
	    }
	    return a;
	}

	vm.paramWatcher = function(param){
		$scope.strict = true;
		if(vm.salary === param){
			vm.year = vm.years[0];
			vm.param = {salary: vm.salary};
			if(vm.chosenOption === 'Вакансии'){
				vm.notFound = !vm.vacancy_salaries.includes(vm.salary);
				console.log(vm.notFound);
			} else if(vm.chosenOption === 'Резюме'){
				vm.notFound = !vm.cv_salaries.includes(vm.salary);
				console.log(vm.notFound);
			}
		} else if(vm.year === param){

			if(vm.year === 'Нет опыта'){
				vm.salary = vm.salaries[0];
				vm.param = {xpLength: 0};
				console.log(vm.param);
			} else {
				vm.salary = vm.salaries[0];
				vm.param = {xpLength: vm.year};
				console.log(vm.param);
			}
		}
	}


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

		vm.notFound = false;
		vm.param = '';
		$scope.strict = false;
		vm.year = vm.years[0];
		vm.salary = vm.salaries[0];
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

	vm.resetFilters = function(){
		vm.notFound = false;
		vm.param = '';
		$scope.strict = false;
		vm.year = vm.years[0];
		vm.salary = vm.salaries[0];
		vm.filter = '';
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