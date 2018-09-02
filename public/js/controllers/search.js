app.controller('SearchCtrl', SearchCtrl);

SearchCtrl.$inject = ['$http', '$scope', '$state', '$rootScope'];

function SearchCtrl($http, $scope, $state, $rootScope){
	var vm = this;
	vm.chosenOption = 'Вакансии';
	vm.currentPage = 1;
	vm.pages = [];
	vm.allPages = [];
	vm.toggler = false;
		
	vm.years = ['Выберите опыт','Нет опыта',1,2,3,4,5,6,7,8,9,10,'Более 10 лет'];
	vm.year = vm.years[0];

	vm.filterOptions = ['По соответствию', 'По дате', 'По возрастанию зарплаты', 'По убыванию зарплаты'];
	vm.filterOption = vm.filterOptions[0];

	$http.get('/api/getsalaries')
	.success(function(response){
		vm.salaries = ['Выберите оклад'];
		for(var i = 0; i < response.length; i++){
			vm.salaries[i+1] = response[i];
		}
		vm.salary = vm.salaries[0];
	})
	.error(function(err){
		console.log(err);
	})

	$http.get('/api/vacancy/search/' + vm.currentPage)
	.success(function(response){
		vm.results = response.results;
		vm.default = response.results;
		vm.count = response.count;
		vm.allPages = new Array(Math.ceil(vm.count / 5));

		if(vm.chosenOption === 'Вакансии') vm.found = 'вакансий';
		if(vm.chosenOption === 'Резюме') vm.found = 'резюме';
		if(vm.chosenOption === 'Компании') vm.found = 'компаний';

		for(var i = 0; i < vm.allPages.length; i++){
			vm.allPages[i] = i;
		}
		vm.pages = vm.allPages.slice(0, 5);
	})
	.error(function(err){
		console.log(err);
	})

	vm.filterBySalary = function(){
		if(vm.year != 'Выберите опыт'){
			vm.year = vm.years[0];
			vm.results = vm.default;
		}
		if(vm.chosenOption === 'Вакансии'){
			$http.get('/api/vacancy/salary_filter/' + vm.salary)
			.success(function(response){
				vm.results = response;
				if(response.length == 0) vm.notFound = true;
			})
			.error(function(err){
				console.log(err);
			})
		} else if(vm.chosenOption === 'Резюме') {
			$http.get('/api/cv/salary_filter/' + vm.salary)
			.success(function(response){
				vm.results = response;
				if(response.length == 0) vm.notFound = true;
			})
			.error(function(err){
				console.log(err);
			})
		}
	}

	vm.filterByXpLength = function(){
		if(vm.salary != 'Выберите оклад'){
			vm.salary = vm.salaries[0];
			vm.results = vm.default;
		}
		if(vm.chosenOption === 'Вакансии'){
			if(vm.year === 'Нет опыта') {
				$http.get('/api/vacancy/xp_filter/' + 0)
				.success(function(response){
					vm.results = response;
					if(response.length == 0) vm.notFound = true;
				})
				.error(function(err){
					console.log(err);
				})
			} else {
				$http.get('/api/vacancy/xp_filter/' + vm.year)
				.success(function(response){
					vm.results = response;
					if(response.length == 0) vm.notFound = true;
				})
				.error(function(err){
					console.log(err);
				})
			}
		} else if(vm.chosenOption === 'Резюме') {
			$http.get('/api/cv/xp_filter/' + vm.year)
			.success(function(response){
				vm.results = response;
				if(response.length == 0) vm.notFound = true;
			})
			.error(function(err){
				console.log(err);
			})
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
		vm.results = vm.default;
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

			if(vm.chosenOption === 'Вакансии') vm.found = 'вакансий';
			if(vm.chosenOption === 'Резюме') vm.found = 'резюме';
			if(vm.chosenOption === 'Компании') vm.found = 'компаний';

			for(var i = 0; i < vm.allPages.length; i++){
				vm.allPages[i] = i;
			}
			vm.pages = vm.allPages.slice(0, 5);
		})
		.error(function(err){
			console.log(err);
		})
	}

	vm.setFilter = function(){
		if(vm.filterOption === vm.filterOptions[0]){
			vm.filter = '';
		} else if(vm.filterOption === vm.filterOptions[1]){
			vm.filter = 'date';
		} else if(vm.filterOption === vm.filterOptions[2]){
			vm.filter = 'salary';
		} else if(vm.filterOption === vm.filterOptions[3]){
			vm.filter = '-salary';
		}
		
	}

	vm.resetFilters = function(){
		vm.results = vm.default;
		vm.notFound = false;
		vm.year = vm.years[0];
		vm.salary = vm.salaries[0];
		vm.filter = '';
	}

}