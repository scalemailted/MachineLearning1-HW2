//Pearson Coefficient Correlation

/** Compute Pearson's correlation coefficient */
var computePearsons = function (arrX, arrY) {
    var num = covariance(arrX, arrY);
    var denom = d3.deviation(arrX) * d3.deviation(arrY);
    return num / denom;
}

/** Computes the covariance between random variable observations
 * arrX and arrY
 */
var covariance = function (arrX, arrY) {
    var u = d3.mean(arrX);
    var v = d3.mean(arrY);
    var arrXLen = arrX.length;
    var sq_dev = new Array(arrXLen);
    var i;
    for (i = 0; i < arrXLen; i++)
        sq_dev[i] = (arrX[i] - u) * (arrY[i] - v);
    return d3.sum(sq_dev) / (arrXLen - 1);
}

/*
* Get all the values from a column in a dataset
*/
var getFeatureData = function(dataset, feature){
	return dataset.map( d => d[feature]);
}

var appendPCCTable = function(index, feature, result, pcc)
{
	let table = document.getElementById('pcc');
	table.innerHTML += 
    `<tr>
      <th scope="row">${index}</th>
      <td>${feature}</td>
      <td>${result}</td>
      <td>${pcc}</td>
    </tr>`;
}

var getPCC = function(dataset, feature, index)
{
	let x = getFeatureData(dataset, feature);
	let y = getFeatureData(dataset, 'area')
	let result = computePearsons(x,y);
	//console.log( feature +', area: '+ result)
	appendPCCTable(index+1, feature, 'area', result.toFixed(4) );
}

var compare = function(a,b)
{
	let x1 = getFeatureData(dataset, a);
	let x2 = getFeatureData(dataset, b);
	let y = getFeatureData(dataset, 'area');
	let result1 = computePearsons(x1, y);
	let result2 = computePearsons(x2, y);
	return (Math.abs(result2) - Math.abs(result1));
}
/*******************************************************************/
/*******************************************************************/
/*******************************************************************/

var inputs = ['X','Y','month','day','FFMC','DMC','DC','ISI','temp','RH','wind','rain'];
var outputs = ['area'];

inputs.sort( (a, b) => compare(a,b) )
inputs.forEach( (feature, index) => getPCC(dataset, feature, index) )


/*
for (feature of inputs)
{
	let x = getFeatureData(dataset, feature);
	let y = getFeatureData(dataset, 'area')
	let result = computePearsons(x,y);
	console.log( feature +', area: '+ result)
	appendPCCTable(feature, 'area', result.toFixed(4) );
}*/
