app.controller('CVCtrl', CVCtrl);

CVCtrl.$inject = ['$http', '$scope', '$state', '$rootScope'];

function CVCtrl($http, $scope, $state, $rootScope){
	var vm = this;
	vm.editor = false;
	vm.skillsToEdit = [];

	$http.get('/api/cv/' + $state.params.id)
	.success(function(response){
		vm.cv = response.cv;
		vm.skills = response.skills;
		$http.get('/api/user/' + vm.cv.user)
		.success(function(response){
			vm.user = response;
		})
		.error(function(err){
			console.log(err);
		})
	})
	.error(function(err){
		console.log(err);
	})



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
		$http.delete('/api/cv/' + vm.cv.user + '/' + vm.cv._id)
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
		for(var i = 0; i < vm.skills.length; i++){
			vm.skillsToEdit.push(vm.skills[i].skill);
		}
	}

	vm.closeEditor = function(){
		vm.editor = false;
		vm.objectToEdit = null;
		vm.skillsToEdit = [];
	}

	vm.editCV = function() {
		vm.objectToEdit.skills = vm.skillsToEdit;
		$http.put('/api/cv', vm.objectToEdit)
		.success(function(response){
			vm.objectToEdit = null;
			vm.editor = false;
		})
		.error(function(err){
			console.log(err);
		})
	}

	vm.success = false;
	vm.error = false;
	vm.invite = function(user){
		var data = {
			employer_id: user.employer,
		}
		$http.post('/api/cv/responsed/' + $state.params.id, data)
		.success(function(response){
			vm.success = true;
		})
		.error(function(err){
			console.log(err);
			vm.error = true;
		})
	}


}


