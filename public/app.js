var app = angular.module('hh-replica', [
	'ui.router',
	'ngCookies'
]);

app.config(routeConfig);

routeConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

function routeConfig($stateProvider, $urlRouterProvider, $locationProvider){
	$locationProvider.html5Mode(true);
	$urlRouterProvider.otherwise('/');

	$stateProvider
	.state('home', {
		url: '/',
		templateUrl: '/views/home.html',
		controller: 'MainCtrl',
		controllerAs: 'vm'
	})
	.state('signup-employee', {
		url: '/employee/signup',
		templateUrl: '/views/signup-employee.html',
		controller: 'AuthCtrl',
		controllerAs: 'vm'
	})
	.state('signup-employer', {
		url: '/employer/signup',
		templateUrl: '/views/signup-employer.html',
		controller: 'AuthCtrl',
		controllerAs: 'vm'
	})
	.state('signin', {
		url: '/user/signin',
		templateUrl: '/views/signin.html',
		controller: 'AuthCtrl',
		controllerAs: 'vm'
	})
	.state('employer', {
		url: '/employer/:id',
		templateUrl: '/views/employer-dashboard.html',
		controller: 'EmployerDashboardCtrl',
		controllerAs: 'vm'
	})
	.state('newvacancy', {
		url: '/newvacancy',
		templateUrl: '/views/newvacancy.html',
		controller: 'EmployerDashboardCtrl',
		controllerAs: 'vm'
	})
	.state('addmanager', {
		url: '/employee/addmanager',
		templateUrl: '/views/addmanager.html',
		controller: 'EmployerDashboardCtrl',
		controllerAs: 'vm'
	})
	.state('user', {
		url: '/user/:id',
		templateUrl: '/views/employee-dashboard.html',
		controller: 'EmployeeDashboardCtrl',
		controllerAs: 'vm'
	})
	.state('responses', {
		url: '/employee/responses/:id',
		templateUrl: '/views/responses.html',
		controller: 'EmployeeDashboardCtrl',
		controllerAs: 'vm'
	})
	.state('cv', {
		url: '/cv/view/:id/:user_id',
		templateUrl: '/views/cv.html',
		controller: 'CVCtrl',
		controllerAs: 'vm'
	})
	.state('newcv', {
		url: '/newcv',
		templateUrl: '/views/newcv.html',
		controller: 'NewCVCtrl',
		controllerAs: 'vm'
	})
	.state('vacancy', {
		url: '/vacancy/:id',
		templateUrl: '/views/vacancy.html',
		controller: 'VacancyCtrl',
		controllerAs: 'vm'
	})
	.state('account', {
		url: '/user/account/:id',
		templateUrl: '/views/account.html',
		controller: 'AccountCtrl',
		controllerAs: 'vm'
	})
	.state('search', {
		url: '/search',
		templateUrl: '/views/search.html',
		controller: 'SearchCtrl',
		controllerAs: 'vm'
	})
	.state('favourites', {
		url: '/favourites',
		templateUrl: '/views/favourites.html',
		controller: 'FavouritesCtrl',
		controllerAs: 'vm'
	});
}

