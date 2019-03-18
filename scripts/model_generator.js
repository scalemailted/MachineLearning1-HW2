var models_list = [];

var html_generator = document.getElementById('model-generator');
html_generator.addEventListener("click", () => generateModel() );

const generateModel = function(){
	let html_model_order = document.getElementById('model-order');
	let html_feature_list = document.getElementById('feature-selection');
	let html_regularization = document.getElementById('regularization-selection');
	let model_order = html_model_order.value;
	let features;
	switch( html_feature_list.value){
		case 'ALL': features = ['X','Y','month','day', 'FFMC','DMC','DC','ISI','temp','RH','wind','rain']; break
		case 'TOP5': features = ['temp','RH','DMC','X','month']; break;
	}
	let regularization = +html_regularization.value

	//let html_model_list = document.getElementById('generated-models-list')
	//html_model_list.innerHTML += '<li class="text-success">Calculating New Model...</li>';
	//html_model_list.innerHTML = '<li class="text-success">Calculating New Model...</li>';
	displayWaitMessage();

	//let model = crossValidation(data, features, model_order, yValue);
	//models_list.push(model);
	//displayModelList();
	setTimeout( () => initModel(data, features, model_order, yValue, regularization) , 100);


}

const displayModelList = function(){
	let html_list = document.getElementById('generated-models-list');
	html_list.innerHTML = '';
	for (let index in models_list){
		let model = models_list[index];
		let order;
		switch(model.order){
			case '1':  order = '1st'; break;
			case '2':  order = '2nd'; break;
			case '3':  order = '3rd'; break;
			default: order = model.order + 'th';  
		}

		html_list.innerHTML += 
			`<li>
				(${model.name}) ${order}-order model - ${ model.features.length } Features 
				<span class='text-secondary'>
					<small><i>${ model.features.toString() }</i> </small>
					<small><i>| Reg: ${model.regularization.toExponential()}</i></small>
				</span>
			</li>`
	}

}

const displayWaitMessage = function(){
	let html_model_list = document.getElementById('generated-models-list');
	html_model_list.innerHTML += 
		`<li class='text-success'>
			Calculating New Model... [This may take a few moments]
		</li>`;

}

const initModel = function(data, features, model_order, yValue, regularization){
	let model = crossValidation(data, features, model_order, yValue, regularization);
	models_list.push(model);
	displayModelList();
}


