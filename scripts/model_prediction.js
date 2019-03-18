/*
* Model Prediction: 
* You will need to predict the model or learners using non-iterative equation:
* B = inv(X'*X)*X'*Y
* For models of order M=1,2,4,6 and a value of your choice (YC)
* using (a) all the 12 input features and (b) top 5 input features from Table#1
*/

console.log("Model Prediction")

//Step 1: Normalize dataset with values between 0 to 1.
const normalize = (val, min, max) => (val - min)/(max - min);

const normalize_feature = function(dataset, feature){
	let max = d3.max(dataset, d => d[feature] );
    let min = d3.min(dataset, d => d[feature] );
    dataset.forEach( d => d[feature] = normalize( d[feature], min, max) );
}

const normalize_dataset = function(dataset, featureList){
	featureList.map( feature => normalize_feature(dataset, feature) );
}

//Step 2: Make Y Vector 
const getY = (dataset, yVal) => math.matrix( dataset.map(d => d[yVal]) );

//Step 3: Make X Matrix
const getX = function(dataset, featureList, model_order)
{
	let arrays = []
	let x0 = new Array( dataset.length ).fill(1) 
	arrays.push( x0) 
	for (let feature of featureList){
		for (let pow=1; pow<=model_order; pow++){
			arrays.push( (dataset.map( d => d[feature])).map(x => x**pow)  );
		}
	}
	return math.chain(arrays)
				.matrix()
				.transpose()
				.done();
}

//Step 4: Make B Vector (i.e. coefficients) where: B = inv(X'*X)*X'*Y
const getB = function(X,Y,regularization)
{
	let B = math.chain(X)
			.transpose()
			.multiply(X)
			.add(regularization)
			.inv()
			.multiply(math.transpose(X))
			.multiply(Y)
			.done()

	return B;
}

//TODO: REFACTOR

var setBetaInHTML = function(id, index, feature, bVal, pow )
{
	let table = document.getElementById(id);
	pow = (pow >1) ? pow : ''  
	table.innerHTML += 
	    `<tr>
	      <th scope="row"> <i>B<sub>${index}</sub></i></th>
	      <td> ${feature} <i><sup>${pow}</sup></i> </td>
	      <td> ${bVal.toFixed(4)} </td>
	    </tr>`;
}

//TODO param to pass in inputs
var showBetaValues = function(html_id, featureList, B, model_order ,regularization)
{
	//TODO CREATE NEW TABLE & ADD TO HTML DOCUMENT WITH MODEL HEADER AND FEATURE LIST 
	setBetaInHTML(html_id, 0, '-', B._data[0], 0)
	let index = 1;
	for (feature of featureList){
		for (let pow=1; pow<=model_order; pow++){
			setBetaInHTML(html_id, index, feature, B._data[index++], pow);
		}
	}
}

var calculateResidual = function(Y, X, B)
{
	let XtB = math.chain(X)
			//.transpose()
			.multiply(B)
			.done();

	return math.subtract(Y, XtB).toArray();
}

var calculateRSME = function(Y, X, B){
	let residual = calculateResidual(Y, X, B);
	let n = residual.length;
	let rss = residual.reduce( (total, item) => total += item**2  )
	return Math.sqrt( (rss/n) )
}


//Y - XT * B
/*
var calculateRSME = function(Y, X, B){
	let XtB = math.chain(X)
				.transpose()
				.multiply(B)
				.done()

	let residual = math.subtract(Y, XtB).toArray()
	let n = residual.length;
	let rss = residual.reduce( (total, item) => total += item**2  )
	return Math.sqrt( (rss/n) )
}
*/

var calculateMAE = function(Y, X, B){
	let residual = calculateResidual(Y, X, B);
	let n = residual.length;
	let rsa = residual.reduce( (total, item) => total += Math.abs(item)  )
	return rsa/n
}

//Test RSS
/*
var make_model = function(model_order)
{
	var B = produceBetas(model_order);
	var X = math.matrix( getXMatrix(norm_dataset,features,model_order) )
	console.log( "(M"+model_order+") RSME: " + calculateRSME(Y, X, B) ); 
	console.log( "(M"+model_order+") MAE: "  + calculateMAE(Y, X, B) ); 
}
*/
const make_model = function(dataset, yValue, featureList, model_order, regularization)
{
	//normal_data = JSON.parse(JSON.stringify(dataset))
	//normalize_dataset(normal_data, featureList);
	let Y = getY(dataset, yValue);
	let X = getX(dataset, featureList, model_order);
	let B = getB(X,Y,regularization);
	let name = 'M'+model_order;
	//showBetaValues('m1',featureList, B, model_order)
	//console.log( "(M"+model_order+") RSME: " + calculateRSME(Y, X, B) ); 
	//console.log( "(M"+model_order+") MAE: "  + calculateMAE(Y, X, B) );
	return {'B':B, 'order':model_order, 'features':featureList, 'yLabel': yValue, 'name':name, 'regularization':regularization};
}

//make_model(data, yValue, featureList, 2);










//TODO convert days and months into collection of new binary variables
var categoricalEncode = function(labelsArray, value)
{
	let size = labelsArray.length;
	binArray = new Array(size).fill(0)
	let index = labelsArray.indexOf(value);
	binArray[index] = 1
	return binArray.join("")
}

//test method
//var labelsArray = ['mon','tues','wed', 'thu', 'fri', 'sat', 'sun']
//categoricalEncode(labelsArray,'mon')


