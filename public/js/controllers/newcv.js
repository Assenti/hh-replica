app.controller('NewCVCtrl', NewCVCtrl);

NewCVCtrl.$inject = ['$http', '$scope', '$state'];

function NewCVCtrl($http, $scope, $state){
	var vm = this;
	vm.skills = [];
	vm.success = false;
	vm.error = false;

	vm.addSkill = function(){
		vm.skills.push(vm.skill);
		vm.skill = '';
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

	vm.reset = function(){
   		vm.skills = [];
   		vm.position = vm.gender = vm.citizenship = vm.address = '';
   		vm.specialization = vm.education = vm.courses = vm.work = '';
   		vm.salary = vm.xpLength = 0;
   		vm.birthDate = '';
   	}
}