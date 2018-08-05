app.controller('TopNavCtrl', TopNavCtrl);

TopNavCtrl.$inject = ['$http', '$scope', '$rootScope'];

function TopNavCtrl($http, $scope, $rootScope){
	var vm = this;
	vm.dropList = null;
	vm.openDropList = function(id){
		vm.dropList = id;
	}
	vm.closeDropList = function(){
		vm.dropList = null;
	}
}