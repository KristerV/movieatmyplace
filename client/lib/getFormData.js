getFormData = function(selector, acceptEmptyFields) {
	var data = {};

	$(selector).serializeArray().forEach(function(obj){
		if (obj.value || acceptEmptyFields !== true)
			data[obj.name] = obj.value;
	});

	return data;
}
