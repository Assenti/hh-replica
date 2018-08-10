app.controller('EmployerDashboardCtrl', EmployerDashboardCtrl);

EmployerDashboardCtrl.$inject = ['$http', '$scope', '$state', '$rootScope'];

function EmployerDashboardCtrl($http, $scope, $state, $rootScope){
	var vm = this;

	$http.get('/api/employer/' + $state.params.id)
	.success(function(response){
		vm.employer = response;
	})
	.error(function(err){
		console.log(err);
	})

	vm.createVacancy = function(){
		var data = {
			body: vm.body
		}

		$http.post('/api/comment/' + $state.params.id, data)
		.success(function(response){
			vm.post.comments.push(response);
			console.log(response);
		})
		.error(function(err){
			console.log(err);
		})
	}

	vm.editVacancy = function() {
		$http.put('/api/comment', vm.objectToEdit)
		.success(function(response){
			console.log(response);
		})
		.error(function(err){
			console.log(err);
		})
	}

	vm.deleteVacancy = function(index, comment){
		$http.delete('/api/comment/' + comment._id + '/' + comment.post)
			.success(function(response){
				vm.post.comments.splice(index, 1);
			})
			.error(function(err){
				console.log(err);
			});
	}
}