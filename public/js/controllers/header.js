app.controller('HeaderCtrl', HeaderCtrl);

HeaderCtrl.$inject = ['$http', '$scope'];

function HeaderCtrl($http, $scope){
	var vm = this;
	vm.chosenOption = 'Вакансии';
	vm.open = false;
	vm.startSearch = false;
	vm.notFound = false;

	vm.openOptions = function(){
		vm.open = true;
	}
	vm.closeOptions = function(){
		vm.open = false;
	}

	vm.choose = function(option){
		vm.chosenOption = option;
		vm.open = false;
	}

	vm.keyWatcher = function(event){
		if(event.keyCode === 27) {
			vm.query = null;
			vm.startSearch = false;
		} else if (event.keyCode === 13) {
			vm.find();
		}
	}

	var vacancySearch = function(){
		if(!vm.query){ return }
		$http.get('/api/vacancy/search/' + vm.query)
		.success(function(response){
			vm.found_vacancies = response.results;
			
			if(response.length === 0){
				vm.notFound = true;
			}
		})
		.error(function(err){
			console.log(err);
		})
	}

	var cvSearch = function(){
		if(!vm.query){ return }
		$http.get('/api/cv/search/' + vm.query)
		.success(function(response){
			vm.found_cvs = response.results;
			
			if(response.length === 0){
				vm.notFound = true;
			}
		})
		.error(function(err){
			console.log(err);
		})
	}

	var employerSearch = function(){
		if(!vm.query){ return }
		$http.get('/api/employer/search/' + vm.query)
		.success(function(response){
			vm.found_employers = response.results;
			if(response.length === 0){
				vm.notFound = true;
			}
		})
		.error(function(err){
			console.log(err);
		})
	}

	
	vm.find = function(){
		vm.startSearch = true;
		if(vm.chosenOption === 'Вакансии') {
			vacancySearch();
		} else if(vm.chosenOption === 'Резюме') {
			cvSearch();
		} else if (vm.chosenOption === 'Компании') {
			employerSearch();
		}
	}

	vm.closeSearch = function(){
		vm.startSearch = false;
		vm.query = null;
	}
	
}