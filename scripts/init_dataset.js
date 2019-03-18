var data = JSON.parse(JSON.stringify(forestfire_data)) //[...forestfire_data] 
/*
var featureList = [ 'month', 'day','X','Y','X1','X2','X3','X4','X5','X6','X7','X8','X9',
				 'Y1','Y2','Y3','Y4','Y5','Y6','Y7','Y8','Y9',
				 'jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec',
				 'mon','tue','wed','thu','fri','sat','sun',
				 'FFMC','DMC','DC','ISI','temp','RH','wind','rain'];
*/
var featureList = ['X','Y','month','day', 'FFMC','DMC','DC','ISI','temp','RH','wind','rain'];

var yValue = 'area';

//convert labeled data into numerical data
var months = ['','jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
var days = ['','mon','tue','wed','thu','fri','sat','sun'];

let getMonths = () => ({'jan':0,'feb':0,'mar':0,'apr':0,'may':0,'jun':0, 
						'jul':0,'aug':0,'sep':0,'oct':0,'nov':0,'dec':0 });

let getDays = () => ({'mon':0,'tue':0,'wed':0,'thu':0,'fri':0,'sat':0,'sun':0});

let getXMap = () => ({'X1':0,'X2':0,'X3':0,'X4':0,'X5':0,'X6':0,'X7':0,'X8':0,'X9':0});

let getYMap = () => ({'Y1':0,'Y2':0,'Y3':0,'Y4':0,'Y5':0,'Y6':0,'Y7':0,'Y8':0,'Y9':0});


let update_labels = function(json){
	//Update Day/Month labels into binary fields
	//Object.assign(json, getMonths() );
	//Object.assign(json, getDays()   );
	//json[ json.day   ] = 1;
	//json[ json.month ] = 1;
	//Update X/Y labels into binary fields
	//Object.assign(json, getXMap()  );
	//Object.assign(json, getYMap()  );
	//json[ 'X'+json.X ] = 1;
	//json[ 'Y'+json.Y ] = 1;
	//json.day = categoricalEncode(days, json.day);
	//json.month = categoricalEncode(months, json.month);
	json.month = months.indexOf(json.month);
	json.day = days.indexOf(json.day);
}




//TODO convert days and months into collection of new binary variables
var categoricalEncode = function(labelsArray, value)
{
	let size = labelsArray.length;
	binArray = new Array(size).fill(0)
	let index = labelsArray.indexOf(value);
	binArray[index] = 1
	return binArray.join("")
}


data.forEach( row => update_labels(row)  )
//featureList = featureList.filter( x => d3.max(data, d => d[x]) > 0);