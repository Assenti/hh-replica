app.filter('salary', SalaryFilter);

function SalaryFilter(){
	return function(sum){
		var output = '';
		if(sum > 0) {
			if(sum > 10000 && sum < 100000){
				output = sum.toString();
				return output.slice(0, 2) + ' ' + output.slice(2, 5);
			}
			else if(sum > 100000 && sum < 1000000){
				output = sum.toString();
				return output.slice(0, 3) + ' ' + output.slice(3, 6);
			}
			else if(sum >= 1000000){
				output = sum.toString();
				return output.slice(0, 1) + ' ' + output.slice(1, 4) + ' ' + output.slice(4, 7);
			}

		}
	
	}
}

