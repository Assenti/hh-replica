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
	.state('user', {
		url: '/user/:id',
		templateUrl: '/views/employee-dashboard.html',
		controller: 'EmployeeDashboardCtrl',
		controllerAs: 'vm'
	})
	.state('cv', {
		url: '/cv/:id',
		templateUrl: '/views/cv.html',
		controller: 'CVCtrl',
		controllerAs: 'vm'
	});
}