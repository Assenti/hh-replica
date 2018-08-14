app.controller('VacancyCtrl', VacancyCtrl);

VacancyCtrl.$inject = ['$http', '$scope', '$state', '$rootScope'];

function VacancyCtrl($http, $scope, $state, $rootScope){
	var vm = this;
	vm.editor = false;
	vm.skillsToEdit = [];

	$http.get('/api/vacancy/' + $state.params.id)
	.success(function(response){
		vm.vacancy = response.vacancy;
		vm.skills = response.skills;
		vm.employerReps = response.users;
		console.log(response);
	})
	.error(function(err){
		console.log(err);
	})

	vm.success = false;
	vm.error = false;
	vm.response = function(user){
		var data = {
			user_id: user._id
		}
		$http.post('/api/vacancy/responsed/' + $state.params.id, data)
		.success(function(response){
			vm.success = true;
		})
		.error(function(err){
			console.log(err);
			vm.error = true;
		})
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