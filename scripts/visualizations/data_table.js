//var modelerror_table = new DataTable('model-evaluations-table');
//modelerror_table.header(['Model','Average (MAE)','SD (MAE)','Average (RMSE)','SD (RMSE)']);

//id to unqiuely and dynamically name each html element
var id = 0;

class DataTable
{
	constructor(html_ID){
		this.id = html_ID;
		this.html = document.getElementById(html_ID);
		this.tbody = this.html.getElementsByTagName('tbody')[0];
		model_eval_sort();
	}

	addRow(row_data){
		let html_row = row_data.map( item => '<td>'+item+'</td>').join(' ');		
		this.tbody.innerHTML += `<tr>${html_row}</tr>`
	}

	addCollapsibleRow(row_data, hidden_data, footer_data, reg){
		let html_row = row_data.map( item => '<td>'+item+'</td>').join(' ');
		/*let html_row = row_data.map( item => 
				`<td>
					<a  
						href='#'
						data-target='#${row_data[0]}-${id}' 
						data-toggle='collapse'
						aria-expanded="false" 
						aria-controls='${row_data[0]}-${id}'>
						${item}
					</a>
				</td>`
			).join(' ');*/

		this.tbody.innerHTML += 
			`<tr data-toggle="collapse" data-target="#${row_data[0]}-${id}" class="clickable" aria-expanded="false"> 
				${html_row} 
				<td>
					<i class="fa fa-chevron-right pull-right"></i>
        			<i class="fa fa-chevron-down pull-right"></i>
				</td>
			</tr>`

		//#TEST
		this.tbody.innerHTML += 
		`<tr class='table-sm borderless table-secondary' >
			<td ></td>
			<td colspan='5' class='text-left'>
				<small>Reg:${reg.toExponential()} | ${footer_data.length} Features: [ ${footer_data} ]</small>
			</td>
		</tr>`
		
		console.log(hidden_data)
		
		let hidden_rows = 
			`<div class='row d-flex justify-content-center'>
				<div class='col-4'><b>Fold</b></div>
			 	<div class='col-4'><b>MAE</b></div>
			 	<div class='col-4'><b>RSME</b></div>
			 </div>`;

		for (let index in hidden_data)
		{
			let fold = hidden_data[index];
			hidden_rows += 
			`<div class='row d-flex justify-content-center'>
				<div class='col-4'>${index}</div>
			 	<div class='col-4'>${fold.mae.toFixed(3)}</div>
			 	<div class='col-4'>${fold.rsme.toFixed(3)}</div>
			 </div>
			`
		}

		this.tbody.innerHTML +=	
			`<tr class='collapse'
				id='${row_data[0]}-${id}'  
				style='background-color: white !important;'>
				<td colspan='6'>
					<div class='text-center'>
						${hidden_rows}
					</div>
				</td>
			</tr>`;

		id++;
	}

	makeList(array){
		for (i in array){
			let fold = array[i]
			this.tbody.innerHTML += 
				`<tr>
					<td>Fold ${i}</td>
					<td>MAE: ${fold['mae'].toFixed(4)}</td>
					<td>MRSE: ${fold['rsme'].toFixed(4) }</td>
				</tr>`
		}

	}
}




const addRow = function(html_ID, entry){
	let table = document.getElementById(html_ID);
	table.innerHTML +=
	`<tr>
      <th scope="col">Model</th>
      <th scope="col">Average (MAE)</th>
      <th scope="col">SD (MAE)</th>
      <th scope="col">Average (RMSE)</th>
      <th scope="col">SD (RMSE)</th>
    </tr>`
}

const addCollapsibleRow = function(){

}

const addColumn = function(){

}

/*
const sortTable = function(){

}
*/

const highlightRow = function(){

}

const highlightColumn = function(){

}

const clearTable = function(html_ID){
	let table = document.getElementById(html_ID);
	table.innerHTML = '';
	//add empty table html tags bootstrap
}

const sortTable = function(table_id, column) {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById(table_id);
  switching = true;
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 3); i+=3) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[column];
      y = rows[i + 3].getElementsByTagName("TD")[column];
      // Check if the two rows should switch place:
      if ( isNaN(x.innerHTML) && x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
        // If so, mark as a switch and break the loop:
        shouldSwitch = true;
        break;
      }
      else if ( !isNaN(x.innerHTML) && +x.innerHTML > +y.innerHTML){
        // If so, mark as a switch and break the loop:
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 3], rows[i]);
      rows[i].parentNode.insertBefore(rows[i + 4], rows[i+1]);
      rows[i].parentNode.insertBefore(rows[i + 5], rows[i+2]);
      switching = true;
    }
  }
}


const model_eval_sort= function(){
	var column_model = document.getElementById('col-model');
	column_model.addEventListener('click', () => sortTable('model-evaluations-table', 0) );

	var column_avg_mae = document.getElementById('col-avg-mae');
	column_avg_mae.addEventListener('click', () => sortTable('model-evaluations-table', 1) );

	var column_std_mae = document.getElementById('col-std-mae');
	column_std_mae.addEventListener('click', () => sortTable('model-evaluations-table', 2) );

	var column_avg_rmse = document.getElementById('col-avg-rmse');
	column_avg_rmse.addEventListener('click', () => sortTable('model-evaluations-table', 3) );

	var column_std_rmse = document.getElementById('col-std-rmse');
	column_std_rmse.addEventListener('click', () => sortTable('model-evaluations-table', 4) );
}












/*
<a data-toggle="collapse" data-target="#M1_error" aria-expanded="false" aria-controls="M1_error"></a>

<div class="collapse" id="M1_error">
	<div class="card card-body pt-2 mt-2">
		<b>show work:</b>

		<div>
			${\partial \over \partial \beta(t)_j} RSS\big(\beta(t)\big) = {\partial \over \partial \beta(t)_j} {1 \over N}\sum\limits_{i=1}^N\Big(\text{y}(i) - \text{x}(i)^T\beta(t)\Big)^2$
		</div>
	</div>
</div>
*/