app.controller('CVCtrl', CVCtrl);

CVCtrl.$inject = ['$http', '$scope', '$state', '$rootScope'];

function CVCtrl($http, $scope, $state, $rootScope){
	var vm = this;
	vm.editor = false;
	vm.skillsToEdit = [];
	vm.message = null;


	if($rootScope.session){
		$http.get('/api/cv/view/' + $state.params.id + '/' + $rootScope.session._id)
		.success(function(response){
			vm.cv = response.cv;
			vm.skills = response.skills;
			vm.user = response.user;
		})
		.error(function(err){
			console.log(err);
		})
	} 

	if(!$rootScope.session){
		$http.get('/api/cv/view/' + $state.params.id + '/' + 1)
		.success(function(response){
			vm.cv = response.cv;
			vm.skills = response.skills;
			vm.user = response.data;
		})
		.error(function(err){
			console.log(err);
		})
	}
	

	vm.modal = false;
   	vm.openModal = function(cv, index){
   		vm.modal = true;
   		vm.cvToDelete = cv;
   		vm.index = index;
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

	vm.deleteCV = function(){
		$http.delete('/api/cv/deleting/' + vm.cv.user + '/' + vm.cv._id)
		.success(function(response){
			$state.go('user', {id: vm.cv.user });
		})
		.error(function(err){
			console.log(err);
		});
	}

	vm.openEditor = function(){
		vm.editor = true;
		vm.objectToEdit = vm.cv;
		for(var i = 0; i < vm.cv.skills.length; i++){
			vm.skillsToEdit.push(vm.cv.skills[i]);
		}
	}

	vm.closeEditor = function(){
		vm.editor = false;
		vm.objectToEdit = null;
		vm.skillsToEdit = [];
	}

	vm.editCV = function() {
		vm.objectToEdit.skills = vm.skillsToEdit;
		$http.put('/api/cv/editing', vm.objectToEdit)
		.success(function(response){
			vm.objectToEdit = null;
			vm.editor = false;
		})
		.error(function(err){
			console.log(err);
		})
	}

	vm.inviteEmployee = function(){
		vm.isLoading = true;
		var data = {
			cv_id: vm.cv._id,
			employer_id: $rootScope.session.employer,
		}
		$http.post('/api/cv/inviting', data)
		.success(function(response){
			vm.isLoading = false;
			vm.status = 'success';
			vm.message = 'Приглашение успешно отправлено.';
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


}


