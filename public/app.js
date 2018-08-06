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
		controller: 'AuthEmployeeCtrl',
		controllerAs: 'vm'
	})
	.state('signin-employee', {
		url: '/employee/signin',
		templateUrl: '/views/signin-employee.html',
		controller: 'AuthEmployeeCtrl',
		controllerAs: 'vm'
	})
	.state('signin-employer', {
		url: '/employer/signin',
		templateUrl: '/views/signin-employer.html',
		controller: 'AuthEmployerCtrl',
		controllerAs: 'vm'
	})
	.state('signup-employer', {
		url: '/employer/signup',
		templateUrl: '/views/signup-employer.html',
		controller: 'AuthEmployerCtrl',
		controllerAs: 'vm'
	});
}