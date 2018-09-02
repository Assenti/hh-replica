app.service('$favourite', LocalService);

function LocalService(){

	this.getFavourites = function(){
		if(localStorage.getItem('favourite')) {
			return JSON.parse(localStorage.getItem('favourite'));
		} else {
			return []
		}
	}

	this.toFavourite = function(vacancy){
		if(localStorage.getItem('favourite')){
			var favourite = JSON.parse(localStorage.getItem('favourite'));
			var index = favourite.findIndex(function(item) {
				return vacancy._id == item._id
			})
			if(index >= 0){
				favourite[index].count = (favourite[index].count * 1) + 1;
			} else {
				favourite.push({
					_id: vacancy._id,
					position: vacancy.position,
					salary: vacancy.salary,
					employer: vacancy.employer,
					count: 1
				})
			}
			localStorage.setItem('favourite', JSON.stringify(favourite));
		} else {
			var favourite = [];
			favourite.push({
				_id: vacancy._id,
				position: vacancy.position,
				salary: vacancy.salary,
				employer: vacancy.employer,
				count: 1
			})
			localStorage.setItem('favourite', JSON.stringify(favourite));
		}
	}

	this.fromFavourite = function(vacancy){
		var favourite = JSON.parse(localStorage.getItem('favourite'));
		var index = favourite.findIndex(function(item) {
			return vacancy._id == item._id
		})
		favourite.splice(index, 1);
		localStorage.setItem('favourite', JSON.stringify(favourite));
	}

	this.clearFavourites = function(){
		localStorage.clear('favourite');
	}
	
}