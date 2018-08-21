app.controller('EmployeeDashboardCtrl', EmployeeDashboardCtrl);

EmployeeDashboardCtrl.$inject = ['$http', '$scope', '$state', '$rootScope'];

function EmployeeDashboardCtrl($http, $scope, $state, $rootScope){
	var vm = this;
	vm.skills = [];
	vm.invites = 0;
	vm.success = false;
	vm.error = false;
	
	$http.get('/api/cv')
	.success(function(response){
		vm.cvs = response;
		for(var i = 0; i < vm.cvs.length; i++){
			vm.invites += vm.cvs[i].responses.length;
		}
	})
	.error(function(err){
		console.log(err);
	})


	$http.get('/api/vacancy')
	.success(function(response){
		vm.vacancies = response;
	})
	.error(function(err){
		console.log(err);
	})

	vm.addSkill = function(){
		vm.skills.push(vm.skill);
	}
	vm.removeSkill = function(index){
		vm.skills.splice(index, 1);
	}

	vm.saveCV = function(){
		if(vm.file == undefined){
			var data = {
				position: vm.position,
				salary: vm.salary,
				birthDate: vm.birthDate,
				gender: vm.gender,
				citizenship: vm.citizenship,
				address: vm.address,
				specialization: vm.specialization,
				xpLength: vm.xpLength,
				education: vm.education,
				courses: vm.courses,
				work: vm.work,
				skills: vm.skills
			}
			$http.post('/api/cv/' + $state.params.id, data)
			.success(function(response){
				vm.cvs.push(response);
				vm.success = true;
				vm.closeCVMaker();
			})
			.error(function(err){
				console.log(err);
				vm.error = true;
			})
		} else {
			var data = new FormData();
			data.append('position', vm.position);
			data.append('salary', vm.salary);
			data.append('birthDate', vm.birthDate);
			data.append('gender', vm.gender);
			data.append('citizenship', vm.citizenship);
			data.append('address', vm.address);
			data.append('specialization', vm.specialization);
			data.append('xpLength', vm.xpLength);
			data.append('education', vm.education);
			data.append('courses', vm.courses);
			data.append('work', vm.work);
			data.append('skills', vm.skills);
			data.append('file', vm.file);
			$http.post('/api/cv/file/' + $state.params.id, data, {
				headers: {'Content-Type': undefined },
				transformRequest: angular.identity
			})
			.success(function(response){
				vm.cvs.push(response);
				vm.success = true;
				vm.closeCVMaker();
			})
			.error(function(err){
				console.log(err);
				vm.error = true;
			})
		}		
	}

	vm.openCVMaker = function(){
		$("#cvForm").slideDown("slow");
	}

	vm.closeCVMaker = function(){
		$("#cvForm").slideUp("slow");
		vm.reset();
   	};

   	vm.reset = function(){
   		vm.skills = [];
   		vm.position = vm.gender = vm.citizenship = vm.address = '';
   		vm.specialization = vm.education = vm.courses = vm.work = '';
   		vm.salary = vm.xpLength = 0;
   		vm.birthDate = '';
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

   	vm.deleteCV = function(){
		$http.delete('/api/cv/' + $state.params.id + '/' + vm.cvToDelete._id)
		.success(function(response){
			vm.cvs.splice(vm.index, 1);
		})
		.error(function(err){
			console.log(err);
		});
	}

}