app.controller('FavouritesCtrl', FavouritesCtrl);

FavouritesCtrl.$inject = ['$http', '$scope', '$state', '$favourite'];

function FavouritesCtrl($http, $scope, $state, $favourite){
	var vm = this;

	vm.favourites = $favourite.getFavourites();

	vm.fromFavourite = function(vacancy){
		var index = vm.favourites.findIndex(function(item) {
			return vacancy._id == item._id
		})
		vm.favourites.splice(index, 1);
		$favourite.fromFavourite(vacancy);
	}

	vm.clearFavourites = function(){
		vm.favourites = [];
		$favourite.clearFavourites();
	}
}
