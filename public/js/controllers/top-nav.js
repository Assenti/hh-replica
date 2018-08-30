app.controller('TopNavCtrl', TopNavCtrl);

TopNavCtrl.$inject = ['$http', '$scope', '$rootScope', '$window', '$state', '$cookies'];

function TopNavCtrl($http, $scope, $rootScope, $window, $state, $cookies){
	var vm = this;
	vm.logo = false;

	if($cookies.getObject('session')){
		$rootScope.session = $cookies.getObject('session');
	}
	
	vm.signout = function(){
		$http.post('/api/user/signout')
		.success(function(response){
			$rootScope.session = undefined;
			$state.go('home');
		})
		.error(function(err){
			console.log(err);
		});
	}

	vm.dropList = null;
	vm.openDropList = function(id){
		vm.dropList = id;
	}

	vm.closeDropList = function(){
		vm.dropList = null;
	}

	vm.openHeader = function(){
		$('html, body').animate({scrollTop:0}, 'slow');
	}
	

	$(window).on('scroll', function(){
		if($(window).scrollTop() > 80){
			$('#topnav').removeClass('topnav');
			$('#topnav').addClass('topnav_scroll');
			$('.topnav__items').addClass('slide-in');
			$('.topnav__search').addClass('slide-in');
			$('.topnav__search-advanced').addClass('fade-in');
		} else {
			$('#topnav').addClass('topnav');
			$('#topnav').removeClass('topnav_scroll');
			$('.topnav__items').removeClass('slide-in');
			$('.topnav__search').removeClass('slide-in');
			$('.topnav__search-advanced').removeClass('fade-in');
		}
	});
}