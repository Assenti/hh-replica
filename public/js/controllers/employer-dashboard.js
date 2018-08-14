app.controller('EmployerDashboardCtrl', EmployerDashboardCtrl);

EmployerDashboardCtrl.$inject = ['$http', '$scope', '$state', '$rootScope'];

function EmployerDashboardCtrl($http, $scope, $state, $rootScope){
	var vm = this;

	$http.get('/api/employer/' + $state.params.id)
	.success(function(response){
		vm.employer = response.employer;
		vm.managers = response.users;
	})
	.error(function(err){
		console.log(err);
	})


	vm.skills = [];
	vm.addSkill = function(){
		if(vm.skill != null) {
			vm.skills.push(vm.skill);
		}
	}
	vm.removeSkill = function(index){
		vm.skills.splice(index, 1);
	}

	vm.createVacancy = function(){
		var data = {
			position: vm.position,
			salary: vm.salary,
			xpLength: vm.xpLength,
			workSchedule: vm.workSchedule,
			requirements: vm.requirements,
			preferable: vm.preferable,
			conditions: vm.conditions,
			skills: vm.skills
		}
		
		$http.post('/api/vacancy/' + $state.params.id, data)
		.success(function(response){
			vm.employer.vacancies.push(response);
			vm.closeVacancyMaker();
		})
		.error(function(err){
			console.log(err);
		})
	}

	vm.modal = false;
   	vm.openModal = function(vacancy, index){
   		vm.modal = true;
   		vm.vacancyToDelete = vacancy;
   		vm.index = index;
   	}
   	vm.closeModal = function(){
   		vm.modal = false;
   	}

	vm.deleteVacancy = function(){
		$http.delete('/api/vacancy/' + $state.params.id + '/' + vm.vacancyToDelete._id)
			.success(function(response){
				vm.employer.vacancies.splice(vm.index, 1);
			})
			.error(function(err){
				console.log(err);
			});
	}

	vm.openVacancyMaker = function(){
		$("#vacancyForm").slideDown("slow");
	}

	vm.closeVacancyMaker = function(){
		$("#vacancyForm").slideUp("slow");
		vm.position = vm.salary = vm.xpLength = vm.workSchedule = '';
		vm.requirements = vm.preferable = vm.conditions = '';
		vm.skills = [];
   	};


   	vm.openManagerAdder = function(){
   		$("#managerForm").slideDown("slow");
   	}
   	vm.closeManagerAdder = function(){
   		$("#managerForm").slideUp("slow");
   		vm.firstname = vm.lastname = vm.phone = vm.email = vm.phone = '';
   	}

   	vm.success = false;
   	vm.addManager = function(){
   		var manager = {
   			firstname: vm.firstname,
   			lastname: vm.lastname,
   			email: vm.email,
   			phone: vm.phone,
   			password: vm.password,
   			employerAccess: true
   		}

   		$http.post('/api/user/signup/manager/' + $state.params.id, manager)
   		.success(function(response){
   			vm.success = true;
   		})
   		.error(function(err){
   			console.log(err);
   		})
   	}

}



