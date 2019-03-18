/*
* Model Prediction: 
* You will need to predict the model or learners using non-iterative equation:
* B = inv(X'*X)*X'*Y
* For models of order M=1,2,4,6 and a value of your choice (YC)
* using (a) all the 12 input features and (b) top 5 input features from Table#1
*/

console.log("Model Prediction")

//Step 1: Normalize dataset with values between 0 to 1.
//dx = (x - minx) / (maxx - minx)
const normalize = (val, min, max) => (val - min)/(max - min);

const normalize_feature = function(dataset, feature)
{
	let max = d3.max(dataset, d => d[feature] );
    let min = d3.min(dataset, d => d[feature] );
    dataset.forEach( d => d[feature] = normalize( d[feature], min, max) );
}

const normalize_dataset = function(dataset)
{
	let inputs = ['X','Y','month','day','FFMC','DMC','DC','ISI','temp','RH','wind','rain'];
	inputs.map( feature => normalize_feature(dataset, feature) );
}

norm_dataset = JSON.parse(JSON.stringify(dataset))
normalize_dataset(norm_dataset);

//Step 2: Make Y Vector
var Y = math.matrix( norm_dataset.map(d => d['area']) );

//TODO: param take custom set of inputs
//TODO support polynomial of features
//Step 3: Make X Matrix
const getAllFeatures = function(dataset)
{
	let arrays = []
	let x0 = new Array( dataset.length ).fill(1) 
	arrays.push( x0) 
	let inputs = ['X','Y','month','day','FFMC','DMC','DC','ISI','temp','RH','wind','rain'];
	for (let feature of inputs){
		arrays.push( dataset.map( d => d[feature]) );
	}
	return arrays
}

var calculateBetas = function(model_order)
{
	//var X = math.transpose( math.matrix( getAllFeatures(norm_dataset) ) );
	var features = ['X','Y','month','day','FFMC','DMC','DC','ISI','temp','RH','wind','rain'];
	var X = math.transpose( math.matrix( getXMatrix(norm_dataset,features,model_order) ) );

	//Step 4: Make B Vector (i.e. coefficients) where: B = inv(X'*X)*X'*Y
	var B = math.chain(X)
			.transpose()
			.multiply(X)
			.inv()
			.multiply(math.transpose(X))
			.multiply(Y)
			.done()

	return B;
}

/*
var XT = math.transpose(X);
var XTX = math.multiply(XT, X);
var iXTXi = math.inv(XTX);
var iXTXiXT = math.multiply(iXTXi, XT);
var iXTXiXTY = math.multiply(iXTXiXT, Y);
*/


var appendBetaTable = function(id, index, feature, bVal, pow )
{
	let table = document.getElementById(id);
	if (pow == 1)
	{
		table.innerHTML += 
	    `<tr>
	      <th scope="row">${"$B_{"+index+"}$"}</th>
	      <td>${feature}</td>
	      <td>${bVal}</td>
	    </tr>`;
	}
	else
	{
		table.innerHTML += 
	    `<tr>
	      <th scope="row">${"$B_{"+index+"}$"}</th>
	      <td>${"$\\text{"+feature+"}^{"+pow+"}$"}</td>
	      <td>${bVal}</td>
	    </tr>`;
	}
}

//TODO param to pass in inputs
/*
var showBetaValues = function(B)
{
	let inputs = ['-','X','Y','month','day','FFMC','DMC','DC','ISI','temp','RH','wind','rain'];
	inputs.forEach( (feature, index) => appendBetaTable('m1', index, feature, B._data[index] ) )
}*/

//TODO param to pass in inputs
var showBetaValues = function(B, model_order)
{
	let inputs = ['X','Y','month','day','FFMC','DMC','DC','ISI','temp','RH','wind','rain'];
	//inputs.forEach( (feature, index) => appendBetaTable('m1', index, feature, B._data[index] ) )
	appendBetaTable('m1', 0, '-', B._data[0], 1)
	let index = 1;
	for (feature of inputs){
		for (let pow=1; pow<=model_order; pow++){
			appendBetaTable('m1', index, feature, B._data[index], pow);
			index++;
		}
	}
}

//getBetaValues();


//Next Part:
//Calculate Models M2, M4, M6
//Where: M2: B0 + B1(X_1) + B2(X_1^2) + B3(X_2) + B4(X_2^2) + ... + BM(X_k) + BN(X_k^2)

//TODO: param take custom set of inputs
//TODO support polynomial of features
//Step 3: Make X Matrix
var features = ['X','Y','month','day','FFMC','DMC','DC','ISI','temp','RH','wind','rain'];
const getXMatrix = function(dataset, features, model_order)
{
	let arrays = []
	let x0 = new Array( dataset.length ).fill(1) 
	arrays.push( x0) 
	for (let feature of features){
		for (let i=1; i<=model_order; i++){
			arrays.push( (dataset.map( d => d[feature])).map(e => e**i)  );
			//let xVals = dataset.map(d => d[feature])
			//xVals = xVals.map( n => n**i);
			//arrays.push( xVals);
		}
	}
	return arrays
}

//getXMatrix(norm_dataset, features, 1)

var produceBetas = function(model_order)
{
	let B = calculateBetas(model_order);
	showBetaValues(B, model_order);
	return B
}

//B = produceBetas(1);


var calculateResidual = function(Y, X, B)
{
	let XtB = math.chain(X)
			.transpose()
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
var make_model = function(model_order)
{
	var B = produceBetas(model_order);
	var X = math.matrix( getXMatrix(norm_dataset,features,model_order) )
	console.log( "(M"+model_order+") RSME: " + calculateRSME(Y, X, B) ); 
	console.log( "(M"+model_order+") MAE: "  + calculateMAE(Y, X, B) ); 
}

make_model(1);






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


