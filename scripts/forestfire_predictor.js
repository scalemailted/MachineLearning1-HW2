// using Promise
//fetch("/data/data.json")
//    .then(response => response.json())
//    .then(parsed => /* parsed contains the parsed json object */);
 
// or if you can use async/await
//let response = await fetch("./data/data.json");
//let parsed = await response.json();

/*
async function getData() {
    let response = await fetch("./data/data.json");
    let parsed = await response.json();
}

var data = getData()
*/

/*
var plots = document.getElementById("plots");

for (let json of data)
{
    //plots.innerHTML += JSON.stringify(json) //JSON.parse(json)
}
*/

//make_scatter_plot('X-Area', 'X', 'area');