app.filter('myDate', DateFilter);

function DateFilter(){
	var monthsRu = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];
	return function(date){
		
		var splittedData = [];
		splittedData = date.split(/[-|,|:|T|.]/);
		
		var year = splittedData[0];
		var month = splittedData[1];
		var day = splittedData[2];
		
		var hh = splittedData[3];
		var mm = splittedData[4];
		var ss = splittedData[5];

		var computedMonth = function(month){
			if(month[0] == 0){
				return month[1];
			} else {
				return month;
			}
		}
		var index = computedMonth(month);

		if (!date) { return ''; }
		if(date.length > 1) {
			return day + ' ' + monthsRu[index-1] + ' ' + year + ' года';
		}
	}
	
}