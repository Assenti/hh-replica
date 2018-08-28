app.controller('HeaderCtrl', HeaderCtrl);

HeaderCtrl.$inject = ['$http', '$scope'];

function HeaderCtrl($http, $scope){
	var vm = this;
	vm.chosenOption = 'Вакансии';
	vm.choices = ['Вакансии', 'Резюме', 'Компании'];
	vm.open = false;
	vm.startSearch = false;
	vm.notFound = false;
	
	vm.openOptions = function(){
		vm.open = true;
	}
	vm.closeOptions = function(){
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
		$http.get('/api/vacancy/search/common/' + vm.query)
		.success(function(response){
			vm.found_vacancies = response;
			
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
		$http.get('/api/cv/search/common/' + vm.query)
		.success(function(response){
			vm.found_cvs = response;
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
		$http.get('/api/employer/search/common/' + vm.query)
		.success(function(response){
			vm.found_employers = response;
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
		console.log(vm.query);
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