app.controller('PreloaderCtrl', PreloaderCtrl);

PreloaderCtrl.$inject = ['$http', '$scope'];

function PreloaderCtrl($http, $scope){
	var vm = this;
	$scope.IsLoading = true;

	angular.element(window).ready(function(){
		$scope.IsLoading = false;
	});
}


// window.onload = function() {
//     var preloader = document.getElementsByClassName('preloader')[0];

//     preloader.className += ' fade';

//     setTimeout(function(){
//         preloader.style.display = 'none';
//     }, 300);
// };