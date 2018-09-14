app.controller('NewCVCtrl', NewCVCtrl);

NewCVCtrl.$inject = ['$http', '$scope', '$state', '$rootScope'];

function NewCVCtrl($http, $scope, $state, $rootScope){
	var vm = this;
	vm.skills = [];
	vm.message = null;

	vm.addSkill = function(){
		vm.skills.push(vm.skill);
		vm.skill = '';
	}
	vm.removeSkill = function(index){
		vm.skills.splice(index, 1);
	}

	vm.saveCV = function(){
		vm.isLoading = true;
		if(vm.file == undefined){
			var data = {
				employee_id: $rootScope.session._id,
				firstname: $rootScope.session.firstname,
				lastname: $rootScope.session.lastname,
				phone: $rootScope.session.phone,
				email: $rootScope.session.email,
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

			$http.post('/api/cv/addcv', data)
			.success(function(response){
				vm.isLoading = false;
				vm.status = 'success';
				vm.message = 'Резюме успешно добавлено.';
				setTimeout(function(){ vm.message = null; }, 3000);
				$('html, body').animate({scrollTop: 0}, 'slow');
			})
			.error(function(err){
				console.log(err);
				vm.isLoading = false;
				vm.status = 'error';
				vm.message = 'Произошла ошибка, повторите попытку.';
				setTimeout(function(){ vm.message = null; }, 3000);
			})
		} else {
			var data = new FormData();
			data.append('employee_id', $rootScope.session._id);
			data.append('firstname', $rootScope.session.firstname);
			data.append('lastname', $rootScope.session.lastname);
			data.append('email', $rootScope.session.email);
			data.append('phone', $rootScope.session.phone);
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

			$http.post('/api/cv/addcv/withphoto', data, {
				headers: {'Content-Type': undefined },
				transformRequest: angular.identity
			})
			.success(function(response){
				vm.isLoading = false;
				vm.status = 'success';
				vm.message = 'Резюме успешно добавлено.';
				setTimeout(function(){ vm.message = null; }, 3000);
				$('html, body').animate({scrollTop: 0}, 'slow');
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

	vm.reset = function(){
   		$state.reload();
   	}

   	vm.getFile = function(){
   		$('#photo').click()
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
   			console.log(response)
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