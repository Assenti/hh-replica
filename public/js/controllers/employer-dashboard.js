app.controller('EmployerDashboardCtrl', EmployerDashboardCtrl);

EmployerDashboardCtrl.$inject = ['$http', '$scope', '$state', '$rootScope'];

function EmployerDashboardCtrl($http, $scope, $state, $rootScope){
	var vm = this;
	vm.message = null;
	vm.modal = false;
	vm.deletation = false;
   	vm.currentPage = 1;
   	vm.allPages = [];
   	vm.skills = [];

   	if($state.current.name === 'employer'){
	   	$http.get('/api/employer/view/' + $state.params.id + '/' + vm.currentPage)
		.success(function(response){
		
			vm.employer = response.employer;
			vm.managers = response.employer.users;
		    vm.vacancies = response.vacancies;	

		    vm.responsesCount = 0;

		    vm.employees = [];
		    for(var i = 0; i < vm.vacancies.length; i++){
		    	vm.responsesCount += vm.vacancies[i].responses.length;
		    	for(var j = 0; j < vm.vacancies[i].responses.length; j++){
		    		vm.employees.push(vm.vacancies[i].responses[j])
		    	}
		    }

		    vm.count = response.count;		   
		    vm.allPages = new Array(Math.ceil(vm.count / 5));
		    for(var i = 0; i < vm.allPages.length; i++){
		    	vm.allPages[i] = i;
		    }
		    vm.pages = vm.allPages.slice(0, 5);
		})
		.error(function(err){
			console.log(err);
		})
	}

	if($state.current.name === 'newvacancy' || $state.current.name === 'addmanager'){
		$http.get('/api/employer/newvacancy/' + $rootScope.session._id)
		.success(function(response){
			vm.employer = response;
		})
		.error(function(err){
			console.log(err);
		})
	}

    vm.nextPage = function(){
    	if(vm.currentPage % 5 == 0 && vm.currentPage < vm.allPages.length){
	        vm.pages = vm.allPages.slice(vm.currentPage, vm.currentPage + 5);
	        vm.currentPage++;
	        vm.getVacancies();
	    } else if(vm.currentPage < vm.allPages.length){
	        vm.currentPage++;
	        vm.getVacancies();
	    }
   	}

   vm.prevPage = function(){
   		if((vm.currentPage - 1) % 5 == 0 && vm.currentPage > 1){
        	vm.currentPage--;
        	vm.pages = vm.allPages.slice(vm.currentPage - 5, vm.currentPage);
        	vm.getVacancies();
      	} else if(vm.currentPage > 1){
         	vm.currentPage--;
         	vm.getVacancies();
      	}
   }

   	vm.getVacancies = function() {
	   	$http.get('/api/employer/view/' + $state.params.id + '/' + vm.currentPage)
	    .success(function(response){
	    	vm.vacancies = response.vacancies;
	    })
	    .error(function(err){
	        console.log(err);
	    })
   	}

   	vm.displayPage = function(page){
    	vm.currentPage = page;
    	vm.getVacancies();
   	}
   
	vm.addSkill = function(){
		if(vm.skill != null) {
			vm.skills.push(vm.skill);
		}
		vm.skill = '';
	}
	vm.removeSkill = function(index){
		vm.skills.splice(index, 1);
	}

	vm.createVacancy = function(){
		var data = {
			employer_id: vm.employer._id,
			employer_name: vm.employer.name,
			position: vm.position,
			salary: vm.salary,
			xpLength: vm.xpLength,
			workSchedule: vm.workSchedule,
			requirements: vm.requirements,
			preferable: vm.preferable,
			conditions: vm.conditions,
			skills: vm.skills
		}
		
		$http.post('/api/vacancy/addvacancy', data)
		.success(function(response){
			vm.status = 'success';
			vm.message = 'Вакансия успешно создана';
			setTimeout(function(){ vm.message = null; }, 3000);
		})
		.error(function(err){
			console.log(err);
			vm.status = 'error';
			vm.message = 'Произошла ошибка, повторите попытку';
			setTimeout(function(){ vm.message = null; }, 3000);
		})
	}

   	vm.openModal = function(vacancy, index){
   		vm.modal = true;
   		vm.vacancyToDelete = vacancy;
   		vm.index = index;
   	}
   	vm.closeModal = function(){
   		vm.modal = false;
   	}

	vm.deleteVacancy = function(){
		$http.delete('/api/vacancy/deleting/' + vm.vacancyToDelete._id)
		.success(function(response){
			vm.vacancies.splice(vm.index, 1);
		})
		.error(function(err){
			console.log(err);
		});
	}

	vm.addManager = function(){
		var manager = {
			firstname: vm.firstname,
			lastname: vm.lastname,
			email: vm.email,
			phone: vm.phone,
			password: vm.password,
			employerAccess: true,
			employer_id: vm.employer._id
		}

		$http.post('/api/user/signup/manager', manager)
		.success(function(response){
			vm.status = 'success';
			vm.message = 'Регистрация прошла успешно, пройдите по ссылке указанной в письме отправленное новому менеджеру на почту.';
         	setTimeout(function(){ vm.message = null; }, 3000);
		})
		.error(function(err){
			console.log(err);
			vm.status = 'error';
			vm.message = 'Произошла ошибка. Повторите попытку.';
         	setTimeout(function(){ vm.message = null; }, 3000);
		})
	}

    vm.keyWatcher = function(event){
   		vm.offersOpen = true;
		if(event.keyCode === 27) {
			vm.skill = '';
			vm.offersOpen = false;
		} else {
			vm.collectSkills();
		} 
	}

	vm.collectSkills = function(){
		$http.get('/api/getskills/' + vm.skill)
		.success(function(response){
			vm.offers = response;
		})
		.error(function(err){
			console.log(err);
		})
	}

	vm.selectSkill = function(skill){
		vm.skill = skill;
		vm.offersOpen = false;
	}

	vm.openEmployerEditor = function(){
		vm.editor = true;
		vm.objectToEdit = vm.employer;
	}

	vm.closeEmployerEditor = function(){
		vm.editor = false;
	}

	vm.editEmployer = function(){
		$http.put('/api/employer/editing', vm.objectToEdit)
		.success(function(response){
			vm.status = 'success';
			vm.message = 'Изменения успешно внесены';
			vm.closeEmployerEditor();
			setTimeout(function(){ vm.message = null;}, 3000);
		})
		.error(function(err){
			console.log(err);
			vm.closeEmployerEditor();
			vm.status = 'error';
			vm.message = 'Произошла ошибка, повторите попытку';
			setTimeout(function(){ vm.message = null;}, 3000);
		})
	}

	vm.openDeletation = function(){
		vm.deletation = true;
	}

	vm.closeDeletation = function(){
		vm.deletation = false;
	}

	vm.deleteEmployer = function(){
		$http.delete('/api/employer/deleting/' + $state.params.id)
		.success(function(response){
			$state.go('home');
		})
		.error(function(err){
			console.log(err);
		})
	}

}



