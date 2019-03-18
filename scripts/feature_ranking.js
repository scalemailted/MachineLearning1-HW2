//Supervised Learning
//Feature ranking determines the correlation between known input features and known output

/*Strategy: determine correlation between catagorical data by determining if uniform 
probability between each catagory, thus no correlation. 
Or if there is a high probablity for a catagory above others, i.e. there is a correlation.
Example: monday (39) tues(36) wed(32) thur(31) fri(43) sat(42) sun (47)
Has a pretty equal distruction for fires above 0 for those days, thus not a good correlation between days and fire

*/

//dayData.filter((d,i) => d==7 && fireData[i]>0) 

const occurenceCorrelation = function(dataset, result, feature, labels)
{
	let featureData = getFeatureData(dataset, feature)
	let resultData = getFeatureData(dataset, result);
	let firecount = (resultData.filter( (d) => d>0 )).length //number of occurrences for fire feature
	sum = 0
	for (label of labels){
		let occurences = featureData.filter( (element,index) => element==label && resultData[index] > 0 );
		let probability = occurences.length / firecount //featureData.length;
		//if probability > (1/labels.length)
		console.log(label +": " +probability)
		sum += probability;

	}
	console.log('sum: ' + sum);
}

//occurenceCorrelation(data, yValue, 'day', [1,2,3,4,5,6,7])
//occurenceCorrelation(data, yValue, 'month', [1,2,3,4,5,6,7,8,9,10,11,12])