app.controller('VacancyCtrl', VacancyCtrl);

VacancyCtrl.$inject = ['$http', '$scope', '$state', '$rootScope', '$favourite'];

function VacancyCtrl($http, $scope, $state, $rootScope, $favourite){
	var vm = this;
	vm.editor = false;
	vm.skillsToEdit = [];
	vm.message = null;
	vm.modal = false;
	vm.favourite_active = false;

	vm.favourites = $favourite.getFavourites();
	for(let i = 0; i < vm.favourites.length; i++){
		if($state.params.id == vm.favourites[i]._id){
			vm.favourite_active = true;
		}
	}

	$http.get('/api/vacancy/view/' + $state.params.id)
	.success(function(response){
		vm.vacancy = response.vacancy;
	})
	.error(function(err){
		console.log(err);
	})

	if(!$rootScope.session.employerAccess) {
		$http.get('/api/cv/' + $rootScope.session._id)
		.success(function(response){
			console.log(response)
			vm.cvs = response;
		})
		.error(function(err){
			console.log(err);
		})
	}
	
	vm.responseToVacancy = function(){
		vm.isLoading = true;
		var data = {
			employer_id: vm.vacancy.employer,
			vacancy_id: vm.vacancy._id,
			employee_id: $rootScope.session._id,
			employee_firstname: $rootScope.session.firstname,
			employee_lastname: $rootScope.session.lastname,
			cv_position: vm.selected.position,
			cv_id: vm.selected._id
		}

		if(vm.selected.position == undefined){
			vm.status = 'error';
			vm.message = 'Резюме не выбрано. Выберите резюме и повторите попытку.';
			setTimeout(function(){ vm.message = null; }, 3000);
		} else {
			$http.post('/api/vacancy/responsed', data)
			.success(function(response){
				vm.isLoading = false;
				vm.status = 'success';
				vm.message = 'Отклик успешно отправлен.';
				setTimeout(function(){ vm.message = null; }, 3000);
			})
			.error(function(err){
				console.log(err);
				vm.isLoading = false;
				vm.status = 'error';
				vm.message = 'Произошла ошибка, повторите попытку.';
				setTimeout(function(){ vm.message = null; }, 3000);
			})
		}
	}

	
	vm.openModal = function(){
		vm.modal = true;
	}
	vm.closeModal = function(){
		vm.modal = false;
	}

	vm.addSkill = function(){
		if(vm.skill != null) {
			vm.skillsToEdit.push(vm.skill);
		}
		vm.skill = '';
	}
	vm.removeSkill = function(index){
		vm.skillsToEdit.splice(index, 1);
	}

	vm.openEditor = function(){
		vm.editor = true;
		vm.objectToEdit = vm.vacancy;
		for(var i = 0; i < vm.vacancy.skills.length; i++){
			vm.skillsToEdit.push(vm.vacancy.skills[i]);
		}
	}

	vm.closeEditor = function(){
		vm.editor = false;
		vm.objectToEdit = null;
		vm.skillsToEdit = [];
	}

	vm.editVacancy = function() {
		vm.objectToEdit.skills = vm.skillsToEdit;
		$http.put('/api/vacancy/editing', vm.objectToEdit)
		.success(function(response){
			vm.objectToEdit = null;
			vm.editor = false;
		})
		.error(function(err){
			console.log(err);
		})
	}

	vm.deleteVacancy = function(){
		$http.delete('/api/vacancy/deleting/' + vm.vacancy._id)
		.success(function(response){
			$state.go('employer', {id: vm.vacancy.employer });
		})
		.error(function(err){
			console.log(err);
		});
	}

	
	vm.toFavourite = function(vacancy){
		vm.favourite_active = true;
		$favourite.toFavourite(vacancy);
	}

	vm.fromFavourite = function(vacancy){
		vm.favourite_active = false;
		$favourite.fromFavourite(vacancy);
	}

}