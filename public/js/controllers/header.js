app.controller('HeaderCtrl', HeaderCtrl);

HeaderCtrl.$inject = ['$http', '$scope'];

function HeaderCtrl($http, $scope){
	var vm = this;
	vm.chosenOption = 'Вакансии';
	vm.open = false;

	vm.openOptions = function(){
		if(vm.open == false) vm.open = true;
		else vm.open = false;
	}

	vm.choose = function(option){
		vm.chosenOption = option;
		vm.open = false;
	}
	
}