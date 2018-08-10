app.controller('EmployeeDashboardCtrl', EmployeeDashboardCtrl);

EmployeeDashboardCtrl.$inject = ['$http', '$scope', '$state', '$rootScope'];

function EmployeeDashboardCtrl($http, $scope, $state, $rootScope){
	var vm = this;
	vm.skills = [];
	
	$http.get('/api/user/' + $state.params.id)
	.success(function(response){
		vm.user = response;
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
		var data = new FormData();

		data.append('position', vm.position);
		data.append('salary', vm.salary);
		data.append('birthDate', vm.birthDate);
		data.append('gender', vm.gender);
		data.append('citizenship', vm.citizenship);
		data.append('address', vm.address);
		data.append('phone', vm.phone);
		data.append('specialization', vm.specialization);
		data.append('xpLength', vm.xpLength);
		data.append('education', vm.education);
		data.append('courses', vm.courses);
		data.append('work', vm.work);
		data.append('skills', vm.skills);
		data.append('file', vm.file);

		$http.post('/api/cv/' + $state.params.id, data, {
			headers: {'Content-Type': undefined },
			transformRequest: angular.identity
		})
		.success(function(response){
			vm.user.cv.push(response);
		})
		.error(function(err){
			console.log(err);
		})
		
	}

	vm.openCVMaker = function(){
		$("#cvForm").slideDown("slow");
	}

	vm.closeCVMaker = function(){
		$("#cvForm").slideUp("slow");
   	};

}