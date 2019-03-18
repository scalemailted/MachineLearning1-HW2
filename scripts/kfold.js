var model_errors = [];

/*
* Returns an array populated with all integers from 0 to num
*/
function range(num){
	return [...Array(num).keys()];
}

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}


function chunkify(arr, n) {
    let out = [];
    let i = 0;
    while (i < arr.length) {
	    let size = Math.ceil( (arr.length - i) / n-- );
	    out.push( arr.slice(i, i += size) );
    }
    return out;
}

/*
* Generate K-Fold subset Datasets 
*/
function getKFolds(dataset, k){
	shuffle(dataset)
	let kFolds = chunkify(dataset, k);
	return kFolds;
}

/*flattens a multi-dimensional array into a 1d array*/
flatten = (arr) => [].concat(...arr);

/*get all subsets data, not including the testing set*/
getTraining = (arr, test) => flatten( arr.filter( d => d !== test ));

/*Train Model*/
crossValidation = function(dataset, featureList, model_order, yValue, regularization){
	let fold10 = getKFolds(dataset, 10);
	let results = []
	let model;
	for(i in fold10 ){
		let testingData = fold10[i];
		let trainingData = getTraining(fold10, testingData)
		model = trainRegressionModel(trainingData, featureList, model_order, yValue, regularization);
		console.log("Fold #" + i)
		let error = testRegressionModel(testingData, model);
		results.push(error)
	}
	reportResults(model, results);
	return model;

}

var trainRegressionModel = function(trainingData, featureList, model_order, yValue, regularization){
	let model = make_model(trainingData, yValue, featureList, model_order, regularization);
	showBetaValues('m1',featureList, model.B, model_order, regularization) //#TODO: update showBetaValues for regs
	return model;
}

var testRegressionModel = function(testingData, model){
	let testingY = getY(testingData, model.yLabel);
	let testingX = getX(testingData, model.features, model.order);
	let rsme = calculateRSME(testingY, testingX, model.B);
	let mae = calculateMAE(testingY, testingX, model.B);
	console.log( "(M"+model.order+") RSME: " + rsme );
	console.log( "(M"+model.order+") MAE: " + mae );
	return {'rsme':rsme, 'mae': mae};
}


const getErrors = (array, err_type) => array.map( fold => fold[err_type] );
const getAverage = array => array.reduce( (total, item) => total+= item ) / array.length; 
const getStdDev = array => math.std(array);

const reportResults = function(model, results){	
	//Get generalized MAE results
	mae = getErrors(results, 'mae');
	mae_avg = getAverage(mae);
	mae_std = getStdDev(mae);
	//Get geenralized RSME results
	rsme = getErrors(results, 'rsme');
	rsme_avg = getAverage(rsme);
	rsme_std = getStdDev(rsme);

	let table = new DataTable('model-evaluations-table');
	row_data = [model.name, mae_avg.toFixed(2), mae_std.toFixed(2), rsme_avg.toFixed(2), rsme_std.toFixed(2)]
	footer_data = model.features;
	//table.addRow(row_data);
	table.addCollapsibleRow(row_data, results, footer_data, model.regularization);
	//table.addRow(results);
	//table.makeList(results);

	let error_data = {'name':model.name,'order':model.order,'features': model.features,'mae':mae_avg,'rmse':rsme_avg};
	model_errors.push(error_data); 
	//plot_errors();
	update_error_plots(model_errors);
}




//featureList_Top5 = [	'temp','RH','DMC', 'X','month']
//crossValidation(data, featureList, 1, yValue);
//crossValidation(data, featureList, 2, yValue);
//crossValidation(data, featureList, 4, yValue);
//crossValidation(data, featureList, 6, yValue);
