app.controller('VacancyCtrl', VacancyCtrl);

VacancyCtrl.$inject = ['$http', '$scope', '$state', '$rootScope'];

function VacancyCtrl($http, $scope, $state, $rootScope){
	var vm = this;
	vm.editor = false;
	vm.skillsToEdit = [];
	vm.message = null;

	$http.get('/api/vacancy/' + $state.params.id)
	.success(function(response){
		vm.vacancy = response.vacancy;
		vm.skills = response.skills;
		vm.employerReps = response.users;
	})
	.error(function(err){
		console.log(err);
	})

	if($rootScope.session != undefined) {
		$http.get('/api/user/' + $rootScope.session._id)
		.success(function(response){
			vm.cvs = response.cv;
			vm.cvs.unshift({ position: 'Выберите резюме' })
			vm.selected = vm.cvs[0];
		})
		.error(function(err){
			console.log(err);
		})
	}
	
	vm.response = function(){
		vm.isLoading = true;
		var data = {
			user_id: $rootScope.session._id,
			cv_position: vm.selected.position,
			cv_id: vm.selected._id
		}

		if(vm.selected.position == 'Выберите резюме' || vm.selected.position == undefined){
			vm.status = 'error';
			vm.message = 'Резюме не выбрано. Выберите резюме и повторите попытку.';
		} else {
			$http.post('/api/vacancy/responsed/' + $state.params.id, data)
			.success(function(response){
				vm.isLoading = false;
				vm.status = 'success';
				vm.message = 'Отклик успешно отправлен.';
			})
			.error(function(err){
				console.log(err);
				vm.isLoading = false;
				vm.status = 'error';
				vm.message = 'Произошла ошибка, повторите попытку.';
			})
		}
	}

	vm.modal = false;
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
		for(var i = 0; i < vm.skills.length; i++){
			vm.skillsToEdit.push(vm.skills[i].skill);
		}
	}

	vm.closeEditor = function(){
		vm.editor = false;
		vm.objectToEdit = null;
		vm.skillsToEdit = [];
	}

	vm.editVacancy = function() {
		vm.objectToEdit.skills = vm.skillsToEdit;
		$http.put('/api/vacancy', vm.objectToEdit)
		.success(function(response){
			vm.objectToEdit = null;
			vm.editor = false;
		})
		.error(function(err){
			console.log(err);
		})
	}

	vm.deleteVacancy = function(){
		$http.delete('/api/vacancy/' + vm.vacancy.employer + '/' + vm.vacancy._id)
		.success(function(response){
			$state.go('employer', {id: vm.vacancy.employer });
		})
		.error(function(err){
			console.log(err);
		});
	}

}